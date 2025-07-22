import { run } from "vite-plugin-run";
import { defaultConfig } from "./config.js";
import { getComposerPackageVersion } from "./utils.js";
import { build } from "./build.js";
export default (config = {}) => {
    try {
        const version = getComposerPackageVersion();
        const cmd = build(version, { ...defaultConfig, ...config });
        const { configResolved, handleHotUpdate } = run([
            {
                name: "rzl-ziggy-generator",
                run: cmd,
                condition: (file) => file.includes("/routes/") && file.endsWith(".php")
            }
        ]);
        return {
            name: "rzl-ziggy-plugin",
            configResolved,
            handleHotUpdate
        };
    }
    catch (error) {
        console.error("\n[rzl-vite-plugin-ziggy] Error:");
        if (error instanceof Error) {
            console.error(error.message);
            if (process.env.NODE_ENV === "development") {
                console.error(error.stack);
            }
        }
        else {
            throw error;
        }
    }
    return {};
};
