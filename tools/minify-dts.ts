import fs from "fs";
import chalk from "chalk";
import { globSync } from "glob";
import { measureSize, toRelative } from "./utility";

console.log(
  `\n${chalk.blueBright.bold("▶️  Minifying declaration files (.d.ts / .d.cts)")}\n` +
    `${chalk.gray("→")} ${chalk.cyan("Preserve:")} JSDoc only ${chalk.gray("|")} ${chalk.yellow("Remove non-jsdoc + whitespace")}`
);

const dtsFiles = globSync("dist/**/*.{d.ts,d.cts}");

dtsFiles.forEach((filePath) => {
  const start = Date.now();
  const content = fs.readFileSync(filePath, "utf-8");

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

  fs.writeFileSync(filePath, result, "utf-8");

  const duration = Date.now() - start;
  const relativePath = toRelative(filePath);
  const sizeInfo = measureSize(filePath);

  console.log(
    `${chalk.green("✔️ ")} ${chalk.yellow("DTS")} ${chalk.gray("→")} ${chalk.magenta(relativePath)} ${sizeInfo} ${chalk.gray(`[${duration}ms]`)}`
  );
});

console.log(`${chalk.greenBright.bold("✅ ALL DTS MINIFIED")}\n`);
