import type { PackageJson } from "type-fest";

import chalk from "chalk";
import { dirname, relative } from "path";
import prettyBytes from "pretty-bytes";
import { readFileSync, statSync } from "fs";
import { fileURLToPath } from "url";

/** Utility type to partially override specific keys in a type. */
export type PartialByKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/** Parsed contents of package.json file. */
export const packageJson: PackageJson | undefined = JSON.parse(
  readFileSync("package.json", "utf8")
);

/** Extracts the raw repository or homepage URL from package.json. */
export const repositoryUrlPure: string =
  typeof packageJson?.repository === "string"
    ? packageJson.repository
    : (packageJson?.repository?.url ??
      packageJson?.homepage ??
      "https://github.com/rzl-app/ziggy");

/** Cleaned repository URL (removes git+ prefix and .git suffix). */
export const repositoryUrl: string = repositoryUrlPure
  .replace(/^git\+/, "")
  .replace(/\.git$/, "");

/** Get the equivalent of `__filename` and `__dirname` in CommonJS,
 * for use in ES Module environments.
 *
 * This utility helps retrieve the current file's absolute or relative path
 * using `import.meta.url`, and should be called *within the module where it’s used*.
 *
 * @param metaUrl - The `import.meta.url` value from the calling file.
 * @param relative - Whether to return paths relative to `process.cwd()`. Default is `true`.
 *
 * @returns An object containing `__filename` and `__dirname`.
 *
 * @example
 * ```ts
 * // Inside some ES Module
 * import { getCurrentModulePath } from "./utils/path.js";
 *
 * const { __filename, __dirname } = getCurrentModulePath(import.meta.url);
 * console.log(__filename); // e.g., 'src/utils/path.ts'
 * console.log(__dirname);  // e.g., 'src/utils'
 * ```
 *
 * @note
 * If you pass `relative = false`, absolute paths will be returned instead.
 */
export function getCurrentModulePath(
  metaUrl: string,
  relative: boolean = true
): {
  /**
   * Equivalent of `__filename` in CommonJS for ES Module environments.
   *
   * Represents the path to the current file.
   */
  __filename: string;

  /**
   * Equivalent of `__dirname` in CommonJS for ES Module environments.
   *
   * Represents the directory of the current file.
   */
  __dirname: string;
} {
  const filename = fileURLToPath(metaUrl);
  const dir = dirname(filename);

  return {
    __filename: relative ? toRelative(filename) : filename,
    __dirname: relative ? toRelative(dir) : dir
  };
}

/** Generates a banner comment with package information.
 *
 * @example
 * /*!
 *  * my-lib v1.0.0
 *  * Awesome description
 *  * Repository: https://github.com/user/my-lib
 *  * (c) 2025 Author
 *  * Released under the MIT License
 *  *\/
 */
export const bannerBuilder = () => {
  if (!packageJson) {
    throw new Error("File package.json not found!");
  }
  return `/*!
 * ${packageJson.name} v${packageJson.version}
 * ${packageJson.description}
 * Repository: ${repositoryUrl}
 * (c) ${new Date().getFullYear()} ${packageJson.author}
 * Released under the ${packageJson.license} License
 */
`;
};

/** Converts an absolute path to a path relative to the current working directory.
 *
 * @param path - The absolute path to convert.
 * @returns The path relative to `process.cwd()`.
 */
export const toRelative = (path: string) => relative(process.cwd(), path);

/** Measures and formats the file size of the given file. */
export const measureSize = (filePath: string) => {
  try {
    const size = statSync(toRelative(filePath)).size;
    return chalk.gray(`(${prettyBytes(size)})`);
  } catch {
    return chalk.red(`[${filePath}]: (size error)`);
  }
};

// Build/Type format variants
type FormatBuildsJs = "cjs" | "esm" | "iife";
type FormatTypeTypes = "d.ts" | "d.cts";
type FormatTypeFile = "js" | "ts";

/** Converts a format string to uppercase for display.
 *
 * @example
 * formatExt("esm") // → "ESM"
 */
export const formatExt = (
  format: FormatBuildsJs | FormatTypeFile | FormatTypeTypes | (string & {})
) => {
  return format.toUpperCase();
};

/** Detects file format based on its extension.
 *
 * @example
 * getFormatExt("index.d.ts") → "d.ts"
 */
export const getFormatExt = (
  file: string
): FormatBuildsJs | FormatTypeFile | FormatTypeTypes => {
  file = file.split(/[?#]/)[0];

  if (file.endsWith(".iife.js")) return "iife";
  if (file.endsWith(".d.cts")) return "d.cts";
  if (file.endsWith(".d.ts")) return "d.ts";
  if (file.endsWith(".ts")) return "ts";
  if (file.endsWith(".js")) return "js";
  if (file.endsWith(".esm") || file.endsWith(".es")) return "esm";
  return "iife";
};

/** Detects build format from file name (e.g., .esm.js, .cjs.js). */
export const detectFormatBuild = (file: string): FormatBuildsJs => {
  if (file.includes(".cjs")) return "cjs";
  if (file.includes(".esm") || file.includes(".es")) return "esm";
  return "iife";
};

/** Calculates duration in milliseconds between start and end time. */
export const getTimerProcess = (startTime: number, endTime: number) => {
  return `${endTime - startTime}`;
};

/** Logging utilities for build processes. */
export const LOG_UTILS = {
  /** Logs a formatted start section of the build process.
   *
   * @example
   * LOG_UTILS.ON_START({
   *   titleStart: "Build Start",
   *   processLabel: "Formats:",
   *   processValue: ["esm", "cjs"],
   *   processDecryption: "ES Modules & CommonJS"
   * });
   */
  ON_START: ({
    titleStart,
    processLabel,
    processValue = "Formats:",
    processDecryption,
    processDecryptionSeparator = "|"
  }: {
    titleStart: string;
    processLabel: string;
    processDecryption?: string;
    processDecryptionSeparator?: string;
    processValue: string | string[];
  }) => {
    const procVal = Array.isArray(processValue)
      ? processValue.flat().join(", ")
      : processValue;

    const procDesc = processDecryption?.trim().length
      ? `${chalk.gray(processDecryptionSeparator.trim())} ${chalk.yellow(processDecryption.trim())}`
      : "";

    const styleStart = chalk.blueBright.bold(titleStart.toUpperCase());
    const styleFormatExt = chalk.cyan(processLabel);
    const styleFiles = chalk.whiteBright(procVal);

    return console.log(
      `\n${chalk.underline(`▶️  ${styleStart}`)}\n${`${chalk.gray("⚡️")} ${styleFormatExt} ${styleFiles}`} ${procDesc}`
    );
  },

  /** Logs the result of a single file processing.
   *
   * @example
   * LOG_UTILS.ON_PROCESS({
   *   format: "esm",
   *   entryFile: "src/index.ts",
   *   outFile: "dist/index.esm.js",
   *   startTime: 123,
   *   endTime: 456
   * });
   */
  ON_PROCESS: ({
    startTime,
    endTime,
    entryFile,
    outFile,
    format
  }: {
    entryFile: string;
    outFile: string;
    startTime: number;
    endTime: number;
    format:
      | "cjs"
      | "esm"
      | "iife"
      | "dts"
      | "ts"
      | "js"
      | "cts"
      | (string & {});
  }) => {
    const styleFormatExt = chalk.green(`[${formatExt(format)}]:`);
    const styleEntryFile = chalk.yellow(toRelative(entryFile));
    const styleOutFile = chalk.magenta(toRelative(outFile));
    const styleTimer = chalk.gray(`[${getTimerProcess(startTime, endTime)}ms]`);

    return console.log(
      `🟢 ${styleFormatExt} ${styleEntryFile} → ${styleOutFile} ${measureSize(outFile)} ${styleTimer}`
    );
  },

  /** Logs a formatted error message. */
  ON_ERROR: (
    error: unknown,
    { onFile, message = "Failed" }: { onFile?: string; message?: string } = {}
  ) => {
    const onFileRelative = onFile ? toRelative(onFile) : "";
    return console.error(`❌ ${chalk.red(message)} ${onFileRelative}`, error);
  },

  /** Logs a formatted warning message. */
  ON_WARNING: ({
    onFile,
    message = "Warning"
  }: {
    onFile?: string;
    message?: string;
  } = {}) => {
    const onFileRelative = onFile ? toRelative(onFile) : "";
    return console.warn(`⚠️  ${chalk.yellow(message)} ${onFileRelative}`);
  },

  /** Logs the final success message after build completion. */
  ON_FINISH: ({ text }: { text: string }) => {
    return console.log(`${chalk.greenBright.bold(`✅ ${text}`)}\n`);
  }
};
