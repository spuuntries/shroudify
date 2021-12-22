const fs = require("fs"),
  chalk = require("chalk"),
  aes256 = require("aes256"),
  shuffleSeed = require("shuffle-seed"),
  _ = require("lodash"),
  ciphs = fs.readdirSync("./ciphers");

// Who uses console.log smh LMFAO
function logger(msg = "logging") {
  console.log(chalk.yellow("[shroudify] ") + msg);
}

/**
 * Encode data.
 *
 * @param {String|Buffer} input Data to encode.
 * @param {Object} options Options object.
 * @param {String} [options.cipher] Cipher to use, can be a path or a premade cipher.
 * @param {Number} [options.rounds=1] Number of Base64 encoding rounds done, useful for injecting dead data.
 * @param {any} [options.seed] Shuffling seed.
 * @param {String} [options.writeFile] Path to write to.
 * @param {String} [options.join] What to join the resulting strings with.
 * @return {String|Boolean} Encoded data or if it has written to file.
 */
function encode(
  input,
  options = {
    cipher: "kek",
    rounds: 1,
    seed: 0,
    writeFile: undefined,
    join: " ",
  }
) {
  (() => {
    if (!options.cipher) {
      options["cipher"] = "kek";
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
    /** Base64 encoded data. */
    b64e = "";

  if (ciphs.includes(options.cipher)) {
    try {
      cipherArr = shuffleSeed.shuffle(
        _.compact(
          _.uniq(
            fs
              .readFileSync(`./ciphers/${options.cipher}`)
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
      logger(
        chalk.red.bold(`failed to encode!
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
      logger(
        chalk.red.bold(`failed to encode!
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
 * @param {any} [options.seed] Shuffling seed.
 * @param {String} [options.writeFile] Path to write to.
 * @param {String} [options.split] What to split the strings with.
 * @return {String|Boolean} Encoded data or if it has written to file.
 */
function decode(
  input,
  options = {
    cipher: "kek",
    rounds: 1,
    seed: 0,
    writeFile: undefined,
    split: " ",
  }
) {
  (() => {
    if (!options.cipher) {
      options["cipher"] = "kek";
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
              .readFileSync(`./ciphers/${options.cipher}`)
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

      return b64e;
    } catch (error) {
      logger(
        chalk.red.bold(`failed to decode!
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

      return b64e;
    } catch (error) {
      logger(
        chalk.red.bold(`failed to encode!
        Err: ${error}`)
      );
    }
  }
}

module.exports = { encode, decode };
