import { invalidResponse, type SchemaError } from "./errors";
import { actualTypeOf, isOneOf, isRecord } from "./guards";
import type { JsonSchema, Result } from "./shared";

export function parse(data: unknown, schema: JsonSchema, path: (string | number)[] = []): Result<unknown, SchemaError> {

  if (actualTypeOf(data) !== schema.type) return invalidResponse(schema.type, [...path], `Ìnvalid input: expected ${schema.type}`)

  if (schema.type == "object") {
    if (!isRecord(data)) return invalidResponse("object", [...path], `Ìnvalid input: expected object`)

      if (schema.required !== undefined) {
        for (const prop of schema.required) {
          if (data[prop] === undefined) return invalidResponse(prop, [...path, prop], `missing input: expected ${prop}`)
        }
      }

      for (const key of Object.keys(schema.properties)) {
        const response = parse(data[key], schema.properties[key], [...path, key] )
        if (response.ok === false) {
          return { ok: false, error: response.error}
        }
    }
  }

  if (schema.type == "array") {
    if(!Array.isArray(data)) return invalidResponse("array", [], `Ìnvalid input: expected ${schema.type}`)
    for (const [idx, el] of data.entries()) {
      const result = parse(el, schema.items, [...path, idx])
      if (!result.ok) return result
    }
  }

  if (schema.value != undefined) {
    if (data !== schema.value) return invalidResponse(schema.value.toString(), path, `Invalid input: expected ${schema.value}`)
  }

  if (schema.enum !== undefined) {
    if (!isOneOf(data, schema.enum)) return invalidResponse(schema.enum.join(","), path, `Ìnvalid input: expected one of ${schema.enum}`)
  }

  const type = actualTypeOf(data)

  return {
    ok: true,
    value: data as typeof type
  }
}
