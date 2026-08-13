export const VIDEO_MIMES = ["video/mp4" , "video/mpeg" , "video/quicktime" , "video/webm"] as const
export const IMAGE_MIMES = ["image/png" , "image/jpeg" , "image/webp" , "image/gif"] as const
export const AUDIO_MIMES = ["audio/wav", "audio/mp3", "audio/aiff", "audio/aac", "audio/ogg", "audio/flac", "audio/m4a", "audio/pcm16", "audio/pcm24"] as const
export const FILE_MIMES = [
  //PDF
  "application/pdf",
  //spreadhsheets
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel",
  "text/csv", "application/csv", "text/tsv", "text/x-iif", "application/x-iif", "application/vnd.google-apps.spreadsheet",
  // TEXT AND CODES
  "text/plain", "text/markdown", "application/json", "text/html", "text/xml", "application/xml",
  "text/css", "text/javascript", "application/javascript", "application/typescript",
  "text/x-python", "text/x-c", "text/x-c++", "text/x-java", "text/x-ruby", "text/x-php",
  "text/x-golang", "application/x-sh", "text/x-tex", "text/x-csharp", "text/x-sql",
  // Rich documents
  "application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf", "text/rtf", "application/vnd.oasis.opendocument.text",
  // Presentations
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const

export const MEDIA_MIMES = [...VIDEO_MIMES, ...IMAGE_MIMES, ...AUDIO_MIMES]
export const ALL_MIMES = [ ...MEDIA_MIMES, ...FILE_MIMES]
