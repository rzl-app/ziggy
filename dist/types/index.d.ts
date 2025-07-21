import type { Config, ParameterValue, RouteParams, Router, ValidRouteName } from "./types";
export type { Config, RouterConfig, KnownRouteName, ParameterValue, ParsedQs, RawParameterValue, RouteDefinition, RouteConfig, RouteList, RouteName, RouteParams, Router, TypeConfig, ValidRouteName } from "./types";
/** -------------------------------------------------------
 * * ***Rzl Ziggy's route helper.***
 * -------------------------------------------------------
 *
 * Rzl Ziggy's `route()` function works like [Laravel's `route()` helper](https://laravel.com/docs/helpers#method-route)—you can pass it the name of a route, and the parameters you want to pass to the route, and it will generate a URL.
 *
 * @notes Calling Rzl Ziggy's `route()` function with no arguments will return an instance of its JavaScript `Router` class, which has some other useful properties and methods.
 */
export declare function route(): Router;
export declare function route(name: undefined, params: undefined, absolute?: boolean, config?: Config): Router;
export declare function route<T extends ValidRouteName>(name: T, params?: RouteParams<T> | undefined, absolute?: boolean, config?: Config): string;
export declare function route<T extends ValidRouteName>(name: T, params?: ParameterValue | undefined, absolute?: boolean, config?: Config): string;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's Vue Plugin.***
 * -------------------------------------------------------
 */
export declare const ZiggyVue: {
    /** -------------------------------------------------------
     * * ***Rzl Ziggy's Install Route to Vue.***
     * -------------------------------------------------------
     */
    install: (app: any, options?: Config) => void;
};
/** -------------------------------------------------------
 * * ***Rzl Ziggy's React Hook Helper.***
 * -------------------------------------------------------
 */
export declare function useRoute(defaultConfig?: Config): typeof route;
