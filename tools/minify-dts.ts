import fs from "fs";
import { globSync } from "glob";
import { getFormatExt, LOG_UTILS } from "./utility";

const dtsFiles = globSync("dist/**/*.{d.ts,d.cts}");

LOG_UTILS.ON_START({
  titleStart: "Minifying declaration files (.d.ts / .d.cts)...",
  processLabel: "Preserve:",
  processValue: "JSDoc only",
  processDecryption: "Remove non-jsdoc + whitespace"
});

dtsFiles.forEach((filePath) => {
  const startTime = Date.now();
  const outFile = filePath;

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const ext = getFormatExt(filePath);

    const parts: { type: "code" | "jsdoc" | "comment"; content: string }[] = [];
    let lastIndex = 0;
    const regex = /\/\*\*[\s\S]*?\*\/|\/\*(?!\*)[\s\S]*?\*\//g;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;

      if (start > lastIndex) {
        parts.push({ type: "code", content: content.slice(lastIndex, start) });
      }

      const isJsDoc = match[0].startsWith("/**");
      parts.push({ type: isJsDoc ? "jsdoc" : "comment", content: match[0] });

      lastIndex = end;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "code", content: content.slice(lastIndex) });
    }

    const result = parts
      .map((part) => {
        if (part.type === "jsdoc") return `\n${part.content}\n`;
        if (part.type === "comment") return ""; // remove non-jsdoc comment
        return part.content
          .replace(/[\n\r\t]/g, "")
          .replace(/ {2,}/g, " ")
          .replace(/import\s+([^'"]+?)\s+from/g, (_, imp) => {
            const cleaned = imp
              .replace(/\{\s*/g, "{")
              .replace(/\s*\}/g, "}")
              .replace(/\s*,\s*/g, ",")
              .replace(/\s+/g, " ");
            return `import ${cleaned} from`;
          })
          .replace(/ ?([=:{},;()<>]) ?/g, "$1")
          .replace(/ +/g, " ")
          .trim();
      })
      .filter(Boolean)
      .join("");

    fs.writeFileSync(outFile, result, "utf-8");

    const endTime = Date.now();

    LOG_UTILS.ON_PROCESS({
      format: ext,
      startTime,
      endTime,
      outFile,
      entryFile: filePath
    });
  } catch (error) {
    LOG_UTILS.ON_ERROR(error);
  }
});

LOG_UTILS.ON_FINISH({ text: "ALL DTS MINIFIED" });
