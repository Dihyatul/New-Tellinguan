// One-off migration: re-encrypts users.email/instansi/nim_nisn from OLD_DB_ENCRYPTION_KEY
// to NEW_DB_ENCRYPTION_KEY. Run this BEFORE switching DB_ENCRYPTION_KEY in production,
// against the same database the app currently points at.
//
// Usage:
//   OLD_DB_ENCRYPTION_KEY=<current key> NEW_DB_ENCRYPTION_KEY=<new key> DATABASE_URL=<db url> \
//     node scripts/rotate-db-encryption-key.js
//
// Take the app offline (or at least pause writes to `users`) while this runs — it does not
// coordinate with concurrent writes. Back up the `users` table before running.

const crypto = require("crypto");
const { Pool } = require("pg");

const OLD_KEY = process.env.OLD_DB_ENCRYPTION_KEY;
const NEW_KEY = process.env.NEW_DB_ENCRYPTION_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!OLD_KEY || !NEW_KEY || !DATABASE_URL) {
  console.error("OLD_DB_ENCRYPTION_KEY, NEW_DB_ENCRYPTION_KEY and DATABASE_URL are all required.");
  process.exit(1);
}

// Mirrors TelLinguan-backend/crypto/chacha.js, parameterized by key instead of process.env.
const keyMaterial = (password) => ({
  masterKey: crypto.createHash("sha256").update(password).digest(),
  fixedNonce: crypto.createHash("md5").update(password).digest().slice(0, 12),
});

function decryptChaCha(combinedBase64, isSearchable, password) {
  if (!combinedBase64) return "";
  const { masterKey, fixedNonce } = keyMaterial(password);
  const raw = Buffer.from(combinedBase64, "base64");

  const authTag = isSearchable ? raw.slice(0, 16) : raw.slice(12, 28);
  const ciphertext = isSearchable ? raw.slice(16) : raw.slice(28);
  const nonce = isSearchable ? fixedNonce : raw.slice(0, 12);

  const decipher = crypto.createDecipheriv("chacha20-poly1305", masterKey, nonce, { authTagLength: 16 });
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

function encryptChaCha(plainText, isSearchable, password) {
  const { masterKey, fixedNonce } = keyMaterial(password);
  const nonce = isSearchable ? fixedNonce : crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("chacha20-poly1305", masterKey, nonce, { authTagLength: 16 });
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const combined = isSearchable
    ? Buffer.concat([authTag, encrypted])
    : Buffer.concat([nonce, authTag, encrypted]);
  return combined.toString("base64");
}

function decrypt(cipherText, oldPassword) {
  if (!cipherText || typeof cipherText !== "string") return cipherText;
  if (cipherText.startsWith("chacha20:p:")) {
    return decryptChaCha(cipherText.slice("chacha20:p:".length), false, oldPassword);
  }
  if (cipherText.startsWith("chacha20:d:")) {
    return decryptChaCha(cipherText.slice("chacha20:d:".length), true, oldPassword);
  }
  return cipherText; // not encrypted with our scheme — leave untouched
}

function reencrypt(cipherText, oldPassword, newPassword) {
  if (!cipherText || typeof cipherText !== "string") return cipherText;
  if (cipherText.startsWith("chacha20:p:")) {
    const plain = decryptChaCha(cipherText.slice("chacha20:p:".length), false, oldPassword);
    return `chacha20:p:${encryptChaCha(plain, false, newPassword)}`;
  }
  if (cipherText.startsWith("chacha20:d:")) {
    const plain = decryptChaCha(cipherText.slice("chacha20:d:".length), true, oldPassword);
    return `chacha20:d:${encryptChaCha(plain, true, newPassword)}`;
  }
  return cipherText;
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    const { rows } = await client.query("SELECT id, email, instansi, nim_nisn FROM users");
    console.log(`Found ${rows.length} user rows to re-encrypt.`);

    await client.query("BEGIN");

    for (const row of rows) {
      const newEmail = reencrypt(row.email, OLD_KEY, NEW_KEY);
      const newInstansi = reencrypt(row.instansi, OLD_KEY, NEW_KEY);
      const newNimNisn = reencrypt(row.nim_nisn, OLD_KEY, NEW_KEY);

      // Sanity check: the re-encrypted value must decrypt back to the same plaintext under the new key.
      const check = decrypt(newEmail, NEW_KEY);
      const original = decrypt(row.email, OLD_KEY);
      if (check !== original) {
        throw new Error(`Verification failed for user id=${row.id} — aborting, no rows committed.`);
      }

      await client.query(
        "UPDATE users SET email = $1, instansi = $2, nim_nisn = $3 WHERE id = $4",
        [newEmail, newInstansi, newNimNisn, row.id]
      );
    }

    await client.query("COMMIT");
    console.log(`Re-encrypted ${rows.length} rows successfully.`);
    console.log("Now update DB_ENCRYPTION_KEY to the new value everywhere (local .env and your hosting provider's env vars) and restart the app.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed, rolled back:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
