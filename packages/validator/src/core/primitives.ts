export * from "./primitives"
import { actualTypeOf, isOneOf, isRecord } from "./guards"
import { Schema } from "./schema"
import type { Enum, TObjectOuput, TypeOf } from "./types"

export class StringSchema extends Schema<string> {
  type = "string" as const
  parse(v: unknown): string {
    if (typeof v !== "string") {
      throw new Error ("Expected a string")
    }
    return v
  }
}

export class NumberSchema extends Schema<number> {
  type= "number" as const
  parse(v: unknown): number {
    if (typeof v !== "number") {
      throw new Error("Expected a number")
    }
    return v
  }
}

export class BooleanSchema extends Schema<boolean> {
  type= "boolean" as const
  parse(v: unknown): boolean {
    if(typeof v !== "boolean") throw new Error("Expected a boolean")
    return v
  }
}

export class NullSchema extends Schema<null> {
  type= "null" as const
  parse(v: unknown): null {
    if (actualTypeOf(v) !== "null") throw new Error("Expected null")
    return v as null
  }
}

export class LiteralSchema<TData> extends Schema<TData> {
  constructor(public input: TData) {
    super()
  }

  parse(v: unknown): TData {
    if (this.input !== v) throw new Error(`typeof ${v} is not assignable to ${this.input}`)

    return v as TData
  }
}

export class EnumSchema<TData extends Enum> extends Schema<TData[number]> {
  constructor(public enums: TData) {
    super()
  }

  parse(v: unknown): TData[number] {
      if (!isOneOf(v, this.enums)) throw new Error()
      return v as TData[number]
  }
}
