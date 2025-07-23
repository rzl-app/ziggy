import { defineConfig } from "tsup";

export default defineConfig([
  //! # Main - Replace to esbuild for js, only types
  {
    entry: {
      index: "src/ts/ziggy/index.ts"
    },
    outDir: "dist",
    clean: true,
    format: ["esm"],
    dts: {
      resolve: true,
      only: true
    }
  },
  //! # Vite-Plugin - Replace to esbuild
  {
    entry: ["src/ts/vite-plugin/index.ts"],
    outDir: "dist/vite-plugin",
    clean: true,
    format: ["esm"],
    external: ["vite-plugin-run", "vite", "fs", "path", "chalk"],
    dts: {
      resolve: true,
      only: true
    }
  }
]);
