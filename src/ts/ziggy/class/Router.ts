import { stringify } from "qs";
import RouteFactory from "./RouteFactory";
import { RouterConfigClass } from "./RouterClass";
import { prefixError, RoutePropsError, RouterConfigError } from "./exceptions";
import type { ParsedQs, RouteParams, RouterConfig } from "../types";

export class Router extends String {
  private _config: RouterConfig;
  private _route: RouteFactory | undefined;
  private _params: Record<string, unknown> = {};

  constructor(
    name?: string,
    params?: RouteParams<string> | Record<string, string>,
    absolute: boolean = true,
    config?: RouterConfig
  ) {
    super();

    if (name?.toString().trim() === "") {
      throw new RoutePropsError(
        `Invalid "name" value: cannot be an empty string. Use \`undefined\` if you don't want to provide a name, and make sure to call a valid \`Router\` method instead.`
      );
    }

    const _config = this.safeValidateRouterConfig(
      config ||
        (typeof appRoutes !== "undefined" ? appRoutes : globalThis.appRoutes)
    );

    this._config = { ..._config, absolute };

    if (name) {
      if (!this._config.routes[name]) {
        throw new RoutePropsError(
          `Route name '${name}' is not in the route list.`
        );
      }

      this._route = new RouteFactory(
        name,
        this._config.routes[name],
        this._config
      );

      this._params = this._parse(params);
    }
  }

  private safeValidateRouterConfig(obj: unknown) {
    try {
      return RouterConfigClass.validateAndWrap(obj);
    } catch (err) {
      if (err instanceof RouterConfigError) {
        throw err;
      }

      throw new Error(
        `${prefixError} - Unknown error while validating \`route()\` config`,
        {
          cause: err instanceof Error ? err : undefined
        }
      );
    }
  }

  private _unresolve(url?: string) {
    if (!url) {
      url = this._currentUrl();
    } else if (this._config.absolute && url.startsWith("/")) {
      url = this._location().host + url;
    }

    let matchedParams:
      | false
      | {
          params?: Record<string, string | undefined>;
          query?: ParsedQs;
        } = {};
    const [name, route] = Object.entries(this._config.routes).find(
      ([name, route]) =>
        (matchedParams = new RouteFactory(name, route, this._config).matchesUrl(
          url
        ))
    ) || [undefined, undefined];

    return {
      name,
      ...matchedParams,
      route: route
    };
  }

  private _currentUrl() {
    const { host, pathname, search } = this._location();

    return (
      (this._config.absolute
        ? host + pathname
        : pathname
            .replace(this._config.url.replace(/^\w*:\/\/[^/]+/, ""), "")
            .replace(/^\/+/, "/")) + search
    );
  }

  private _location() {
    const {
      host = "",
      pathname = "",
      search = ""
    } = typeof window !== "undefined" ? window.location : {};

    return {
      host: this._config.location?.host ?? host,
      pathname: this._config.location?.pathname ?? pathname,
      search: this._config.location?.search ?? search
    };
  }

  private _parse(
    params: RouteParams<string> | Record<string, string> = {},
    route: typeof this._route = this._route
  ): Record<string, string> {
    if (typeof params !== "undefined" && typeof params !== "object") {
      throw new RoutePropsError(
        `Invalid \`route()\` \`params\` property detected. Value \`params\` need object or array type but you passing as \`${typeof params}\`.`
      );
    }

    params ??= {};

    params = (
      ["string", "number"].includes(typeof params) ? [params] : params
    ) as Record<string, string>;

    const segments =
      route?.parameterSegments.filter(
        ({ name }) => !this._config.defaults[name]
      ) || [];

    if (Array.isArray(params)) {
      params = params.reduce(
        (result: Record<string, string>, current: Record<string, string>, i) =>
          segments[i]
            ? { ...result, [segments[i].name]: current }
            : typeof current === "object"
              ? { ...result, ...current }
              : { ...result, [current]: "" },
        {}
      );
    } else if (
      segments.length === 1 &&
      !params[segments[0].name] &&
      ((route && params.hasOwnProperty(Object.values(route.bindings)[0])) ||
        params.hasOwnProperty("id"))
    ) {
      params = { [segments[0].name]: params };
    }

    return {
      ...this._defaults(route),
      ...this._substituteBindings(params as Record<string, string>, route)
    };
  }

  private _defaults(route: typeof this._route): Record<string, string> {
    return (
      route?.parameterSegments
        .filter(({ name }) => this._config.defaults[name])
        .reduce(
          (result, { name }, i) => ({
            ...result,
            [name]: this._config.defaults[name]
          }),
          {}
        ) || {}
    );
  }

  private _substituteBindings(
    params: Record<string, string | Record<string, string>>,
    route: typeof this._route
  ): Record<string, string> {
    return Object.entries(params).reduce((result, [key, value]) => {
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        !route?.parameterSegments.some(({ name }) => name === key)
      ) {
        return { ...result, [key]: value };
      }

      if (route.bindings && !value.hasOwnProperty(route.bindings[key])) {
        if (value.hasOwnProperty("id")) {
          route.bindings[key] = "id";
        } else {
          throw new RoutePropsError(
            `Object passed as '${key}' parameter is missing route model binding key '${route.bindings[key]}'.`
          );
        }
      }

      return {
        ...result,
        ...{ [key]: value[route.bindings[key]] }
      };
    }, {});
  }

  public get params(): Record<string, string | undefined> {
    const { params, query } = this._unresolve();
    const flatQuery: Record<string, string | undefined> = {};

    for (const key in query) {
      const val = query[key];
      if (typeof val === "string") {
        flatQuery[key] = val;
      } else if (Array.isArray(val)) {
        flatQuery[key] = val
          .filter((v): v is string => typeof v === "string")
          .join(",");
      } else if (val && typeof val === "object") {
        flatQuery[key] = JSON.stringify(val);
      }
    }

    return {
      ...params,
      ...flatQuery
    };
  }

  public get routeParams(): Record<string, string | undefined> {
    return this._unresolve().params || {};
  }

  public get queryParams(): ParsedQs {
    return this._unresolve().query || {};
  }

  public has(name: string): boolean {
    if (typeof name !== "string") {
      throw new RoutePropsError(
        `Invalid \`route().has(...)\` \`name\` property detected. Value \`name\` need string type but you passing as \`${typeof name}\`.`
      );
    }
    return this._config.routes.hasOwnProperty(name);
  }

  public current(
    name?: string,
    params: Record<string, string> = {}
  ): boolean | string | undefined {
    if (name && typeof name !== "string") {
      throw new RoutePropsError(
        `Invalid \`route().current(...)\` \`name\` property detected. Value \`name\` need string type but you passing as \`${typeof name}\`.`
      );
    }
    if (params && typeof params !== "object") {
      throw new RoutePropsError(
        `Invalid \`route().current(...)\` \`params\` property detected. Value \`params\` need object or array type but you passing as \`${typeof params}\`.`
      );
    }

    const {
      name: current,
      params: currentParams,
      query,
      route
    } = this._unresolve();

    if (!name) return current;

    const match =
      typeof current === "string" &&
      new RegExp(`^${name.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(
        current
      );

    if ([null, undefined].includes(params as any) || !match) return match;

    const routeObject = new RouteFactory(current, route, this._config);

    params = this._parse(params, routeObject);
    const routeParams = { ...currentParams, ...query };

    if (
      Object.values(params).every((p) => !p) &&
      !Object.values(routeParams).some((v) => v !== undefined)
    ) {
      return true;
    }

    const isSubset = (
      subset: Record<string, string>,
      full: Record<string, string>
    ): boolean => {
      return Object.entries(subset).every(([key, value]) => {
        if (Array.isArray(value) && Array.isArray(full[key])) {
          return value.every((v) => full[key].includes(v));
        }

        if (
          typeof value === "object" &&
          typeof full[key] === "object" &&
          value !== null &&
          full[key] !== null
        ) {
          return isSubset(value, full[key]);
        }

        return full[key] == value;
      });
    };

    return isSubset(params, routeParams as Record<string, string>);
  }

  public toString(): string {
    const thisRoute = this._route;

    if (!thisRoute) {
      throw new RoutePropsError(
        `Function route() was called without a name and used as a string. Pass a valid route name, or use route().current() to get the current route name, or route().current('dashboard') to check if it matches. More info → https://github.com/rzl-app/ziggy?#%EF%B8%8F-warning-calling-route-without-arguments`
      );
    }

    const unhandled = Object.keys(this._params)
      .filter(
        (key) => !thisRoute.parameterSegments.some(({ name }) => name === key)
      )
      .filter((key) => key !== "_query")
      .reduce(
        (result, current) => ({ ...result, [current]: this._params[current] }),
        {}
      );

    const thisParams = this._params["_query"];

    if (
      thisParams !== undefined &&
      (typeof thisParams !== "object" ||
        thisParams === null ||
        Array.isArray(thisParams))
    ) {
      throw new RoutePropsError(
        `The 'params._query' property must be a plain object.`
      );
    }

    return (
      thisRoute.compile(this._params) +
      stringify(
        { ...unhandled, ...thisParams },
        {
          addQueryPrefix: true,
          arrayFormat: "indices",
          encodeValuesOnly: true,
          skipNulls: true,
          encoder: (value, encoder) =>
            typeof value === "boolean"
              ? (Number(value) as unknown as string)
              : encoder(value)
        }
      )
    );
  }

  valueOf(): string {
    return this.toString();
  }
}
