/**
 * A list of routes and their parameters and bindings.
 *
 * Extended and filled by the route list generated with `php artisan ziggy:generate --types`.
 */
export interface RouteList {
}
/**
 * Marker interface to configure Ziggy's type checking behavior.
 */
export interface TypeConfig {
}
/**
 * A route name registered with Ziggy.
 */
export type KnownRouteName = keyof RouteList;
/**
 * A route name, or any string.
 */
export type RouteName = KnownRouteName | (string & {});
/**
 * A valid route name to pass to `route()` to generate a URL.
 */
export type ValidRouteName = TypeConfig extends {
    strictRouteNames: true;
} ? KnownRouteName : RouteName;
/**
 * Information about a single route parameter.
 */
export type ParameterInfo = {
    name: string;
    required: boolean;
    binding?: string;
};
/**
 * A primitive route parameter value, as it would appear in a URL.
 */
export type RawParameterValue = string | number;
/**
 * An object parameter value containing the 'default' binding key `id`, e.g. representing an Eloquent model.
 */
export type DefaultRoutable = {
    id: RawParameterValue;
} & Record<keyof any, unknown>;
/**
 * A route parameter value.
 */
export type ParameterValue = RawParameterValue | DefaultRoutable;
/**
 * A parseable route parameter, either plain or nested inside an object under its binding key.
 */
export type Routable<I extends ParameterInfo> = I extends {
    binding: string;
} ? ({
    [K in I['binding']]: RawParameterValue;
} & Record<keyof any, unknown>) | RawParameterValue : ParameterValue;
export type RequiredParams<I extends readonly ParameterInfo[]> = Extract<I[number], {
    required: true;
}>;
export type OptionalParams<I extends readonly ParameterInfo[]> = Extract<I[number], {
    required: false;
}>;
/**
 * An object containing a special '_query' key to target the query string of a URL.
 */
export type HasQueryParam = {
    _query?: Record<string, unknown>;
};
/**
 * An object of parameters for an unspecified route.
 */
export type GenericRouteParamsObject = Record<keyof any, unknown> & HasQueryParam;
/**
 * An object of parameters for a specific named route.
 */
export type KnownRouteParamsObject<I extends readonly ParameterInfo[]> = {
    [T in RequiredParams<I> as T['name']]: Routable<T>;
} & {
    [T in OptionalParams<I> as T['name']]?: Routable<T>;
} & GenericRouteParamsObject;
/**
 * An object of route parameters.
 */
export type RouteParamsObject<N extends RouteName> = N extends KnownRouteName ? KnownRouteParamsObject<RouteList[N]> : GenericRouteParamsObject;
/**
 * An array of parameters for an unspecified route.
 */
export type GenericRouteParamsArray = unknown[];
/**
 * An array of parameters for a specific named route.
 */
export type KnownRouteParamsArray<I extends readonly ParameterInfo[]> = [
    ...{
        [K in keyof I]: Routable<I[K]>;
    },
    ...unknown[]
];
/**
 * An array of route parameters.
 */
export type RouteParamsArray<N extends RouteName> = N extends KnownRouteName ? KnownRouteParamsArray<RouteList[N]> : GenericRouteParamsArray;
/**
 * All possible parameter argument shapes for a route.
 */
export type RouteParams<N extends RouteName> = RouteParamsObject<N> | RouteParamsArray<N>;
/**
 * A route.
 */
export interface Route {
    uri: string;
    methods: ('GET' | 'HEAD' | 'POST' | 'PATCH' | 'PUT' | 'OPTIONS' | 'DELETE')[];
    domain?: string;
    parameters?: string[];
    bindings?: Record<string, string>;
    wheres?: Record<string, unknown>;
    middleware?: string[];
}
/**
 * Ziggy's config object.
 */
export interface Config {
    url: string;
    port: number | null;
    defaults: Record<string, RawParameterValue>;
    routes: Record<string, Route>;
    location?: {
        host?: string;
        pathname?: string;
        search?: string;
    };
}
export interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}
/**
 * Ziggy's Router class.
 */
export interface Router {
    current(): ValidRouteName | undefined;
    current<T extends RouteName>(name: T, params?: ParameterValue | RouteParams<T>): boolean;
    get params(): Record<string, string>;
    get routeParams(): Record<string, string>;
    get queryParams(): ParsedQs;
    has<T extends ValidRouteName>(name: T): boolean;
}
export type RouteConfig = {
    url: string;
    port: number | null;
    absolute?: boolean;
    defaults: Record<string, RawParameterValue>;
    routes: Record<string, Route>;
    location?: {
        host?: string;
        pathname?: string;
        search?: string;
    };
};
export type RouteDefinition = {
    uri: string;
    methods: ('GET' | 'HEAD' | 'POST' | 'PATCH' | 'PUT' | 'OPTIONS' | 'DELETE')[];
    domain?: string;
    parameters?: string[];
    bindings?: Record<string, string>;
    wheres?: Record<string, unknown>;
    middleware?: string[];
};
