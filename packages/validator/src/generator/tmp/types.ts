
type LLMRequest = {
  model: Model,
}

export type Model = {
  id: string,
  media: MediaPart
}

export type MediaPart = {
  type: "media"
  id: string;
  name: string;
  mimeType: string;
  data: string | Uint8Array // string either Base64 encoded data or dataUrl => data:mimeType+base64
}

type New = {
  data: Map<string, Model>
}

type A = {
  x: B[]
}

type B = {
  y: C
}

type C = string
