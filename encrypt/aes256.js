const aes256 = require("aes256");

/**
 * Encrypts a string using AES256
 * @param {String} input The input string.
 * @param {String} key The key to use for encryption.
 * @returns {String} The encrypted string in base64.
 */
function encrypt(input, key) {
  return aes256.encrypt(key, input);
}

/**
 * Decrypts a string using AES256
 * @param {String} input The input string in base64.
 * @param {String} key The key to use for decryption.
 * @returns {String} The decrypted string.
 */
function decrypt(input, key) {
  return aes256.decrypt(key, input);
}

module.exports = {
encrypt,
decrypt
}
