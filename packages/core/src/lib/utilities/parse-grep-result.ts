export function parseGrepResult(results: string) {
  const toStrArr = results.split("\n")
  toStrArr.pop()
  const matches = toStrArr.map((str) => {
    const file = str.split(":")
    const removed = file.toSpliced(0, 2)
    return {
      file: file[0],
      line: Number(file[1]),
      content: removed.join(":")
    }
  })

  return matches
}
