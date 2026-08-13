import type { InvalidMedia, Result, ValidateMedia } from "@erwin/schema"

export function validateMedia(mimeType: string, fileData: string | Uint8Array): Result<ValidateMedia, InvalidMedia> {
  const type = mimeType.trim().toLowerCase()
  const isMimeSupported = checkMimeSupport(type)
  const regexp = /^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2}$)/

  if (!isMimeSupported) {
    return {
      ok: false,
      error: {
        _tag: "InvalidMedia",
        message: "Mime type not supported"
      }
    }
  }

  if (fileData instanceof Uint8Array) {
    const base64 = Buffer.from(fileData).toBase64()
    const bytes = new Uint8Array(fileData)
    return {
      ok: true,
      value: {
        mime: type,
        dataUrl: `data:${type};base64,${base64}`,
        base64,
        bytes
      }
    }
  } else {
    const match = fileData.match(regexp)

      if (match?.[0]) {
        const typePart = match?.at(1)?.toLowerCase()
        const base64Part = match?.at(2)

        if (typePart !== type) return {
          ok: false,
          error: {
            _tag: "InvalidMedia",
            message: "Mismatch in the types"
          }
        }
        const isValid = isValidBase64(base64Part!)
        if (!isValid.ok) return {
          ok: false,
          error: {
            _tag: "InvalidMedia",
            message: "Not a valid base64 encoding"
          }
        }

      return {
        ok: true,
        value: {
          mime: type,
          dataUrl: `data:${type};base64,${isValid.value.base64}`,
          base64: isValid.value.base64,
          bytes: isValid.value.bytes
        }
      }
    }
    const isValid = isValidBase64(fileData)
    if(!isValid.ok) return {
      ok: false,
      error: {
        _tag: "InvalidMedia",
        message: "Not a valid base64 encoding"
      }
    }
    return {
      ok: true,
      value: {
        mime: type,
        dataUrl: `data:${type};base64,${isValid.value.base64}`,
        base64: fileData,
        bytes: isValid.value.bytes
      }
    }
  }
}


function checkMimeSupport(mimeType: string): boolean {
  //provide the array of supported mime types then compare if mimeType isn't in return false. or return true.
  if(!supportedByOpenRouter.includes(mimeType)) return false
  return true
}

type ValidBase64 = {
  base64: string,
  bytes: Uint8Array<ArrayBuffer>
}

type InvalidBase = {
  _tag: "InvalidBase64",
  message: string
}

export function isValidBase64(data: string): Result<ValidBase64, InvalidBase> {
  const regex = /^[A-Za-z0-9+/]+={0,2}$/
  if (!regex.test(data)) return {
    ok: false,
    error: {
      _tag: "InvalidBase64",
      message: "not a valid base64",

    }
  }

  if (data === "") return {
    ok: false,
    error: {
      _tag: "InvalidBase64",
      message: "not a valid base64",

    }
  }

  if (data.length % 4 !== 0) return {
    ok: false,
    error: {
      _tag: "InvalidBase64",
      message: "not a valid base64",

    }
  }


  const decoded = Buffer.from(data, "base64")
  const bytes = new Uint8Array(decoded)
  const newEncoding = Buffer.from(bytes).toBase64()

  if (newEncoding !== data) return {
    ok: false,
    error: {
      _tag: "InvalidBase64",
      message: "not a valid base64"
    }
  }

  return {
    ok: true,
    value: {
      base64: newEncoding,
      bytes
    }
  }
}

const videoSupported = ["video/mp4" , "video/mpeg" , "video/mov" , "video/webm"]
const imageSupported = ["image/png" , "image/jpeg" , "image/webp" , "image/gif"]
const audioSupported = ["audio/wav" , "audio/mp3" , "audio/aiff" , "audio/aac" , "audio/ogg" , "audio/flac" , "audio/m4a" , "audio/pcm16" , "audio/pcm24"]

const supportedByOpenRouter = [...audioSupported, ...imageSupported, ...videoSupported]
