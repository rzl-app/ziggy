import path from "path";
import chalk from "chalk";
import { Plugin } from "vite";
import { run } from "vite-plugin-run";
import { defaultConfig, Config } from "./config";
import { getComposerPackageVersion } from "./utils";
import { build, BuildConfig } from "./build";

export default (config: Config = {}): Plugin => {
  try {
    const version = getComposerPackageVersion();
    const { delay, throttle, ...restConfig } = config;
    const cmd = build(version, {
      ...defaultConfig,
      ...restConfig
    } as BuildConfig);

    const { configResolved, handleHotUpdate } = run(
      process.env.NODE_ENV === "development"
        ? [
            {
              delay,
              throttle,
              onFileChanged: ({ file }) => {
                const changedFile = path
                  .relative(process.cwd(), file)
                  .replace(/\\/g, "/");
                console.log(
                  `\n🛰️  ${chalk.cyanBright("Live Watcher")} ${chalk.gray("detected change in")} ${chalk.yellowBright(changedFile)}`
                );
                console.log(
                  `${chalk.hex("#ff6f00")("🔁 Rerunning")} ${chalk.bold.cyan(cmd.join(" "))} ${chalk.gray("...syncing fresh routes 🚦")}\n`
                );
              },
              name: "rzl-ziggy-generator",
              run: cmd,
              pattern: [
                "routes/**/*.php",
                ".*.env",
                ".*.*.env",
                ".env.*",
                ".env.*.*"
              ],
              condition: (file) => {
                const relative = path.relative(process.cwd(), file);

                return (
                  (file.includes("/routes/") && file.endsWith(".php")) ||
                  (file.includes("/") && file.includes(".env")) ||
                  /^routes\/.*\.php$/.test(relative.replace(/\\/g, "/")) ||
                  /\.env(\..+)?$/.test(relative)
                );
              }
            }
          ]
        : []
    );

    return {
      name: "rzl-ziggy-plugin",
      configResolved,
      handleHotUpdate
    };
  } catch (error) {
    console.error(
      `\n${chalk.bgRed.white.bold(" RZL ZIGGY ERROR ")} ${chalk.redBright("An error occurred in")} ${chalk.yellow("[rzl-app-ziggy/vite-plugin]")} 🚨`
    );

    if (error instanceof Error) {
      console.error(
        `${chalk.red("❌ Message:")} ${chalk.white(error.message)}`
      );

      if (process.env.NODE_ENV === "development") {
        console.error(
          `${chalk.gray("📍 Stack Trace:")}\n${chalk.dim(error.stack || "")}`
        );
      } else {
        console.error(
          `${chalk.gray("ℹ️  Tip:")} Run in ${chalk.cyan("development")} mode to see stack trace.`
        );
      }
    } else {
      console.error(`${chalk.red("❓ Unknown error type thrown:")}`);
      throw error;
    }
  }

  return {} as Plugin;
};
