const zlib = require('zlib');

/**
 * Compress a string using Brotli.
 * @param {string} input The input string.
 * @param {Object} options The options object.
 * @return {string} The compressed string in base64.
 */
function compress(input, options) {
  return zlib.brotliCompressSync(input, options).toString('base64');
}

/**
 * Decompress a string using Brotli.
 * @param {string} input The input string in base64.
 * @param {Object} options The options object.
 * @return {string} The decompressed string.
 */
function decompress(input, options) {
  return zlib.brotliDecompressSync(Buffer.from(input, 'base64'), options).toString();
}

module.exports = {
  compress,
  decompress,
};
