export function isRecord(v: unknown): v is Record<string, unknown> {
  if (v == null || typeof v !== "object") {
    return false
  }

  return true
}

export function isOneOf(v: string, array: string[]) {
  if (!array.includes(v)) return false

  return true
}
