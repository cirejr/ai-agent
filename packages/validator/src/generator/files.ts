export const files = [
  /* "packages/llm/src/schema/message.ts",
  "packages/llm/src/schema/openai-responses.ts", */
  "/home/cirejr/work/personel/ai-agent/packages/validator/src/generator/tmp/types.ts",
  "/home/cirejr/work/personel/ai-agent/packages/llm/src/schema/messages.ts",
]

export type Model = {
  id: string,
  provider: string
}

export type MediaPart = {
  type: "media"
  id: string;
  name: string;
  mimeType: string;
  data: string | Uint8Array // string either Base64 encoded data or dataUrl => data:mimeType+base64
}
