import type { RouteConfig, Route as RouteType } from './types';
/** ---------------------------------
 * * ***A Laravel route. This class represents one route and its configuration and metadata.***
 * --------------------------------- */
export default class Route {
    private name;
    private definition?;
    private config;
    private bindings;
    private wheres;
    constructor(name: string, definition: RouteType, config: RouteConfig);
    /**
     * Get a 'template' of the complete URL for this route.
     *
     * @example
     * https://{team}.ziggy.dev/user/{user}
     *
     * @return {String} Route template.
     */
    get template(): string;
    /**
     * Get a template of the origin for this route.
     *
     * @example
     * https://{team}.ziggy.dev/
     *
     * @return {String} Route origin template.
     */
    get origin(): string;
    /** -----------------------------------------------
     * * ***Get an array of objects representing the parameters that this route accepts.***
     * -----------------------------------------------
     *
     * @example
     * [{ name: 'team', required: true }, { name: 'user', required: false }]
     *
     * @return {Array<{name:string,required:boolean}>} Parameter segments.
     */
    get parameterSegments(): Array<{
        name: string;
        required: boolean;
    }>;
    /** -----------------------------------------------
     * * ***Get whether this route's template matches the given URL.***
     * -----------------------------------------------
     *
     */
    matchesUrl(url: {
        replace: (arg0: RegExp, arg1: string) => {
            (): any;
            new (): any;
            split: {
                (arg0: string): [any, any];
                new (): any;
            };
        };
    }): false | {
        params: {
            [key: string]: string;
        };
        query: import("qs").ParsedQs;
    };
    /** -----------------------------------------------
     * * ***Hydrate and return a complete URL for this route with the given parameters.***
     * -----------------------------------------------
     *
     * @param {Record<string,any>} params
     * @return {String}
     */
    compile(params: {
        [x: string]: any;
    }): string;
}
