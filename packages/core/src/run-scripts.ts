import type { BunFile } from "bun";
import {readFile} from "./tool/read-file";
import {writeFile} from "./tool/write-file";
import {editFile} from "./tool/edit-file";
import { glob } from "./tool/glob";
import {grep} from "./tool/grep";
import { bash } from "./tool/bash";
import {registry} from "./registry/tool-registry";
import z from "zod";
import type { AnyToolDescriptor, ToolDescriptor } from "@erwin/schema";
import { isOneOf } from "../../llm/src/protocols/openai-responses";

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

/* const test = await bash({ command: ["git", "status"], dir: "." })
console.log("test", test) */

/* const newFile = await writeFile({ path: "src/experiments/new-file-search-02.ts", content })
console.log("new file", await newFile) */

//const results = await glob("**/*.ts")
//console.log("results", results)
/*
interface GrepTypes{
  pattern: string;
  dir: string;

  caseSensitive?: boolean;

  excludeDirs?: string[]
  includeExtensions?: string[]
}

const tool2 = {
  name: "grep",
   description: "Get a piece of content inside a file",
  inputSchema: z.object({
    pattern: z.string().describe("The matching pattern for the search"),
    dir: z.string().describe("The directory the search should be conducted in"),
    caseSensitive: z
      .boolean()
      .optional()
      .describe("Whether or not the pattern should be case sensitive"),
    excludeDirs: z
      .array(z.string())
      .optional()
      .describe("The array of directories to exclude from the search"),
    includeExtensions: z
      .array(z.string())
      .optional()
      .describe("The file extensions to conduct the search on"),
  }),
  execute: async ({ pattern, dir, caseSensitive = false, excludeDirs, includeExtensions }: GrepTypes) => {
    const results = await grep({ pattern, dir, caseSensitive, excludeDirs, includeExtensions });
    return results;
  }
} as ToolDescriptor<GrepTypes, unknown>

const tool1 = {
  name: "read_file",
  description: `Search files in the repository.
  Automatically ignores node_modules and hidden directories.
  Use this when exploring project structure.`,
  inputSchema: z.object({
    filePath: z.string().describe("The path to the file to read"),
  }),
  execute: async ({filePath}:{ filePath: string}) => {
    const content = await readFile(filePath);
    return content;
  }
} as AnyToolDescriptor

registry.register(tool1)

console.log(registry.list())

registry.register(tool2)

console.log(registry.list())

console.log("has read_file", registry.get("read_file")?.name)
console.log("has read_file", registry.get("grep")?.name)
 */

//const file = Bun.file("/mnt/c/Users/D E L L/Downloads/Subnetting_Blueprint.pdf")
//

console.log("is ", isOneOf("bonjour", ["completed", "in_progress", "failed"]))
