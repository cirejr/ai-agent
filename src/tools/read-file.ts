import addLineNumber from "../lib/utilities/add-line-number";

export default async function readFile(filePath: string) {
  try {
    const file = await Bun.file(filePath);
    console.log("file stat from read_file", await file.stat())
    const fileWithLines = addLineNumber(await file.text())
    return fileWithLines;
  } catch (e) {}
}
