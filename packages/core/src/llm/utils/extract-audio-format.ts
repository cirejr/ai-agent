import type { InvalidAudioFormat, Result } from "@erwin/schema"


export function extractAudioFormat(mimeType: string): Result<{format: string}, InvalidAudioFormat> {
  const type = mimeType.trim().toLowerCase()
  if (!type.startsWith("audio/")) {
    return {
      ok: false,
      error: {
        _tag: "InvalidAudioFormat",
        message: "This is not an audio format"
      }
    }
  }

  const format = normalizeFormat(type.split('/')[1]!)

  return {
    ok: true,
    value: {
      format
    }
  }
}

function normalizeFormat(format: string) {
  if (format == "mpeg") {
    return "mp3"
  }

  return format
}
