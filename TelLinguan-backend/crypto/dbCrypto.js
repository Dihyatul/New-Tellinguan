const { encryptChaCha, decryptChaCha } = require("./chacha");

/**
 * Encrypt plain text for database storage using ChaCha20-Poly1305.
 * @param {string} plainText - The text to encrypt
 * @param {boolean} isSearchable - True if we need deterministic encryption (e.g. for email checks)
 * @returns {string} The prefixed ciphertext
 */
function encrypt(plainText, isSearchable = false) {
  if (plainText === null || plainText === undefined) {
    return plainText;
  }
  const textStr = typeof plainText === "string" ? plainText : String(plainText);

  // Skip encryption if already encrypted (i.e. has prefixes)
  if (
    textStr.startsWith("chacha20:p:") ||
    textStr.startsWith("chacha20:d:")
  ) {
    return textStr;
  }

  const { encrypted } = encryptChaCha(textStr, isSearchable);
  const mode = isSearchable ? "d" : "p";
  return `chacha20:${mode}:${encrypted}`;
}

/**
 * Decrypt ciphertext from database storage.
 * @param {string} cipherText - The prefixed ciphertext
 * @returns {string} The decrypted plaintext
 */
function decrypt(cipherText) {
  if (!cipherText || typeof cipherText !== "string") {
    return cipherText;
  }

  if (cipherText.startsWith("chacha20:p:")) {
    const rawCipher = cipherText.substring("chacha20:p:".length);
    const { decrypted } = decryptChaCha(rawCipher, false);
    return decrypted;
  }

  if (cipherText.startsWith("chacha20:d:")) {
    const rawCipher = cipherText.substring("chacha20:d:".length);
    const { decrypted } = decryptChaCha(rawCipher, true);
    return decrypted;
  }

  // If no matching encryption prefix is found, return the text as-is.
  return cipherText;
}

module.exports = {
  encrypt,
  decrypt,
};


