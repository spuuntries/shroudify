const zlib = require("zlib");

/**
 * Compress a string using gzip.
 * @param {string} input The input string.
 * @param {Object} options The options object.
 * @param {Number} [options.level] The compression level.
 * @returns {String} The compressed string in base64.
 */
function compress(input, options) {
  return zlib.gzipSync(input, options).toString("base64");
}

/**
 * Decompress a string using gzip.
 * @param {string} str The input string in base64.
 * @param {Object} options The options object.
 * @returns {String} The decompressed string.
 */
function decompress(str, options) {
  return zlib.gunzipSync(Buffer.from(str, "base64"), options).toString();
}

module.exports = {
  compress,
  decompress
};
