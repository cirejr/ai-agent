import { Schema } from "./schema"
import type { SchemaTuple, TypeOf } from "./types"

export class UnionSchema<T extends SchemaTuple> extends Schema<TypeOf<T[number]>>{
  constructor(public items: T) {
    super()
  }

  parse(v: unknown): TypeOf<T[number]> {
    for (const item of this.items) {
      try {
        return item.parse(v)
      } catch { }
    }
    throw new Error("Value does not match any union member")
  }
}
