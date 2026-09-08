import type { JsonSchema } from "./types"

export function matchJsTypes(t: JsonSchema["type"]) {
  if (t === "integer") return "number"
  return t
}
