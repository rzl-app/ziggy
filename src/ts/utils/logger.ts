import chalk from "chalk";
import { CONFIG } from "./constants";

const tag = chalk.bgHex("#00bcd4").black.bold(` ${CONFIG.PREFIX.NAME} `);

export const logger = {
  info: (label: string, msg: string) => {
    console.log(
      `\n${tag} ${chalk.blueBright(label)} ${chalk.gray("→")} ${chalk.white(msg)}`
    );
  },
  success: (label: string, msg: string) => {
    console.log(
      `\n${tag} ${chalk.greenBright("✅ " + label)} ${chalk.gray("→")} ${chalk.whiteBright(msg)}`
    );
  },
  warn: (label: string, msg: string) => {
    console.warn(
      `\n${tag} ${chalk.yellow("⚠️  " + label)} ${chalk.gray("→")} ${chalk.yellowBright(msg)}`
    );
  },
  error: (label: string, msg: string) => {
    console.error(
      `\n${tag} ${chalk.redBright("❌ " + label)} ${chalk.gray("→")} ${chalk.red(msg)}`
    );
  },
  throw: (label: string, err: unknown) => {
    if (err instanceof Error) {
      logger.error(label, err.message);

      if (process.env.NODE_ENV === "development") {
        console.error(chalk.gray(err.stack));
      }

      throw err;
    } else {
      logger.error(label, "Unknown error occurred");
      throw new Error(typeof err === "string" ? err : "Unknown error");
    }
  },
  raw: (msg: string) => console.log(`\n${tag} ${msg}`)
};

export function rzlThrow(label: string, err: unknown): never {
  logger.throw(label, err);
  throw typeof err === "string" ? new Error(err) : err;
}
