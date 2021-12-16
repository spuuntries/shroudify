const fs = require("fs"),
  chalk = require("chalk"),
  pkg = require("./package.json"),
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
 * @param {Number} [options.rounds=1] Number of Base64 encoding rounds done.
 * @param {String} [options.writeFile] Path to write to.
 * @return {String|Boolean} Encoded data or if it has written to file.
 */
function encode(
  input,
  options = {
    cipher: "kek",
    rounds: 1,
    writeFile: undefined,
  }
) {
  let cipherArr,
    b64a =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(
        ""
      ),
    /** Base64 encoded data. */
    b64e = "";
  if (ciphs.includes(options.cipher)) {
    cipherArr = fs
      .readFileSync(`./ciphers/${options.cipher}`)
      .toString("utf8")
      .split("\r")
      .join("")
      .split("\n");
    for (let i = 1; i <= options.rounds; i++) {
      if (i == 1) {
        if (Buffer.isBuffer(input)) {
          b64e = input.toString("base64");
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
      .join(" ");
  } else {
    try {
      fs.readFileSync(options.cipher);
    } catch (error) {
      logger(
        chalk.red.bold(`failed to encode!
      Err: ${error}`)
      );
    }
  }
}

module.exports = { encode };
