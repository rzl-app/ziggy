import chalk from "chalk";
import { resolve } from "path";
import { existsSync, renameSync } from "fs";
import { getFormatExt, LOG_UTILS, toRelative } from "./utility";

const fileInput = "index.iife.js";
const fileOutput = "rzl-ziggy.iife.js";

const from = resolve(`dist/${fileInput}`);
const to = resolve(`dist/${fileOutput}`);

LOG_UTILS.ON_START({
  titleStart: "Renaming IIFE JS Build File...",
  processLabel: "Preserve:",
  processValue: "Rename iife only"
});

try {
  const startTime = Date.now();

  if (existsSync(from)) {
    renameSync(from, to);
    const endTime = Date.now();
    const ext = getFormatExt(from);

    LOG_UTILS.ON_PROCESS({
      format: ext,
      startTime,
      endTime,
      outFile: to,
      entryFile: from
    });

    LOG_UTILS.ON_FINISH({ text: "RENAME FILE IIFE FINISH" });
  } else {
    LOG_UTILS.ON_WARNING({
      message: `Skipped ${chalk.gray("File not found:")} ${chalk.red(toRelative(from))}`
    });
  }
} catch (error) {
  LOG_UTILS.ON_ERROR(error);
}
