const tsmaz = require("@remusao/smaz");

/**
 * Compress a string using smaz
 * @param {string} input The input string.
 * @param {Object} options The options object.
 * @returns {String} The compressed string in base64.
 */
function compress(input, options) {
  return Buffer.from(tsmaz.compress(input)).toString("base64");
}

/**
 * Decompress a string using smaz
 * @param {String} input The input string in base64.
 * @param {Object} options The options object.
 * @returns {String} The decompressed string.
 */
function decompress(input, options) {
  return tsmaz.decompress(Buffer.from(input, "base64"));
}

module.exports = {
  compress,
  decompress,
};
