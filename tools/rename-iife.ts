import chalk from "chalk";
import { resolve } from "path";
import prettyBytes from "pretty-bytes";
import { existsSync, renameSync, statSync } from "fs";

const from = resolve("dist/index.iife.js");
const to = resolve("dist/rzl-ziggy.iife.js");

console.log(
  `\n${chalk.blueBright.bold("▶️  Renaming IIFE build")}\n` +
    `${chalk.gray("→")} ${chalk.yellow("index.iife.js")} ${chalk.gray("→")} ${chalk.cyan("rzl-ziggy.iife.js")}`
);

const start = Date.now();

if (existsSync(from)) {
  renameSync(from, to);
  const size = statSync(to).size;
  const duration = Date.now() - start;

  console.log(
    `${chalk.green("✅ Renamed")} ${chalk.gray("→")} ${chalk.magenta("dist/rzl-ziggy.iife.js")} ${chalk.gray(`(${prettyBytes(size)}) [${duration}ms]`)}\n`
  );
} else {
  console.warn(
    `${chalk.yellow("⚠️  Skipped")} ${chalk.gray("File not found:")} ${chalk.red("dist/index.iife.js")}\n`
  );
}
