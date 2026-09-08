import { invalidResponse, type SchemaError } from "./errors";
import { actualTypeOf, isOneOf, isRecord } from "../core/guards";
import type { JsonSchema, Result, TypeOf } from "./types";
import { matchJsTypes } from "./utils";

export function parse<T extends JsonSchema>(data: unknown, schema: T, path: (string | number)[] = []): Result<TypeOf<T>, SchemaError> {

  if (actualTypeOf(data) !== matchJsTypes(schema.type)) return invalidResponse(schema.type, path, `Invalid input: expected ${schema.type}`)

  if (schema.type === "integer" && !Number.isInteger(data)) return invalidResponse(schema.type, path, `Invalid input: expected ${schema.type}`)

  if (schema.type == "object") {
    if (!isRecord(data)) return invalidResponse("object", path, `Invalid input: expected object`)

    if (schema.required !== undefined) {
      for (const key of schema.required) {
        if (data[key] === undefined) return invalidResponse(key, [...path, key], `Missing input: expected ${key}`)
        const result = parse(data[key], schema.properties[key], [...path, key])
        if (result.ok === false) {
          return { ok: false, error: result.error }
        }
      }
    }

    for (const key of Object.keys(schema.properties)) {
      if (data[key] !== undefined) {
        const result = parse(data[key], schema.properties[key], [...path, key] )
        if (result.ok === false) {
          return { ok: false, error: result.error}
        }
      }
    }
  }

  if (schema.type == "array") {
    if(!Array.isArray(data)) return invalidResponse("array", path, `Invalid input: expected ${schema.type}`)
    for (const [idx, el] of data.entries()) {
      const result = parse(el, schema.items, [...path, idx])
      if (!result.ok) return { ok: false, error: result.error }
    }
  }

  if (schema.value !== undefined ) {
    if (data !== schema.value) return invalidResponse(String(schema.value), path, `Invalid input: expected ${schema.value}`)
  }

  if (schema.enum !== undefined) {
    if (!isOneOf(data, schema.enum)) return invalidResponse(schema.enum.join(","), path, `Invalid input: expected one of ${schema.enum}`)
  }

  return {
    ok: true,
    value: data as TypeOf<T>
  }
}
