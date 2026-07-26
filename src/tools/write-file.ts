interface WriteFileTypes {
  path: string;
  content: string;
}

export default async function writeFile({ path, content }: WriteFileTypes) {
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
}
