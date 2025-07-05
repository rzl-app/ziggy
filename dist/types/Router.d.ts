import type { ParsedQs, RawParameterValue } from './types';
interface RouterConfig {
    absolute?: boolean;
    url: string;
    port: number | null;
    defaults: Record<string, RawParameterValue>;
    routes: Record<string, any>;
    location?: {
        host?: string;
        pathname?: string;
        search?: string;
    };
}
export default class Router extends String {
    private _config;
    private _route;
    private _params;
    constructor(name?: string, params?: string | number | Array<any> | object, absolute?: boolean, config?: RouterConfig);
    toString(): string;
    private _unresolve;
    private _currentUrl;
    current(name?: string, params?: string | number | Array<any> | object): boolean | string | undefined;
    private _location;
    get params(): Record<string, any>;
    get routeParams(): ParsedQs;
    get queryParams(): ParsedQs;
    has(name: string): boolean;
    private _parse;
    private _defaults;
    private _substituteBindings;
    valueOf(): string;
}
export {};
