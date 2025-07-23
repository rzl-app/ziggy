import { defineConfig } from "tsup";
import removeDeprecatedPlugin from "./tools/removeDeprecatedPlugin";

export default defineConfig([
  {
    entry: {
      index: "src/ts/ziggy/index.ts"
    },
    outDir: "dist",
    clean: true,
    minify: true,
    treeshake: true,
    splitting: false,
    sourcemap: false,
    format: ["esm", "cjs", "iife"],
    globalName: "RzlZiggy",
    dts: {
      resolve: true
    },
    outExtension({ format }) {
      return {
        js:
          format === "esm"
            ? ".esm.js"
            : format === "cjs"
              ? ".cjs"
              : `.${format}.js`
      };
    },
    esbuildPlugins: [removeDeprecatedPlugin()]
  },
  {
    entry: ["src/ts/vite-plugin/index.ts"],
    outDir: "dist/vite-plugin",
    clean: true,
    minify: true,
    treeshake: true,
    splitting: false,
    sourcemap: false,
    format: ["esm", "cjs"],
    external: ["vite-plugin-run", "vite", "fs", "path"],
    dts: {
      resolve: true
    },
    outExtension({ format }) {
      return {
        js:
          format === "esm"
            ? ".esm.js"
            : format === "cjs"
              ? ".cjs"
              : `.${format}.js`
      };
    },
    esbuildPlugins: [removeDeprecatedPlugin()]
  }
]);
