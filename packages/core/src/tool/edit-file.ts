import { replaceContent } from "@/lib/utilities/replace-content"

interface editFileTypes {
  path: string,
  startLine: number,
  endLine: number,
  content?: string
}

//steps
// start by reading the file
// compare start and end lines to array indexes
// extract exact piece, change the content, and replace it
//

export async function editFile({ path, startLine, endLine, content = "" }: editFileTypes) {
  try {
    if (!path || !startLine || !endLine) {
      return { errorMessage: "Missing Mandatory params"}
    }

    const rawText = await Bun.file(path).text()
    const replacedContent = replaceContent(startLine, endLine, content, rawText)
    await Bun.write(path, replacedContent.newRawContent)

    return {
      success: true,
      path,
      linesDeleted: replacedContent.deleteCount,
      linesInserted: replacedContent.newContentLines.length
      }
  } catch (err) {
    return { errorMessage: err instanceof Error ? err.message : "Error editing file" }
  }
}
