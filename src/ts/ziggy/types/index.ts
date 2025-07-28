/** -------------------------------------------------------
 * * ***A list of routes and their parameters and bindings.***
 * -------------------------------------------------------
 *
 * Extended and filled by the route list generated with `php artisan rzl-ziggy:generate --types`.
 */
export interface RouteList {}

/** -------------------------------------------------------
 * * ***Marker interface to configure Rzl Ziggy's type checking behavior.***
 * -------------------------------------------------------
 */
export interface TypeConfig {}

/** -------------------------------------------------------
 * * ***A route name registered with Ziggy.***
 * -------------------------------------------------------
 */
export type KnownRouteName = keyof RouteList;

/** -------------------------------------------------------
 * * ***A route name, or any string.***
 * -------------------------------------------------------
 */
export type RouteName = KnownRouteName | (string & {});

/** -------------------------------------------------------
 * * ***A valid route name to pass to `route()` to generate a URL.***
 * -------------------------------------------------------
 */
export type ValidRouteName = TypeConfig extends { strictRouteNames: true }
  ? KnownRouteName
  : RouteName;

/** -------------------------------------------------------
 * * ***Information about a single route parameter.***
 * -------------------------------------------------------
 */
type ParameterInfo = { name: string; required: boolean; binding?: string };

/** -------------------------------------------------------
 * * ***A primitive route parameter value, as it would appear in a URL.***
 * -------------------------------------------------------
 */
export type RawParameterValue = string | number;

/** -------------------------------------------------------
 * * ***An object parameter value containing the 'default' binding key `id`, e.g. representing an Eloquent model.***
 * -------------------------------------------------------
 */
type DefaultRoutable = { id: RawParameterValue } & Record<keyof any, unknown>;

/** -------------------------------------------------------
 * * ***A route parameter value 1.***
 * -------------------------------------------------------
 */
export type ParameterValue = RawParameterValue | DefaultRoutable;
/** -------------------------------------------------------
 * * ***A route parameter value 2.***
 * -------------------------------------------------------
 */
export type ParameterValueProps = DefaultRoutable;

/** -------------------------------------------------------
 * * ***A parse-able route parameter, either plain or nested inside an object under its binding key.***
 * -------------------------------------------------------
 */
type Routable<I extends ParameterInfo> = I extends { binding: string }
  ?
      | ({ [K in I["binding"]]: RawParameterValue } & Record<
          keyof any,
          unknown
        >)
      | RawParameterValue
  : ParameterValue;

// Utility types for KnownRouteParamsObject
type RequiredParams<I extends readonly ParameterInfo[]> = Extract<
  I[number],
  { required: true }
>;
type OptionalParams<I extends readonly ParameterInfo[]> = Extract<
  I[number],
  { required: false }
>;

/** -------------------------------------------------------
 * * ***An object containing a special '_query' key to target the query string of a URL.***
 * -------------------------------------------------------
 */
type HasQueryParam = { _query?: Record<string, unknown> };

/** -------------------------------------------------------
 * * ***An object of parameters for an unspecified route.***
 * -------------------------------------------------------
 */
type GenericRouteParamsObject = Record<keyof any, unknown> & HasQueryParam;

/** -------------------------------------------------------
 * * ***An object of parameters for a specific named route.***
 * -------------------------------------------------------
 */
type KnownRouteParamsObject<I extends readonly ParameterInfo[]> = {
  [T in RequiredParams<I> as T["name"]]: Routable<T>;
} & {
  [T in OptionalParams<I> as T["name"]]?: Routable<T>;
} & GenericRouteParamsObject;

/** -------------------------------------------------------
 * * ***An object of route parameters.***
 * -------------------------------------------------------
 */
type RouteParamsObject<N extends RouteName> = N extends KnownRouteName
  ? KnownRouteParamsObject<RouteList[N]>
  : GenericRouteParamsObject;

/** -------------------------------------------------------
 * * ***An array of parameters for an unspecified route.***
 * -------------------------------------------------------
 */
// TODO: this may be able to be more specific, like `Routable<ParameterInfo>[]`,
// depending how we want to handle nested objects inside parameter arrays
type GenericRouteParamsArray = unknown[];

/** -------------------------------------------------------
 * * ***An array of parameters for a specific named route.***
 * -------------------------------------------------------
 */
type KnownRouteParamsArray<I extends readonly ParameterInfo[]> = [
  ...{ [K in keyof I]: Routable<I[K]> },
  ...unknown[]
];

/** -------------------------------------------------------
 * * ***An array of route parameters.***
 * -------------------------------------------------------
 */
type RouteParamsArray<N extends RouteName> = N extends KnownRouteName
  ? KnownRouteParamsArray<RouteList[N]>
  : GenericRouteParamsArray;

/** -------------------------------------------------------
 * * ***All possible parameter argument shapes for a route.***
 * -------------------------------------------------------
 */
export type RouteParams<N extends RouteName> =
  | RouteParamsObject<N>
  | RouteParamsArray<N>;

export type StringObject = Record<string, string>;
export type UnknownObject = Record<string, unknown>;

/** -------------------------------------------------------
 * * ***A Route Definition Type.***
 * -------------------------------------------------------
 */
export type RouteDefinition = {
  uri: string;
  methods: ("GET" | "HEAD" | "POST" | "PATCH" | "PUT" | "OPTIONS" | "DELETE")[];
  domain?: string;
  parameters?: string[];
  bindings?: Record<string, string>;
  wheres?: Record<string, unknown>;
  middleware?: string[];
};

/** -------------------------------------------------------
 * * ***Rzl Ziggy's config props for `route()`.***
 * -------------------------------------------------------
 */
export type Config = {
  url: string;
  port: number | null;
  defaults: Record<string, RawParameterValue>;
  routes: Record<string, RouteDefinition>;
  location?: {
    host?: string;
    pathname?: string;
    search?: string;
  };
};

/** ------------------------------------------------------- */
export type ParsedQs = {
  [key: string]: undefined | string | ParsedQs | (string | ParsedQs)[];
};

/** -------------------------------------------------------
 * * ***Rzl Ziggy's Router Instance Class.***
 * -------------------------------------------------------
 *
 * Calling Rzl Ziggy's `route()` function with no arguments will return an instance of its JavaScript `Router` class, which has some other useful properties and methods.
 */
export type Router = {
  /** ---------------------------------------------
   * * ***Check the current route: `route().current()`***
   * ---------------------------------------------
   *
   * @example
   *  // Laravel route called 'events.index' with URI '/events'
   *  // Current window URL is https://ziggy.test/events
   *
   *  route().current(); // ➔ 'events.index'
   *
   * @example
   *
   *  // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
   *  // Current window URL is https://myapp.com/venues/1/events/2?hosts=all
   *
   *  route().current(); // ➔ 'venues.events.show'
   *
   * @see [Check rzl-app-ziggy the current route: `route().current()`](https://github.com/rzl-app/ziggy#check-the-current-route-routecurrent)
   *
   */
  current(): ValidRouteName | undefined;
  /** ---------------------------------------------
   * * ***Check the current route with name route: `route().current(...)`***
   * ---------------------------------------------
   *
   * @example
   *  // Laravel route called 'events.index' with URI '/events'
   *  // Current window URL is https://ziggy.test/events
   *
   *  route().current('events.index'); // ➔ true
   *  route().current('events.*');     // ➔ true
   *  route().current('events.show');  // ➔ false
   *
   * @example
   *
   *  // `route().current()` optionally accepts parameters as its second argument, and will check that their values also match in the current URL:
   *
   *  // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
   *  // Current window URL is https://myapp.com/venues/1/events/2?hosts=all
   *
   *  route().current('venues.events.show', { venue: 1 });           // ➔ true
   *  route().current('venues.events.show', { venue: 1, event: 2 }); // ➔ true
   *  route().current('venues.events.show', { hosts: 'all' });       // ➔ true
   *  route().current('venues.events.show', { venue: 6 });           // ➔ false
   *
   * @see [Check rzl-app-ziggy the current route: `route().current(...)`](https://github.com/rzl-app/ziggy#check-the-current-route-routecurrent)
   *
   */
  current<T extends RouteName>(
    name: T,
    params?: RouteParams<T> | ParameterValueProps | null
  ): boolean;
  /** ---------------------------------------------
   * * ***Retrieve the current route with all params (query search params and laravel route params): `route().params`***
   * ---------------------------------------------
   * @example
   *
   *  // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
   *  // Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test
   *
   *  route().params; // ➔ { venue: '1', event: '2', hosts: 'all', type: 'test' }
   *
   * @see [Retrieve the current route with all params (query search params and laravel route params): `route().params`](https://github.com/rzl-app/ziggy?tab=readme-ov-file#retrieve-the-current-route-params-routeparams)
   *
   */
  get params(): Record<string, string | undefined>;
  /** ---------------------------------------------
   * * ***Retrieve only params route in laravel route (except query search params) in the current route: `route().routeParams`***
   * ---------------------------------------------
   * @example
   *
   *  // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
   *  // Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test
   *
   *  route().routeParams; // ➔ { venue: '1', event: '2' }
   *
   * @see [Retrieve only params route in laravel route (except query search params) in the current route: `route().routeParams`](https://github.com/rzl-app/ziggy?tab=readme-ov-file#retrieve-only-params-route-in-laravel-route-except-query-search-params-in-the-current-route-routerouteparams)
   */
  get routeParams(): Record<string, string | undefined>;
  /** ---------------------------------------------
   * * ***Retrieve all search query params only (except params route in laravel route) in the current route: `route().queryParams`***
   * ---------------------------------------------
   * @example
   *
   *  // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
   *  // Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test
   *
   *  route().queryParams; // ➔ { hosts: 'all', type: 'test' }
   *
   * @see [Retrieve all search query params only (except params route in laravel route) in the current route: `route().queryParams`](https://github.com/rzl-app/ziggy?tab=readme-ov-file#retrieve-all-search-query-params-only-except-params-route-in-laravel-route-in-the-current-route-routequeryparams)
   */
  get queryParams(): ParsedQs;
  /** ---------------------------------------------
   * * ***Check the current route: `route().has(...)`***
   * ---------------------------------------------
   * @example
   *
   *  // Laravel app has only one named route, 'home'
   *
   *  route().has('home');   // ➔ true
   *  route().has('orders'); // ➔ false
   *
   * @see [Check rzl-app-ziggy if a route exists: `route().has(...)`](https://github.com/rzl-app/ziggy#check-if-a-route-exists-routehas)
   *
   */
  has<T extends ValidRouteName>(name: T): boolean;
};

/** -------------------------------------------------------
 * * ***Types For RouteFactory Class.***
 * -------------------------------------------------------
 */
export type RouteFactoryConfig = {
  url: string;
  port: number | null;
  absolute?: boolean;
  defaults: Record<string, RawParameterValue>;
  routes: Record<string, RouteDefinition>;
  location?: {
    host?: string;
    pathname?: string;
    search?: string;
  };
};

/** -------------------------------------------------------
 * * ***Types For RouterConfig Class.***
 * -------------------------------------------------------
 */
export type RouterConfig = {
  url: string;
  port: number | null;
  absolute?: boolean;
  defaults: Record<string, RawParameterValue>;
  routes: Record<string, RouteDefinition>;
  location?: {
    host?: string;
    pathname?: string;
    search?: string;
  };
};
