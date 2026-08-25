import type { JsonSchema } from "./shared"

export function isRecord(v: unknown): v is Record<string, unknown> {
  if (v == null || typeof v !== "object") {
    return false
  }

  return true
}

export function isOneOf(v: unknown, array: unknown[]) {
  if (!array.includes(v)) return false

  return true
}

export function actualTypeOf(v: unknown) {
  const type = typeof v
  if (type === "object") {
    if (Array.isArray(v)) return "array"
    if (v == null) return "null"
  }

  return type
}

export function matchJsTypes(t: JsonSchema["type"]) {
  if (t === "integer") return "number"
  return t
}
