import { Glob } from "bun";


export async function glob(pattern: string) {
  try {
    let filesPaths = []

    const globInstance = new Glob(pattern, )

    for await (const matchFound of globInstance.scan()) {
      filesPaths.push(matchFound)
    }

    const filteredOut = filesPaths.filter(file => {
      return !file.includes("node_modules/")
    })

    return {
      success: true,
      matchCount: filesPaths.length,
      files: filteredOut
    }


  } catch (e) {
    return {
      success: false,
      errorMessage: e instanceof Error ? e.message : "Failed to find files"
    }
  }
}
