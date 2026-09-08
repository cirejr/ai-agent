import { Schema } from "./schema"
import type { TypeOf } from "./types"

export class ArraySchema<TItemSchema extends Schema<any>> extends Schema<TypeOf<TItemSchema>[]> {
  type= "array" as const
  constructor(public items: TItemSchema) {
    super()
  }

  parse(v: unknown): TypeOf<TItemSchema>[] {
    if (!Array.isArray(v)) throw new Error(`Expected an array`)

    for (const item of v) {
      this.items.parse(item)
    }

    return v
  }
}
