import { Glob } from "bun";

const extensions = ["txt", "ts", "js", "tsx", "jsx", "md", "json", "lock"];
type ExtensionType = (typeof extensions)[number];
const pattern = `**/*.{${extensions.join(",")}}`;

interface FileSearch {
  path?: string;
  extensions?: ExtensionType[];
}

export default async function fileSearch({ path, extensions }: FileSearch) {
  console.log("extensions", extensions);

  let files = [];
  if (!path && !extensions) {
    return "please specify a path or an extensions for the file";
  }

  if (path) {
    const file = await Bun.file(path);
    files.push(file);
  }

  if (extensions) {
    const glob = new Glob(`**/*.{${extensions.join(",")}}`);
    for await (const fileFound of glob.scan()) {
      const file = await Bun.file(fileFound);
      files.push(file);
    }
    if (files.length == 0) {
      return "no file with required type was found";
    }
  }

  return files;
}
