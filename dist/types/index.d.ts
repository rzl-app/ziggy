import type { Config, ParameterValue, RouteParams, ValidRouteName, Router } from './types';
export type * from './types';
/**
 * Ziggy's route helper.
 */
export declare function route(): Router;
export declare function route(name: undefined, params: undefined, absolute?: boolean, config?: Config): Router;
export declare function route<T extends ValidRouteName>(name: T, params?: RouteParams<T> | undefined, absolute?: boolean, config?: Config): string;
export declare function route<T extends ValidRouteName>(name: T, params?: ParameterValue | undefined, absolute?: boolean, config?: Config): string;
/**
 * Ziggy's Vue plugin.
 */
export declare const ZiggyVue: {
    install: (app: any, options?: Config) => void;
};
/**
 * Ziggy's React hook.
 */
export declare function useRoute(defaultConfig?: Config): typeof route;
