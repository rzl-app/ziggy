import { Config } from "./config.js";
export type BuildConfig = Required<Omit<Config, "url" | "group">> & {
    url?: string;
    group?: string;
};
export declare const build: (version: string, config: BuildConfig) => string[];
