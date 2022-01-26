const zlib = require("zlib");

/** 
 * Compress a string using deflate
 * @param {String} input The input string.
 * @param {Object} options The options object.
 * @param {Number} options.level The compression level.
 * @returns {String} The compressed string in base64.
 */
function compress(input, options) {
    return zlib.deflateSync(input, options).toString("base64");
}

/**
 * Decompress a string using deflate
 * @param {String} input The input string in base64.
 * @param {Object} options The options object.
 * @returns {String} The decompressed string.
 */
function decompress(input, options) {
    return zlib.inflateSync(Buffer.from(input, "base64"), options).toString();
}

module.exports = {
    compress,
    decompress
};
