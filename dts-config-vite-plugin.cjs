/** * @see https://github.com/timocov/dts-bundle-generator */

/** @type {import('./dts-config').BundlerConfig} */
module.exports = {
  compilationOptions: {
    preferredConfigPath: "./tsconfig.vite-plugin.json"
  },
  entries: [
    //todo: dts all types
    {
      filePath: "./src/ts/vite-plugin/index.ts",
      outFile: "./dist/vite-plugin/index.d.ts",
      noCheck: true,
      output: {
        noBanner: true,
        exportReferencedTypes: false
      },
      libraries: {
        inlinedLibraries: [],
        importedLibraries: ["vite"]
      }
    }
  ]
};
