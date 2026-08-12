export type MediaCategory = "image" | "audio" | "video" | "file"

export function getMediaCategory(mimeType: string): MediaCategory {
  const type = mimeType.trim().toLowerCase();

  if (type.startsWith("image/")) return "image"
  if (type.startsWith("audio/")) return "audio"
  if (type.startsWith("video/")) return "video"

  return "file"
}
