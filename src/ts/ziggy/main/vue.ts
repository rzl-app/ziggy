import type { ComponentOptions, App as Vue3App } from "vue";

import type {
  Config,
  ParameterValue,
  ParameterValueProps,
  RouteParams,
  Router,
  ValidRouteName
} from "@/types";

import { route } from "@/index";

interface Vue2CompatApp {
  version: string;
  mixin: (m: ComponentOptions) => void;
  [key: string]: any;
}

type VueApp = Vue3App | Vue2CompatApp;

/** -------------------------------------------------------
 * * ***Rzl Ziggy's Vue Plugin.***
 * -------------------------------------------------------
 *
 * Rzl Ziggy includes a Vue plugin to make it easy to use the route() helper throughout your Vue app:
 *
 * @see [More docs use with vue: #Rzl Ziggy Vue.](https://github.com/rzl-app/ziggy?tab=readme-ov-file#vue)
 */
export const rzlZiggyVue = {
  /** -------------------------------------------------------
   * * ***Rzl Ziggy's Install Route to Vue.***
   * -------------------------------------------------------
   */
  install: function (app: VueApp, options?: Config) {
    /** -------------------------------------------------------
     * * ***Rzl Ziggy's `route()` from `rzlZiggyVue` helper.***
     * -------------------------------------------------------
     *
     * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
     * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
     *
     * - If called with no arguments, it returns a `Router` instance for more advanced usage.
     * - If called with a route name and optional parameters, it returns a full URL string.
     *
     * > ⚠️ Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
     * > because the route configuration is already provided by `rzlZiggyVue`.
     *
     * @template T - A valid route name (based on your `appRoutes` route definitions).
     *
     * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
     * @param {RouteParams<T> | ParameterValueProps | null | undefined} [params] - Route parameters (either an `object`, `array` or `null` value), defaultValue is `undefined`.
     * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
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
    function rt(): Router;
    /** -------------------------------------------------------
     * * ***Rzl Ziggy's `route()` from `rzlZiggyVue` helper.***
     * -------------------------------------------------------
     *
     * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
     * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
     *
     * - If called with no arguments, it returns a `Router` instance for more advanced usage.
     * - If called with a route name and optional parameters, it returns a full URL string.
     *
     * > ⚠️ Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
     * > because the route configuration is already provided by `rzlZiggyVue`.
     *
     * @template T - A valid route name (based on your `appRoutes` route definitions).
     *
     * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
     * @param {RouteParams<T> | null | undefined} [params] - Route parameters (either an `object`, `array` or `null` value), defaultValue is `undefined`.
     * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
     *
     * @returns {string} Return `string` cause argument `name` is not `null` or `undefined`.
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
    function rt<T extends ValidRouteName>(
      name: T,
      params?: RouteParams<T> | null | undefined,
      absolute?: boolean
    ): string;
    /** -------------------------------------------------------
     * * ***Rzl Ziggy's `route()` from `rzlZiggyVue` helper.***
     * -------------------------------------------------------
     *
     * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
     * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
     *
     * - If called with no arguments, it returns a `Router` instance for more advanced usage.
     * - If called with a route name and optional parameters, it returns a full URL string.
     *
     * > ⚠️ Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
     * > because the route configuration is already provided by `rzlZiggyVue`.
     *
     * @template T - A valid route name (based on your `appRoutes` route definitions).
     *
     * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
     * @param {ParameterValueProps | null | undefined} [params] - Route parameters (either an `object`, `array`, or `null` value), defaultValue is `undefined`.
     * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
     *
     * @returns {string} Return `string` cause argument `name` is not `null` or `undefined`.
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
    function rt<T extends ValidRouteName>(
      name: T,
      params?: ParameterValueProps | null | undefined,
      absolute?: boolean
    ): string;
    /** -------------------------------------------------------
     * * ***Rzl Ziggy's `route()` from `rzlZiggyVue` helper.***
     * -------------------------------------------------------
     *
     * This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).
     * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
     *
     * - If called with no arguments, it returns a `Router` instance for more advanced usage.
     * - If called with a route name and optional parameters, it returns a full URL string.
     *
     * > ⚠️ Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
     * > because the route configuration is already provided by `rzlZiggyVue`.
     *
     * @template T - A valid route name (based on your `appRoutes` route definitions).
     *
     * @param {T} [name] - The name of the route (is `null` or `undefined`), defaultValue is `undefined`.
     * @param {null | undefined} [params] - Route parameters (because argument `name` is `undefined` or `null`, so argument params only can accept `undefined`), defaultValue is `undefined`.
     * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
     *
     * @returns {Router} Return `Router` instance cause argument name is `null` or `undefined`.
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
    function rt(
      name: null | undefined,
      params?: null | undefined,
      absolute?: boolean
    ): Router;
    function rt<T extends ValidRouteName>(
      name?: T | null,
      params?: RouteParams<T> | ParameterValue | null | undefined,
      absolute?: boolean
    ): Router | string {
      return route(name as T, params as any, absolute, options);
    }

    if (parseInt(app.version) > 2) {
      app.config.globalProperties.route = rt;
      app.provide("route", rt);
    } else {
      app.mixin({
        methods: {
          route: rt
        }
      });
    }
  }
};
