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

const fs = require("fs-extra"),
  chalk = require("chalk"),
  shuffleSeed = require("shuffle-seed"),
  _ = require("lodash"),
  { isBuffer } = require("lodash"),
  path = require("path"),
  comps = fs
    .readdirSync(path.join(__dirname, "/compress"))
    .map((e) => e.split(".")[0]),
  encs = fs
    .readdirSync(path.join(__dirname, "/encrypt"))
    .map((e) => e.split(".")[0]),
  ciphs = fs.readdirSync(path.join(__dirname, "/ciphers"));

// Who uses console.log smh LMFAO
function logger(msg = "logging") {
  console.log(chalk.yellow("[shroudify] ") + msg);
}

/**
 * Encode data.
 *
 * @param {String|Buffer} input Data to encode.
 * @param {Object} options Options object.
 * @param {String} [options.cipher] Cipher to use, can be a path or a provided
 *     cipher.
 * @param {Number} [options.rounds=1] Number of Base64 encoding rounds done,
 *     useful for injecting dead data.
 * @param {Object} [options.encrypt] Encryption options.
 * @param {String} [options.encrypt.provider] Encryption provider to use.
 * @param {String} [options.encrypt.key] Encryption key.
 * @param {Object} [options.compression] Compression options.
 * @param {String} [options.compression.provider] Compression provider to use,
 *     can be one of the provided ones, or a path.
 * @param {Object} [options.compression.options={}] Compression options that
 *     will get passed to the compression provider.
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
    ciPath,
    encryption,
    compression,
    /** Base64 encoded data. */
    b64e = "";

  if (options.cipher) {
    if (ciphs.includes(options.cipher))
      ciPath = path.join(__dirname, "/ciphers/", options.cipher);
    else ciPath = options.cipher;
  }

  try {
    cipherArr = shuffleSeed.shuffle(
      _.compact(
        _.uniq(
          fs
            .readFileSync(ciPath)
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

    if (options.compression) {
      if (comps.includes(options.compression.provider))
        compression = require(path.join(
          __dirname,
          "/compress/",
          options.compression.provider
        ));
      else compression = require(options.compression.provider);
      input = compression.compress(input, options.compression.options);
    }

    if (options.encrypt) {
      if (encs.includes(options.encrypt.provider))
        encryption = require(path.join(
          __dirname,
          "/encrypt/",
          options.encrypt.provider
        ));
      else encryption = require(options.encrypt.provider);
      input = encryption.encrypt(input, options.encrypt.key);
    }

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

/**
 * Decode data.
 *
 * @param {String|Buffer} input Data to encode.
 * @param {Object} options Options object.
 * @param {String} [options.cipher] Cipher to use, can be a path or a premade
 *     cipher.
 * @param {Number} [options.rounds=1] Number of Base64 encoding rounds done,
 *     useful for injecting dead data.
 * @param {Object} [options.decrypt] Decryption options.
 * @param {String} [options.decrypt.provider] Decryption provider to use.
 * @param {String} [options.decrypt.key] Decryption key.
 * @param {Object} [options.compression] Compression options.
 * @param {String} [options.compression.provider] Compression provider to use, can be one of the provided ones, or a path.
 * @param {Object} [options.compression.options={}] Compression options that will get passed to the compression provider.
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
    ciPath,
    decryption,
    compression,
    /** Base64 encoded data. */
    b64e = "";

  if (options.cipher) {
    if (ciphs.includes(options.cipher))
      ciPath = path.join(__dirname, "/ciphers/", options.cipher);
    else ciPath = options.cipher;
  }

  try {
    cipherArr = shuffleSeed.shuffle(
      _.compact(
        _.uniq(
          fs
            .readFileSync(ciPath)
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

    if (options.decrypt) {
      if (options.decrypt.provider)
        decryption = require(path.join(
          __dirname,
          "/encrypt/",
          options.decrypt.provider
        ));
      else decryption = require(options.decrypt.provider);
      b64e = decryption.decrypt(b64e, options.decrypt.key);
    }

    if (options.compression) {
      if (comps.includes(options.compression.provider))
        compression = require(path.join(
          __dirname,
          "/compress/",
          options.compression.provider
        ));
      else compression = require(options.compression.provider);
      b64e = compression.decompress(b64e, options.compression.options);
    }

    return b64e;
  } catch (error) {
    throw new Error(
      chalk.red.bold(`Failed to decode!
        Err: ${error}`)
    );
  }
}

module.exports = {
  encode,
  decode,
};
