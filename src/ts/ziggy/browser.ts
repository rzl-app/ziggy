import { route } from "@/main/route";
import { CONFIG } from "@ts/utils/constants";

if (typeof globalThis.route !== "undefined") {
  console.warn(
    `[${CONFIG.PREFIX.NAME}]: ⚠️ Detected existing global \`route\`. It will be overridden by rzl-app-ziggy route implementation.`
  );
}

globalThis.route = route;
