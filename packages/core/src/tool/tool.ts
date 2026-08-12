import { tool } from "ai";
import z from "zod";

import { grep } from "./grep";
import { readFile } from "./read-file";
import { editFile } from "./edit-file";
import { glob } from "./glob";
import { bash } from "./bash";

export const tools = {
  grep: tool({
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
    execute: async ({ pattern, dir, caseSensitive = false, excludeDirs, includeExtensions }) => {
      const results = await grep({ pattern, dir, caseSensitive, excludeDirs, includeExtensions });
      return results;
    },
  }),

  read_file: tool({
    description:`Search files in the repository.
    Automatically ignores node_modules and hidden directories.
    Use this when exploring project structure.`,
    inputSchema: z.object({
      filePath: z.string().describe("The path to the file to read"),
    }),
    execute: async ({ filePath }) => {
      const content = await readFile(filePath);
      return content;
    },
  }),

  write_file: tool({
    description: "Write content to a file at the specified path",
    inputSchema: z.object({
      path: z.string().describe("The destination file path"),
      content: z.string().describe("The text content to write to the file"),
    }),
    execute: async ({ path, content }) => {
      const file = Bun.file(path);
      await Bun.write(path, content);
      return {
        name: file.name,
        content,
        size: file.size,
        lastModified: file.lastModified,
      };
    },
  }),

  glob: tool({
    description: "Find files matching a glob pattern",
    inputSchema: z.object({
      pattern: z.string().describe("The glob pattern to search for (e.g., '**/*.ts')"),
    }),
    execute: async ({ pattern }) => {
      const result = await glob(pattern);
      return result;
    },
  }),

  edit_file: tool({
    description: "Edit lines within a specific file range",
    inputSchema: z.object({
      path: z.string().describe("The path to the file being edited"),
      startLine: z.number().describe("The starting line number for the replacement"),
      endLine: z.number().describe("The ending line number for the replacement"),
      content: z
        .string()
        .optional()
        .default("")
        .describe("The new content to insert into the specified line range"),
    }),
    execute: async ({ path, startLine, endLine, content }) => {
      const result = await editFile({ path, startLine, endLine, content });
      return result;
    },
  }),

  bash: tool({
    description: "Execute a command-line script in a specified directory",
    inputSchema: z.object({
      command: z
        .array(z.string())
        .describe("The command and arguments array (e.g., ['ls', '-la'])"),
      dir: z.string().describe("The working directory to run the command in"),
    }),
    execute: async ({ command, dir }) => {
      const result = await bash({ command, dir });
      return result;
    },
  }),
};
