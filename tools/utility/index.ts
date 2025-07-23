import fs from "fs";
import chalk from "chalk";
import { relative } from "path";
import prettyBytes from "pretty-bytes";

export const toRelative = (p: string) => relative(process.cwd(), p);
export const measureSize = (filePath: string) => {
  try {
    const size = fs.statSync(filePath).size;
    return chalk.gray(`(${prettyBytes(size)})`);
  } catch {
    return chalk.red("(size error)");
  }
};
export const detectFormat = (file: string): "cjs" | "esm" | "iife" => {
  if (file.includes(".cjs")) return "cjs";
  if (file.includes(".esm") || file.includes(".es")) return "esm";
  return "iife";
};

export type PartialByKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
