import { Router as RouterClass } from "../class/Router";
import type {
  Config,
  ParameterValueProps,
  RouteParams,
  Router,
  ValidRouteName
} from "../types";

/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` helper.***
 * -------------------------------------------------------
 *
 * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 *
 * - If called with no arguments, it returns a `Router` instance for more advanced usage.
 * - If called with just configuration, it returns a `Router` instance using that config.
 * - If called with a route name and optional parameters, it returns a full URL string.
 *
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 *
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {RouteParams<T> | ParameterValue} [params] - Route parameters (either an object or a array value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config] - Optional route configuration object.
 * Required only if the global `appRoutes` variable is not available.
 * By default, the function will use the global `appRoutes` if present.
 *
 * @returns {string | Router} A generated URL string or a `Router` instance, depend of `name` argument.
 *
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route();
 * console.log(r) // ➔ r instance of Router.
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined);
 * console.log(r) // ➔ r instance of Router.
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined, undefined, true, JSON.parse(appRoutes));
 * console.log(r) // ➔ r instance of Router.
 *
 * @see [More Docs see: route() function.](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
// Called with no arguments - returns a Router instance
export function route(): Router;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` helper.***
 * -------------------------------------------------------
 *
 * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 *
 * - If called with no arguments, it returns a `Router` instance for more advanced usage.
 * - If called with just configuration, it returns a `Router` instance using that config.
 * - If called with a route name and optional parameters, it returns a full URL string.
 *
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 *
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {RouteParams<T> | ParameterValue} [params] - Route parameters (either an object or a array value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config] - Optional route configuration object.
 * Required only if the global `appRoutes` variable is not available.
 * By default, the function will use the global `appRoutes` if present.
 *
 * @returns {string} Return `string` instance cause argument `name` is not `undefined`.
 *
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @see [More Docs see: route() function.](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
// Called with a route name and optional additional arguments - returns a URL string
export function route<T extends ValidRouteName>(
  name: T,
  params?: RouteParams<T> | undefined,
  absolute?: boolean,
  config?: Config
): string;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` helper.***
 * -------------------------------------------------------
 *
 * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 *
 * - If called with no arguments, it returns a `Router` instance for more advanced usage.
 * - If called with just configuration, it returns a `Router` instance using that config.
 * - If called with a route name and optional parameters, it returns a full URL string.
 *
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 *
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {RouteParams<T> | ParameterValue} [params] - Route parameters (either an object or a array value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config] - Optional route configuration object.
 * Required only if the global `appRoutes` variable is not available.
 * By default, the function will use the global `appRoutes` if present.
 *
 * @returns {string} Return `string` instance cause argument `name` is not `undefined`.
 *
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @see [More Docs see: route() function.](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
export function route<T extends ValidRouteName>(
  name: T,
  params?: ParameterValueProps | undefined,
  absolute?: boolean,
  config?: Config
): string;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` helper.***
 * -------------------------------------------------------
 *
 * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 *
 * - If called with no arguments, it returns a `Router` instance for more advanced usage.
 * - If called with just configuration, it returns a `Router` instance using that config.
 * - If called with a route name and optional parameters, it returns a full URL string.
 *
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 *
 * @param {T} [name] - The name of the route (is undefined), defaultValue is `undefined`.
 * @param {RouteParams<T> | ParameterValue} [params] - Route parameters (because argument `name` is `undefined`, so argument params only can accept `undefined`), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config] - Optional route configuration object.
 * Required only if the global `appRoutes` variable is not available.
 * By default, the function will use the global `appRoutes` if present.
 *
 * @returns {Router} Return `Router` instance cause argument name is `undefined`.
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined);
 * console.log(r) // ➔ r instance of Router.
 *
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined, undefined, true, JSON.parse(appRoutes));
 * console.log(r) // ➔ r instance of Router.
 *
 * @see [More Docs see: route() function.](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
// Called with configuration arguments only - returns a configured Router instance
export function route(
  name: undefined,
  params?: undefined,
  absolute?: boolean,
  config?: Config
): Router;
export function route<T extends ValidRouteName>(
  name?: T,
  params?: RouteParams<T> | undefined,
  absolute: boolean = false,
  config?: Config
): string | Router {
  const router = new RouterClass(name, params, absolute, config) as Router;

  return name ? router.toString() : router;
}

const test = route("test", { id: 1 });
