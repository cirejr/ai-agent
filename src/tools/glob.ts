import { Glob } from "bun";


export async function glob(pattern: string) {
  try {
    let filesPaths = []

    const globInstance = new Glob(pattern)

    for await (const matchFound of globInstance.scan()) {
      filesPaths.push(matchFound)
    }

    return {
      success: true,
      matchCount: filesPaths.length,
      files: filesPaths
    }


  } catch (e) {
    return {
      success: false,
      errorMessage: e instanceof Error ? e.message : "Failed to find files"
    }
  }
}
