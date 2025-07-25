import { route } from "./main/route";

if (typeof globalThis.route !== "undefined") {
  console.warn(
    "[rzl-app-ziggy]: ⚠️ Detected existing global `route`. It will be overridden by rzl-app-ziggy route implementation."
  );
}

globalThis.route = route;
