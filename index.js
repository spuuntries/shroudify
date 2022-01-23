/*   Copyright 2021 spuun.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  */

const fs = require("fs"),
  chalk = require("chalk"),
  aes256 = require("aes256"),
  shuffleSeed = require("shuffle-seed"),
  _ = require("lodash"),
  { isBuffer } = require("lodash"),
  path = require("path"),
  ciphs = fs.readdirSync(path.join(__dirname, "/ciphers"));

// Who uses console.log smh LMFAO
function logger(msg = "logging") {
  console.log(chalk.yellow("[shroudify] ") + msg);
}

/**
 * Compress a string using zlib
 *
 * @param {String} input The string to compress
 * @param {Number} level The compression level
 * @returns {String} The compressed string
 */
function compress(input, level) {
  let zlib = require("zlib");
  return zlib.brotliCompressSync(input, { level: level }).toString("base64");
}

/**
 * Decompress a string using zlib
 *
 * @param {String} input The string to decompress
 * @param {Number} level The compression level
 * @returns {String} The decompressed string
 * P.S. level is useless here, but it's there for consistency
 */
function decompress(input, level) {
  let zlib = require("zlib");
  return zlib
    .brotliCompressSync(Buffer.from(input, "base64"), { level: level })
    .toString();
}

/**
 * Encode data.
 *
 * @param {String|Buffer} input Data to encode.
 * @param {Object} options Options object.
 * @param {String} [options.cipher] Cipher to use, can be a path or a premade cipher.
 * @param {Number} [options.rounds=1] Number of Base64 encoding rounds done, useful for injecting dead data.
 * @param {String} [options.key] Key to use for encryption.
 * @param {Number} [options.compression=0] Compression level, 0-9.
 * @param {any} [options.seed] Shuffling seed.
 * @param {String} [options.writeFile] Path to write to.
 * @param {String} [options.join] What to join the resulting strings with.
 * @return {String|Boolean} Encoded data or if it has written to file.
 */
function encode(
  input,
  options = {
    cipher: "randomwords",
    rounds: 1,
    compression: 0,
    seed: 0,
    writeFile: undefined,
    join: " ",
  }
) {
  var aes;
  (() => {
    if (!options.cipher) {
      options["cipher"] = "randomwords";
    }
    if (!options.rounds) {
      options["rounds"] = 1;
    }
    if (options.key) aes = aes256.createCipher(options.key);
    if (!options.seed) {
      options["seed"] = 0;
    }
    if (!options.writeFile) {
      options["writeFile"] = undefined;
    }
    if (!options.join) {
      options["join"] = " ";
    }
    if (!_.isFinite(options.rounds)) {
      options["rounds"] = parseInt(options.rounds);
      if (options.rounds < 1) {
        options["rounds"] = 1;
      }
    }
    if (_.isObject(options.seed)) {
      options["seed"] = JSON.stringify(options.seed);
    }
  })();

  let cipherArr,
    b64a =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(
        ""
      ),
    /** Base64 encoded data. */
    b64e = "";

  if (ciphs.includes(options.cipher)) {
    try {
      cipherArr = shuffleSeed.shuffle(
        _.compact(
          _.uniq(
            fs
              .readFileSync(path.join(__dirname, `/ciphers/${options.cipher}`))
              .toString("utf8")
              .split("\r")
              .join("")
              .split("\n")
          )
        ),
        options.seed
      );

      if (cipherArr.length < 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 65
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 65  
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );

      if (options.compression)
        input = compress(
          isBuffer(input) ? input.toString("utf8") : input,
          options.compression
        );

      if (aes) input = aes.encrypt(input);

      for (let i = 1; i <= options.rounds; i++) {
        if (i == 1) {
          if (Buffer.isBuffer(input)) {
            b64e = input.toString("base64");
          } else if (_.isPlainObject(input)) {
            b64e = Buffer.from(JSON.stringify(input)).toString("base64");
          } else {
            b64e = Buffer.from(input).toString("base64");
          }
        } else {
          b64e = Buffer.from(b64e).toString("base64");
        }
      }

      return b64e
        .split("")
        .map((e) => cipherArr[b64a.indexOf(e)])
        .join(options.join)
        .trim()
        .replace(/  +/g, " ");
    } catch (error) {
      throw new Error(
        chalk.red.bold(`Failed to encode!
        Err: ${error}`)
      );
    }
  } else {
    try {
      cipherArr = shuffleSeed.shuffle(
        _.compact(
          _.uniq(
            fs
              .readFileSync(options.cipher)
              .toString("utf8")
              .split("\r")
              .join("")
              .split("\n")
          )
        ),
        options.seed
      );

      if (cipherArr.length < 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 65
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 65
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );

      if (options.compression)
        input = compress(
          isBuffer(input) ? input.toString("utf8") : input,
          options.compression
        );

      if (aes) input = aes.encrypt(input);

      for (let i = 1; i <= options.rounds; i++) {
        if (i == 1) {
          if (Buffer.isBuffer(input)) {
            b64e = input.toString("base64");
          } else if (_.isPlainObject(input)) {
            b64e = Buffer.from(JSON.stringify(input)).toString("base64");
          } else {
            b64e = Buffer.from(input).toString("base64");
          }
        } else {
          b64e = Buffer.from(b64e).toString("base64");
        }
      }

      return b64e
        .split("")
        .map((e) => cipherArr[b64a.indexOf(e)])
        .join(options.join)
        .trim()
        .replace(/  +/g, " ");
    } catch (error) {
      throw new Error(
        chalk.red.bold(`Failed to encode!
        Err: ${error}`)
      );
    }
  }
}

/**
 * Decode data.
 *
 * @param {String|Buffer} input Data to encode.
 * @param {Object} options Options object.
 * @param {String} [options.cipher] Cipher to use, can be a path or a premade cipher.
 * @param {Number} [options.rounds=1] Number of Base64 encoding rounds done, useful for injecting dead data.
 * @param {String} [options.key] Key to use for decryption.
 * @param {Number} [options.compression] Compression level, 0-9.
 * @param {any} [options.seed] Shuffling seed.
 * @param {String} [options.writeFile] Path to write to.
 * @param {String} [options.split] What to split the strings with.
 * @return {String|Boolean} Encoded data or if it has written to file.
 */
function decode(
  input,
  options = {
    cipher: "randomwords",
    rounds: 1,
    compression: 0,
    seed: 0,
    writeFile: undefined,
    split: " ",
  }
) {
  var aes;
  (() => {
    if (!options.cipher) {
      options["cipher"] = "randomwords";
    }
    if (!options.rounds) {
      options["rounds"] = 1;
    }
    if (options.key) aes = aes256.createCipher(options.key);
    if (!options.seed) {
      options["seed"] = 0;
    }
    if (!options.writeFile) {
      options["writeFile"] = undefined;
    }
    if (!options.split) {
      options["split"] = " ";
    }
    if (!_.isFinite(options.rounds)) {
      options["rounds"] = parseInt(options.rounds);
      if (options.rounds < 1) {
        options["rounds"] = 1;
      }
    }
    if (_.isObject(options.seed)) {
      options["seed"] = JSON.stringify(options.seed);
    }
  })();

  let cipherArr,
    b64a =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(
        ""
      ),
    /** Encoded data */
    encoded,
    /** Base64 encoded data. */
    b64e = "";

  if (ciphs.includes(options.cipher)) {
    try {
      cipherArr = shuffleSeed.shuffle(
        _.compact(
          _.uniq(
            fs
              .readFileSync(path.join(__dirname, `/ciphers/${options.cipher}`))
              .toString("utf8")
              .split("\r")
              .join("")
              .split("\n")
          )
        ),
        options.seed
      );

      if (cipherArr.length < 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 65
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 65  
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );

      if (Buffer.isBuffer(input)) {
        encoded = input
          .toString("utf8")
          .split(options.split)
          .map((e) => b64a[cipherArr.indexOf(e)])
          .join("");
      } else {
        encoded = input
          .split(options.split)
          .map((e) => b64a[cipherArr.indexOf(e)])
          .join("");
      }

      for (let i = 1; i <= options.rounds; i++) {
        if (i == 1) {
          b64e = Buffer.from(encoded, "base64").toString("utf8");
        } else {
          b64e = Buffer.from(b64e, "base64").toString("utf8");
        }
      }

      if (options.key) b64e = aes.decrypt(b64e);

      if (options.compression) b64e = decompress(b64e, options.compression);

      return b64e;
    } catch (error) {
      throw new Error(
        chalk.red.bold(`Failed to decode!
        Err: ${error}`)
      );
    }
  } else {
    try {
      cipherArr = shuffleSeed.shuffle(
        _.compact(
          _.uniq(
            fs
              .readFileSync(options.cipher)
              .toString("utf8")
              .split("\r")
              .join("")
              .split("\n")
          )
        ),
        options.seed
      );

      if (cipherArr.length < 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 65
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 65)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 65
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );

      if (Buffer.isBuffer(input)) {
        encoded = input
          .toString("utf8")
          .split(options.split)
          .map((e) => b64a[cipherArr.indexOf(e)])
          .join("");
      } else {
        encoded = input
          .split(options.split)
          .map((e) => b64a[cipherArr.indexOf(e)])
          .join("");
      }

      for (let i = 1; i <= options.rounds; i++) {
        if (i == 1) {
          b64e = Buffer.from(encoded, "base64").toString("utf8");
        } else {
          b64e = Buffer.from(b64e, "base64").toString("utf8");
        }
      }

      if (options.key) b64e = aes.decrypt(b64e);

      if (options.compression) b64e = decompress(b64e, options.compression);

      return b64e;
    } catch (error) {
      throw new Error(
        chalk.red.bold(`Failed to decode!
        Err: ${error}`)
      );
    }
  }
}

module.exports = { encode, decode };
