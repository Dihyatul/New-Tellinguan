const crypto = require("crypto");

const password = process.env.DB_ENCRYPTION_KEY || "S8376000267gUi92N71klM2084ScWO1n";
const masterKey = crypto.createHash("sha256").update(password).digest();

const fixedNonce = crypto.createHash("md5").update(password).digest().slice(0, 12);

function encryptChaCha(plainText, isSearchable = false) {
  if (plainText === null || plainText === undefined) {
    throw new Error("encryptChaCha: input data is null or undefined");
  }
  const textStr = typeof plainText === "string" ? plainText : JSON.stringify(plainText);
  const start = process.hrtime();

  let resultStr;

  if (isSearchable) {
    const cipher = crypto.createCipheriv("chacha20-poly1305", masterKey, fixedNonce, {
      authTagLength: 16,
    });
    let encrypted = cipher.update(textStr, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();

    const combined = Buffer.concat([authTag, encrypted]);
    resultStr = combined.toString("base64");
  } else {
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("chacha20-poly1305", masterKey, nonce, {
      authTagLength: 16,
    });
    let encrypted = cipher.update(textStr, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();

    const combined = Buffer.concat([nonce, authTag, encrypted]);
    resultStr = combined.toString("base64");
  }

  const time = process.hrtime(start);

  return {
    encrypted: resultStr,
    time,
  };
}

function decryptChaCha(combinedBase64, isSearchable = false) {
  if (!combinedBase64) {
    return { decrypted: "", time: [0, 0] };
  }

  const start = process.hrtime();
  let decryptedStr = "";

  try {
    const raw = Buffer.from(combinedBase64, "base64");

    if (isSearchable) {
      const authTag = raw.slice(0, 16);
      const ciphertext = raw.slice(16);

      const decipher = crypto.createDecipheriv("chacha20-poly1305", masterKey, fixedNonce, {
        authTagLength: 16,
      });
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(ciphertext);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      decryptedStr = decrypted.toString("utf8");
    } else {
      const nonce = raw.slice(0, 12);
      const authTag = raw.slice(12, 28);
      const ciphertext = raw.slice(28);

      const decipher = crypto.createDecipheriv("chacha20-poly1305", masterKey, nonce, {
        authTagLength: 16,
      });
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(ciphertext);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      decryptedStr = decrypted.toString("utf8");
    }
  } catch (err) {
    console.error("ChaCha20-Poly1305 decryption error:", err.message);
  }

  const time = process.hrtime(start);

  return {
    decrypted: decryptedStr,
    time,
  };
}

module.exports = {
  encryptChaCha,
  decryptChaCha,
};