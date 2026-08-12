export function extractAudioFormat(mimeType: string) {
  const type = mimeType.trim().toLowerCase()
  if (!type.startsWith("audio/")) {
    return "This is not an audio format"
  }

  const format = normalizeFormat(type.split('/')[1]!)

  return format
}

function normalizeFormat(format: string) {
  if (format == "mpeg") {
    return "mp3"
  }

  return format
}
