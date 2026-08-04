export function replaceContent(startLine:number, endLine: number, newContent:string, rawText: string) {
  const deleteCount = endLine - startLine + 1

  const lines = rawText.split("\n")
  const newContentLines = newContent.split("\n")

  lines.splice((startLine - 1), deleteCount, ...newContent)

  const newRawContent = lines.join("\n")

  return {
    deleteCount,
    newRawContent,
    newContentLines
  }
}
