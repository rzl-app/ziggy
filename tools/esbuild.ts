import { getCurrentModulePath, bannerBuilder, LOG_UTILS } from "./utility";
import { buildAndLog, ConfigRoutes } from "./core/esbuild";

const mainConfig = [
  {
    format: "esm",
    outfile: "dist/index.esm.js",
    platform: "node"
  },
  {
    format: "cjs",
    outfile: "dist/index.cjs",
    platform: "node"
  }
] satisfies ConfigRoutes;

const vitePluginConfig = [
  {
    format: "cjs",
    outfile: "dist/vite-plugin/index.cjs",
    platform: "node"
  },
  {
    format: "esm",
    outfile: "dist/vite-plugin/index.esm.js",
    platform: "node"
  }
] satisfies ConfigRoutes;

try {
  LOG_UTILS.ON_START({
    titleStart: "Starting build...",
    processLabel: "Formats:",
    processValue: "ESM, CJS, IIFE"
  });

  await Promise.all([
    // main ziggy
    ...mainConfig.map((cfg) =>
      buildAndLog({
        entry: "src\\ts\\ziggy\\index.ts",
        outfile: cfg.outfile,
        format: cfg.format,
        platform: cfg.platform
      })
    ),

    // vite-plugin
    ...vitePluginConfig.map((cfg) =>
      buildAndLog({
        entry: "src\\ts\\vite-plugin\\index.ts",
        outfile: cfg.outfile,
        format: cfg.format,
        platform: cfg.platform
      })
    ),

    // iife
    buildAndLog({
      entry: "src\\ts\\ziggy\\browser.ts",
      outfile: "dist/rzl-ziggy.iife.js",
      format: "iife",
      platform: "browser",
      banner: {
        js: bannerBuilder()
      }
    })
  ]);

  LOG_UTILS.ON_FINISH({ text: "ALL BUILD FINISHED" });
} catch (error) {
  LOG_UTILS.ON_ERROR(error, {
    message: "BUILD FAILED",
    onFile: getCurrentModulePath(import.meta.url).__filename
  });
}
