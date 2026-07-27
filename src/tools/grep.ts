import { $ } from "bun"
import { parseGrepResult } from "../lib/utilities/parse-grep-result";

interface GrepTypes{
  pattern: string;
  dir: string;

  recursive?: boolean;
  caseSensitive?: boolean;

  excludeDirs?: string[]
  includeExtensions?: string[]
}

export default async function grep({pattern, dir, recursive, caseSensitive=false, excludeDirs, includeExtensions}: GrepTypes) {
  try {

    let flags = []

    recursive && flags.push("-r")
    !caseSensitive && flags.push("-i")
    if(excludeDirs){
      for (const dir of excludeDirs) {
        flags.push(`--exclude-dir=${dir}`)
      }
    }
    if (includeExtensions) {
      for (const ext of includeExtensions) {
        flags.push(`--include=*.${ext}`)
      }
    }

    const results = await $`grep -n ${flags} ${pattern} ${dir}`.text()
    const matches = parseGrepResult(results)
    return matches

  } catch (e) {
    return {
      success: false,
      errorMessage: e instanceof Error ? e.message : "Failed to run command"
    }
  }
}
