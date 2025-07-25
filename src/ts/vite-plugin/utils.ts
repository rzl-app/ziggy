import { readFileSync } from "fs";
import { resolve } from "path";
import { logger, rzlThrow } from "../utils/logger";

export const ZIGGY_PACKAGE_NAME = "rzl-app/ziggy";

export const getComposerPackageVersion = (): string => {
  try {
    const composerPath = resolve(process.cwd(), "composer.json");
    const composer = JSON.parse(readFileSync(composerPath, "utf-8"));

    if (!composer.require?.[ZIGGY_PACKAGE_NAME]) {
      rzlThrow(
        "composer.json",
        `${ZIGGY_PACKAGE_NAME} not found in composer.json dependencies`
      );
    }

    const version = composer.require[ZIGGY_PACKAGE_NAME];
    const match = version.match(/^[~^><]?(\d+)/);

    if (!match) {
      rzlThrow(
        "Version Format",
        `Invalid version format for ${ZIGGY_PACKAGE_NAME}: ${version}`
      );
    }

    const cleanVersion = match[1];

    logger.success(
      "Composer Package",
      `${ZIGGY_PACKAGE_NAME} v${cleanVersion}`
    );

    return cleanVersion;
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      rzlThrow("composer.json", `File not found in ${process.cwd()}`);
    }

    if (error instanceof Error) {
      rzlThrow("Version Fetch Failed", error);
    }

    rzlThrow("Unknown Error", "Something exploded 💣");
  }
};
