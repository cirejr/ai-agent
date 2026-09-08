export * from "./objects"

import { Schema } from "./schema"
import { isRecord } from "./guards"
import type { TObjectOuput } from "./types"

export class ObjectSchema<TProperties extends Record<string, Schema<any>>> extends Schema<TObjectOuput<TProperties>> {
  type= "object" as const
  constructor(public properties: TProperties) { //properties -> { "name": StringSchema, "age": NumberSchema }
    super()
  }
  parse(v: unknown): TObjectOuput<TProperties> {
    if (!isRecord(v)) throw new Error("Expected an object")
    for (const [key, schema] of Object.entries(this.properties)) {
      schema.parse(v[key])
    }

    return v as TObjectOuput<TProperties>
  }
}
