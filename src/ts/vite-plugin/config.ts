/**
 * Options for configuring the Ziggy plugin.
 */
export type Config = {
  /**
   * Whether to use `sail` instead of the `php` command.
   * @default false
   */
  sail?: boolean;

  /**
   * Route group to generate.
   */
  group?: string;

  /**
   * Application URL.
   */
  url?: string;

  /**
   * Generate TypeScript declaration file.
   * @default true
   */
  types?: boolean;

  /**
   * Generate only the TypeScript declaration file.
   * @default false
   */
  typesOnly?: boolean;

  /**
   * Route name patterns to include.
   * @default []
   */
  only?: string[];

  /**
   * Route name patterns to exclude.
   * @default []
   */
  except?: string[];

  /**
   * Delay before running the generating is executed (in ms)
   *
   * @default 100ms
   */
  delay?: number | undefined;

  /**
   * Delay before running the generating can be executed again (in ms)
   *
   * @default 300ms
   */
  throttle?: number | undefined;
};

export const defaultConfig: Config = {
  sail: false,
  types: true,
  typesOnly: false,
  delay: 100,
  throttle: 300,
  only: [],
  except: []
};
