import { RouterConfigError } from "./exceptions";
import type {
  RawParameterValue,
  RouteDefinition,
  RouterConfig
} from "../types";

export class RouterConfigClass implements RouterConfig {
  public absolute?: boolean;
  public url: string;
  public port: number | null;
  public defaults: Record<string, RawParameterValue>;
  public routes: Record<string, RouteDefinition>;
  public location?: {
    host?: string;
    pathname?: string;
    search?: string;
  };

  constructor(config: RouterConfig) {
    this.absolute = config.absolute;
    this.url = config.url;
    this.port = config.port;
    this.defaults = config.defaults;
    this.routes = config.routes;
    this.location = config.location;
  }

  /** Check object like RouterConfig */
  private static isRouterConfigRaw(obj: unknown): obj is RouterConfig {
    if (typeof obj !== "object" || obj === null) return false;

    const o = obj as Partial<RouterConfig>;
    // url
    if (typeof o.url !== "string") {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object, \`config\` need object type but you passing as \`${typeof o}\`.`
      );
    }
    // port
    if (o.port !== null && typeof o.port !== "number") {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config.port\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.port\`, \`config.port\` need number or null type but you passing as \`${typeof o.port}\`.`
      );
    }
    // defaults
    if (typeof o.defaults !== "object" || o.defaults === null) {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config.defaults\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.defaults\`, \`config.defaults\` need array or object type but you passing as \`${typeof o.defaults}\`.`
      );
    }
    // routes
    if (
      typeof o.routes !== "object" ||
      o.routes === null ||
      Array.isArray(o.routes)
    ) {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config.routes\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.routes\`, \`config.routes\` need object type but you passing as \`${typeof o.routes === "object" ? "Array" : typeof o.routes}\`.`
      );
    }

    // location (optional)
    if ("location" in o) {
      const loc = o.location;

      if (typeof loc === "string") {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object, \`config.location\` need object type\`{ host?: string | undefined; pathname?: string | undefined ;search?: string | undefined; }\` but you passing as \`${typeof loc}\`.`
        );
      }

      if (typeof loc !== "object" || loc === null || Array.isArray(loc)) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location\`, \`config.location\` need object type but you passing as \`${typeof o.location === "object" ? "Array" : typeof o.location}\`.`
        );
      }

      const l = loc as Record<string, unknown>;
      if (
        "host" in l &&
        typeof l.host !== "string" &&
        typeof l.host !== "undefined"
      ) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location.host\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location.host\`, \`config.location.host\` need string or undefined type but you passing as \`${typeof o.location?.host}\`.`
        );
      }
      if (
        "pathname" in l &&
        typeof l.pathname !== "string" &&
        typeof l.pathname !== "undefined"
      ) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location.pathname\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location.pathname\`, \`config.location.pathname\` need string or undefined type but you passing as \`${typeof o.location?.pathname}\`.`
        );
      }
      if (
        "search" in l &&
        typeof l.search !== "string" &&
        typeof l.search !== "undefined"
      ) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location.search\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location.search\`, \`config.location.search\` need string or undefined type but you passing as \`${typeof o.location?.search}\`.`
        );
      }
    }

    // passed all checks
    return true;
  }

  /** Validate & convert unknown object to RouterConfigClass */
  public static validateAndWrap(obj: unknown): RouterConfigClass {
    try {
      if (obj instanceof RouterConfigClass) {
        return obj;
      }

      if (!this.isRouterConfigRaw(obj)) {
        throw new RouterConfigError(
          `Invalid \`route()\` config properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object.`
        );
      }

      return new RouterConfigClass(obj);
    } catch (err) {
      if (err instanceof RouterConfigError) {
        throw err;
      }

      throw new RouterConfigError(
        `Invalid \`route()\` config properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object.`,

        err instanceof Error ? err : new Error(String(err))
      );
    }
  }
}
