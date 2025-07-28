import { parse } from "qs";
import type {
  RouteFactoryConfig,
  RouteDefinition,
  UnknownObject
} from "../types";
import { RoutePropsError, RouterConfigError } from "./exceptions";

/** ---------------------------------
 * * ***A Laravel route. This class represents one route and its configuration and metadata.***
 * --------------------------------- */
export default class RouteFactory {
  private name: string;
  private definition?: RouteDefinition;
  private config?: RouteFactoryConfig;
  private wheres: UnknownObject;
  public bindings: Record<string, string> = {};

  public constructor(
    name: string,
    definition?: RouteDefinition,
    config?: RouteFactoryConfig
  ) {
    this.name = name;
    this.definition = definition;
    this.bindings = definition?.bindings ?? {};
    this.wheres = definition?.wheres ?? {};
    this.config = config;
  }

  /** -------------------------------------------------------
   * * ***Get a 'template' of the complete URL for this route.***
   * -------------------------------------------------------
   *
   * @example
   * https://{team}.rzl.dev/user/{user}
   *
   * @return {String} Route template.
   */
  private get template(): string {
    const template = `${this.origin}/${this.definition?.uri}`.replace(
      /\/+$/,
      ""
    );

    return template === "" ? "/" : template;
  }

  /** -------------------------------------------------------
   * * ***Get a template of the origin for this route.***
   * -------------------------------------------------------
   *
   * @example
   * https://{team}.rzl.dev/
   *
   * @return {String} Route origin template.
   */
  private get origin(): string {
    if (!this.config?.absolute) return "";

    if (this.definition?.domain) {
      const match = this.config.url.match(/^\w+:\/\//);
      if (!match) {
        throw new RouterConfigError(
          `Invalid \`config.url\` missing protocol (e.g., http:// or https://)`
        );
      }
      const protocol = match[0];

      return `${protocol}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ""}`;
    }

    return this.config.url;
  }

  /** -----------------------------------------------
   * * ***Get an array of objects representing the parameters that this route accepts.***
   * -----------------------------------------------
   *
   * @example
   * [{ name: 'team', required: true }, { name: 'user', required: false }]
   *
   * @return {Array<{name:string,required:boolean}>} Parameter segments.
   */
  public get parameterSegments(): Array<{ name: string; required: boolean }> {
    return (
      this.template.match(/{[^}?]+\??}/g)?.map((segment) => ({
        name: segment.replace(/{|\??}/g, ""),
        required: !/\?}$/.test(segment)
      })) ?? []
    );
  }

  /** -----------------------------------------------
   * * ***Get whether this route's template matches the given URL.***
   * -----------------------------------------------
   */
  public matchesUrl(url: string) {
    if (!this.definition?.methods.includes("GET")) return false;

    const pattern = this.template
      .replace(/[.*+$()[\]]/g, "\\$&")
      .replace(
        /(\/?){([^}?]*)(\??)}/g,
        (_, slash: string, segment: string, optional?: string) => {
          const regex = `(?<${segment}>${
            (this.wheres[segment] as string)?.replace(/(^\^)|(\$$)/g, "") ||
            "[^/?]+"
          })`;
          return optional ? `(${slash}${regex})?` : `${slash}${regex}`;
        }
      )
      .replace(/^\w+:\/\//, "");

    const [location, query] = url.replace(/^\w+:\/\//, "").split("?");

    const matches =
      new RegExp(`^${pattern}/?$`).exec(location) ??
      new RegExp(`^${pattern}/?$`).exec(decodeURI(location));

    if (matches) {
      for (const k in matches.groups) {
        matches.groups[k] =
          typeof matches.groups[k] === "string"
            ? decodeURIComponent(matches.groups[k])
            : matches.groups[k];
      }
      return { params: matches.groups, query: parse(query) };
    }

    return false;
  }

  /** -----------------------------------------------
   * * ***Hydrate and return a complete URL for this route with the given parameters.***
   * -----------------------------------------------
   *
   * @param {Record<string,any>} params
   * @return {String}
   */
  public compile(params: Record<string, unknown> = {}): string {
    const url = this.template.replace(
      /{([^}?]+)(\??)}/g,
      (_match, segment: string, optional: string) => {
        const value = params[segment];

        if (!optional && (value === undefined || value === null)) {
          throw new RoutePropsError(
            `Invalid \`${segment}\` parameter is required for route \`${this.name}\`.`
          );
        }

        if (this.wheres[segment]) {
          const regex = new RegExp(`^${this.wheres[segment]}$`);
          if (!regex.test(String(value))) {
            throw new RoutePropsError(
              `Invalid \`${segment}\` parameter \`${value}\` does not match required format \`${this.wheres[segment]}\` for route \`${this.name}\`.`
            );
          }
        }

        return encodeURI(String(value ?? ""))
          .replace(/%7C/g, "|")
          .replace(/%25/g, "%")
          .replace(/\$/g, "%24");
      }
    );

    let finalUrl = url;
    if (this.config?.absolute && url.includes("://")) {
      const [protocol, rest] = url.split("://");
      finalUrl = protocol + "://" + rest.replace(/\/{2,}/g, "/");
    } else {
      finalUrl = url.replace(/\/{2,}/g, "/");
    }

    return finalUrl === "/" ? "/" : finalUrl.replace(/\/+$/, "");
  }
}
