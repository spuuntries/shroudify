import shroudify from "../index.js"
import assert from "assert"
import chalk from "chalk"

function logger(msg) {
    console.log(msg)
}

function passing() {
    logger(chalk.green.bold("PASSING ✅\n"));
}

logger("Testing the default options");

var encoded = shroudify.encode("ee");

assert.strictEqual(encoded, "antimissile caroused vouchsafe digitizing");
passing()

logger("Testing the custom options");

logger("Testing rounds");
encoded = shroudify.encode("ee", { rounds: 1 });
assert.strictEqual(encoded, "antimissile caroused vouchsafe digitizing")
passing();

