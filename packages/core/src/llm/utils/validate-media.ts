export function validateMedia(mimeType: string, fileData: string|Uint8Array) {
  const type = mimeType.trim().toLowerCase()
  const isMimeSupported = checkMimeSupport(type)

  if (!isMimeSupported) {
    return "Mime type not supported"
  }

  if (fileData instanceof Uint8Array) {
    const base64 = Buffer.from(fileData).toBase64()
    return {
      dataUrl: `data:${type};base64,${base64}`
    }
  } else {
    if (fileData.toString().startsWith("data:")) {
      const toArray = fileData.toString().split(":")
      const typePart = toArray[1]?.split(";")[0]?.trim().toLowerCase()

      if (typePart !== type) return "Mismatch in the types"

      return {
        dataUrl: fileData
      }
    }
    const isValid = isValidBase64(fileData as string)
    if(!isValid) return "Not a valid base64 encoding"
    return {
      dataUrl: `data:${type};base64,${fileData}`
    }
  }
}

function checkDataFormat(data: string|Uint8Array): string {
  const type = typeof data

  if (type === "string") {
    return 'string'
  }

  else return "Uint8Array"
}

function checkMimeSupport(mimeType: string): boolean {
  //provide the array of supported mime types then compare if mimeType isn't in return false. or return true.
  if(!supportedByOpenRouter.includes(mimeType)) return false
  return true
}

export function isValidBase64(data: string): boolean {
  const regex = /^[A-Za-z0-9+/]+={0,2}$/
  if (!regex.test(data)) return false

  if (data === "") return false

  if (data.length % 4 !== 0) return false


  const decoded = Buffer.from(data, "base64")
  const bytes = new Uint8Array(decoded)
  const newEncoding = Buffer.from(bytes).toBase64()

  if (newEncoding === data) return true

  return false
}

const videoSupported = ["video/mp4" , "video/mpeg" , "video/mov" , "video/webm"]
const imageSupported = ["image/png" , "image/jpeg" , "image/webp" , "image/gif"]
const audioSupported = ["audio/wav" , "audio/mp3" , "audio/aiff" , "audio/aac" , "audio/ogg" , "audio/flac" , "audio/m4a" , "audio/pcm16" , "audio/pcm24"]

const supportedByOpenRouter = [...audioSupported, ...imageSupported, ...videoSupported]
