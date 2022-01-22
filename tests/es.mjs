import shroudify from "../index.js";
import assert from "assert";
import chalk from "chalk";
import path from "path";
import url from "url";

function logger(msg) {
  console.log(msg);
}

function passing() {
  logger(chalk.green.bold("PASSING ✅\n"));
}

function failing(msg) {
  logger(chalk.red.bold("FAILING ❌\n"));
  logger(chalk.red.bold(msg + "\n"));
}

logger(chalk.yellow.bold("Testing ES6 functionality"));
logger("-----------------------------------");
logger(chalk.gray.bold("++ Testing encoding ++"));

logger("Testing the default options:");

var encoded = shroudify.encode("ee");

try {
  assert.strictEqual(encoded, "antimissile caroused vouchsafe digitizing");
  passing();
} catch (e) {
  failing(e);
}

logger("Testing the custom options:");

logger("Testing custom premade cipher (using kek cipher)");
try {
  assert.strictEqual(
    shroudify.encode("ee", {
      cipher: "kek",
    }),
    "Froot Bussy Shit Touch"
  );
  passing();
} catch (e) {
  failing(e);
}

logger("Testing custom imported cipher (using example cipher)");
try {
  assert.strictEqual(
    shroudify.encode("ee", {
      cipher: path.join(
        path.dirname(url.fileURLToPath(import.meta.url)),
        "excipher"
      ),
    }),
    "whitehouse.gov multiply.com loc.gov canalblog.com"
  );
  passing();
} catch (e) {
  failing(e);
}

logger("Testing rounds");
try {
  encoded = shroudify.encode("ee", { rounds: 2 });
  assert.strictEqual(
    encoded,
    "caroused retest plaiting whackiest shrink mintage digitizing digitizing"
  );
  passing();
} catch (e) {
  failing(e);
}

logger("Testing encryption");
try {
  encoded = shroudify.encode("ee", {
    key: "bigpp",
  });
  assert.strictEqual(
    shroudify.decode(encoded, {
      key: "bigpp",
    }),
    "ee"
  );
  passing();
} catch (e) {
  failing(e);
}

logger("Testing compression");
try {
  encoded = shroudify.encode("ee", {
    compression: 9,
  });
  assert.strictEqual(
    encoded,
    "mule subsection plaiting merely mintage whackiest synergistical subsection whackiest vouchsafe mintage digitizing"
  );
  passing();
} catch (e) {
  failing(e);
}

logger("Testing seed");
try {
  encoded = shroudify.encode("ee", {
    seed: 69,
  });
  assert.strictEqual(encoded, "palsy subpoenaing fusible hyaena");
  passing();
} catch (e) {
  failing(e);
}

logger("Testing join");
try {
  encoded = shroudify.encode("ee", {
    join: "-",
  });
  assert.strictEqual(encoded, "antimissile-caroused-vouchsafe-digitizing");
  passing();
} catch (e) {
  failing(e);
}
