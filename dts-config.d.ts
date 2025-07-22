import { CompilationOptions, EntryPointConfig } from "dts-bundle-generator";

export interface ConfigEntryPoint extends EntryPointConfig {
  /**
   * Path of generated d.ts.
   * If not specified - the path will be input file with replaced extension to `.d.ts`.
   */
  outFile?: string;

  /**
   * Skip validation of generated d.ts file
   */
  noCheck?: boolean;
}

export type BundlerConfig = {
  entries: ConfigEntryPoint[];
  compilationOptions?: CompilationOptions;
};
