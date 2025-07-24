import chalk from "chalk";
import { resolve } from "path";
import { build } from "esbuild";
import { globSync, readFileSync } from "fs";
import { measureSize, toRelative } from "./utility";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const repoUrl =
  (typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url) ??
  pkg.homepage ??
  "https://github.com/rzl-app/ziggy";

const cleanUrl = repoUrl.replace(/^git\+/, "").replace(/\.git$/, "");
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * Repository: ${cleanUrl}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License
 */
`;

console.log(
  `\n${chalk.blueBright.bold("▶️  Starting build with esbuild...")}\n` +
    `${chalk.gray("→")} ${chalk.cyan("Formats:")} ${chalk.yellow("ESM, CJS, IIFE")} ${chalk.gray("|")} ${chalk.magenta("Minify + Bundle")}`
);

const iifeFiles = globSync("src/ts/ziggy/**/*.{js,cjs,esm,mjs,ts}").filter(
  (f) => f.includes("route.ts")
);

type BuildAndLog = {
  entry: string;
  outfile: string;
  format: "esm" | "cjs" | "iife";
  platform: "browser" | "node";
  globalName?: string;
  banner?: { js: string };
};
const buildAndLog = async ({
  entry,
  outfile,
  format,
  platform,
  globalName,
  banner
}: BuildAndLog) => {
  const start = Date.now();
  try {
    await build({
      entryPoints: [entry],
      outfile,
      treeShaking: true,
      minify: true,
      bundle: true,
      charset: "utf8",
      splitting: entry.endsWith(".esm.js") ? true : false,
      format,
      platform,
      globalName,
      banner,
      external: ["vite-plugin-run", "vite", "fs", "path", "chalk"],
      allowOverwrite: false
    });
    const end = Date.now();
    const sizeInfo = measureSize(toRelative(outfile));
    console.log(
      `✅ ${chalk.green(format.toUpperCase())} ${chalk.yellow(toRelative(entry))} → ${chalk.magenta(toRelative(outfile))} ${sizeInfo} ${chalk.gray(`[${end - start}ms]`)}`
    );
  } catch (err) {
    console.error(`❌ ${chalk.red("Failed")} ${toRelative(outfile)}`, err);
  }
};

type ConfigRoutes = Omit<BuildAndLog, "entry">[];
const buildMainConfigs = [
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
const buildVitePluginConfigs = [
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

await Promise.all([
  ...buildMainConfigs.map((cfg) =>
    buildAndLog({
      entry: "src\\ts\\ziggy\\index.ts",
      outfile: cfg.outfile,
      format: cfg.format,
      platform: cfg.platform
    })
  ),
  ...buildVitePluginConfigs.map((cfg) =>
    buildAndLog({
      entry: "src\\ts\\vite-plugin\\index.ts",
      outfile: cfg.outfile,
      format: cfg.format,
      platform: cfg.platform
    })
  ),
  ...iifeFiles.map((file) =>
    buildAndLog({
      entry: resolve(file),
      outfile: "dist/rzl-ziggy.iife.js",
      format: "iife",
      platform: "browser",
      globalName: "RzlZiggy",
      banner: { js: banner }
    })
  )
]);
