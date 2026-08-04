import addLineNumber from "@/lib/utilities/add-line-number";

export default async function readFile(filePath: string) {
  try {
    const file = await Bun.file(filePath);
    const fileWithLines = addLineNumber(await file.text())
    return {
      success: true,
      file: filePath,
      content: fileWithLines
    };
  } catch (e) {
    return {
      success: false,
      errorMessage: e instanceof Error ? e.message : "Couldn't read the file"
    }
  }
}
