/**
 * Options for configuring the Ziggy plugin.
 */
export type Config = {
    /**
     * Path to the generated JavaScript/TypeScript file.
     * @default 'node_modules/rzl-app-ziggy/routes'
     */
    path?: string;
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
     * @default true
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
};
export declare const defaultConfig: Config;
