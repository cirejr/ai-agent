export type SchemaError = {
  expected: string,
  path: (string | number)[],
  message: string
}

export function invalidResponse(expected: string, path: (string | number)[], message: string): { ok: false, error: SchemaError } {
  return {
    ok: false,
    error: {
      expected,
      path,
      message
    }
  }
}
