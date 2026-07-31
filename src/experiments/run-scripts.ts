import { BunFile } from "bun";
import readFile from "../tools/read-file";
import writeFile from "../tools/write-file";
import editFile from "../tools/edit-file";
import { glob } from "../tools/glob";
import grep from "../tools/grep";
import { bash } from "../tools/bash";

/*
const files = (await fileSearch({
  extensions: ["lock", "json"],
})) as BunFile[]; */

//const fileTxt = await readFile("src/tools/file-search.ts");
//console.log(fileTxt);

//const content = fileTxt as string

/* const res = await editFile({
  path: "src/experiments/new-file-search.ts",
  startLine: 15,
  endLine: 23,
  content: `export default async function writeFile({ path, content }: WriteFileTypes) {
    try {
      if (!path) {
        return { errorMessage: "No file path was provided, please provide one" };
      }

      const file = await Bun.file(path);

      await Bun.write(file, content)

      return {
        name: file.name,
        content,
        size: file.size,
        lastModified: file.lastModified
      }
    } catch (e) {
      return {
        errorMessage: e instanceof Error ? e.message : "Failed to write a file"
      }
    }
  }`
})

console.log("response from edit", res) */

//const result = await glob("**/package.json")
/* const result = await grep({
  pattern: `export default async function`,
  dir: ".",
  recursive: true,
})

console.log("results", result) */

const test = await bash({ command: ["grep", "-r", "export default function"], dir: "src/" })
console.log("test", test)

/* const newFile = await writeFile({ path: "src/experiments/new-file-search-02.ts", content })
console.log("new file", await newFile) */
