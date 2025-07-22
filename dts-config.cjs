/** * @see https://github.com/timocov/dts-bundle-generator */

/** @type {import('./dts-config').BundlerConfig} */
module.exports = {
  compilationOptions: {
    preferredConfigPath: "./tsconfig.json"
  },
  entries: [
    //todo: dts all types
    {
      filePath: "./src/ts/index.ts",
      outFile: "./dist/index.d.ts",
      noCheck: true,
      output: {
        noBanner: true,
        exportReferencedTypes: false
      },
      libraries: {
        inlinedLibraries: [],
        importedLibraries: []
      }
    }
  ]
};
