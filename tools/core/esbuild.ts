import { build } from "esbuild";
import { getCurrentModulePath, LOG_UTILS } from "../utility";

type BuildAndLog = {
  entry: string;
  outfile: string;
  format: "esm" | "cjs" | "iife";
  platform: "browser" | "node";
  globalName?: string;
  banner?: { js: string };
};
export type ConfigRoutes = Omit<BuildAndLog, "entry">[];

export async function buildAndLog({
  entry: entryFile,
  outfile,
  format,
  platform,
  globalName,
  banner
}: BuildAndLog) {
  const startTime = Date.now();

  try {
    await build({
      outfile,
      entryPoints: [entryFile],
      banner,
      format,
      platform,
      globalName,
      minify: true,
      bundle: true,
      charset: "utf8",
      treeShaking: true,
      allowOverwrite: false,
      external: ["vite-plugin-run", "vite", "fs", "path"],
      splitting: entryFile.endsWith(".esm.js") ? true : false
    });
    const endTime = Date.now();
    LOG_UTILS.ON_PROCESS({
      format,
      startTime,
      endTime,
      entryFile,
      outFile: outfile
    });
  } catch (err) {
    LOG_UTILS.ON_ERROR(err, {
      onFile: getCurrentModulePath(import.meta.url).__filename
    });
  }
}
