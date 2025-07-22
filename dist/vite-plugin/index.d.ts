import { Plugin as Plugin$1 } from 'vite';

type Config = {
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
};
declare const _default: (config?: Config) => Plugin$1;

export {
	_default as default,
};

export {};
