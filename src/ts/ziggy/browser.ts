import { route } from "@/main/route";
import { prefixError } from "./class/exceptions";

if (typeof globalThis.route !== "undefined") {
  console.warn(
    `[${prefixError}]: ⚠️ Detected existing global \`route\`. It will be overridden by rzl-app-ziggy route implementation.`
  );
}

globalThis.route = route;
