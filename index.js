const fs = require("fs"),
  chalk = require("chalk"),
  pkg = require("./package.json"),
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
 * @return {String|Boolean} Encoded data or if it has written to file.
 */
function encode(
  input,
  options = {
    cipher: "kek",
    rounds: 1,
    seed: 0,
    writeFile: undefined,
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
    b64a = shuffleSeed.shuffle(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(
        ""
      ),
      options.seed
    ),
    /** Base64 encoded data. */
    b64e = "";

  if (ciphs.includes(options.cipher)) {
    try {
      cipherArr = shuffleSeed.shuffle(
        _.compact(
          fs
            .readFileSync(`./ciphers/${options.cipher}`)
            .toString("utf8")
            .split("\r")
            .join("")
            .split("\n")
        ),
        options.seed
      );

      if (cipherArr.length < 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 64
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 64  
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
        .join(" ")
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
          fs
            .readFileSync(options.cipher)
            .toString("utf8")
            .split("\r")
            .join("")
            .split("\n")
        ),
        options.seed
      );

      if (cipherArr.length < 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 64
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 64  
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
        .join(" ")
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
 * @return {String|Boolean} Encoded data or if it has written to file.
 */
function decode(
  input,
  options = {
    cipher: "kek",
    rounds: 1,
    seed: 0,
    writeFile: undefined,
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
    b64a = shuffleSeed.shuffle(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(
        ""
      ),
      options.seed
    ),
    /** Encoded data */
    encoded,
    /** Base64 encoded data. */
    b64e = "";

  if (ciphs.includes(options.cipher)) {
    try {
      cipherArr = shuffleSeed.shuffle(
        _.compact(
          fs
            .readFileSync(`./ciphers/${options.cipher}`)
            .toString("utf8")
            .split("\r")
            .join("")
            .split("\n")
        ),
        options.seed
      );

      if (cipherArr.length < 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 64
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 64  
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );

      if (Buffer.isBuffer(input)) {
        encoded = input
          .toString("utf8")
          .split(" ")
          .map((e) => b64a[cipherArr.indexOf(e)])
          .join("");
      } else {
        encoded = input
          .split(" ")
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
          fs
            .readFileSync(options.cipher)
            .toString("utf8")
            .split("\r")
            .join("")
            .split("\n")
        ),
        options.seed
      );

      if (cipherArr.length < 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is < 64
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );
      if (cipherArr.length > 64)
        logger(
          chalk.bold.yellowBright(`Warn: Cipher length is ${cipherArr.length}!
          Which is > 64  
          Continuing may not be good idea as it can lead to unpredictable performance`)
        );

      if (Buffer.isBuffer(input)) {
        encoded = input
          .toString("utf8")
          .split(" ")
          .map((e) => b64a[cipherArr.indexOf(e)])
          .join("");
      } else {
        encoded = input
          .split(" ")
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
