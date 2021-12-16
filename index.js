const fs = require("fs"),
  chalk = require("chalk"),
  pkg = require("./package.json"),
  ciphs = fs.readdirSync("./ciphers");

// Who uses console.log smh LMFAO
function logger(msg = "logging") {
  console.log(chalk.yellow("[shroudify] ") + msg);
}

function encode(input, cipher = "kek") {
  let cipherArr;
  if (ciphs.includes(cipher)) {
    fs.readFileSync(`./ciphers/${cipher}`);
  } else {
    try {
      fs.readFileSync(cipher);
    } catch (error) {
      logger(
        chalk.red.bold(`failed to encode!
      Err: ${error}`)
      );
    }
  }
}
