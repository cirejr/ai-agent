import { ObjectSchema } from "./core"
import { ArraySchema } from "./core/collection"
import { UnionSchema } from "./core/composition"
import { StringSchema, NumberSchema, BooleanSchema, NullSchema, EnumSchema, LiteralSchema } from "./core/primitives"
import type { Schema } from "./core/schema"
import type { SchemaTuple, Enum } from "./core/types"


export class YusraValidator {
  string() {
    return new StringSchema()
  }

  number() {
    return new NumberSchema()
  }

  boolean() {
    return new BooleanSchema()
  }

  null() {
    return new NullSchema()
  }

  union<const T extends SchemaTuple>(items: T) {
    return new UnionSchema(items)
  }

  literal<const TData>(input: TData) {
    return new LiteralSchema(input)
  }

  object<TProperties extends Record<string, Schema<any>>>(properties: TProperties) {
    return new ObjectSchema(properties)
  }

  enum<const TData extends Enum> (input: TData) {
    return new EnumSchema(input)
  }

  array<TItemSchema extends Schema<any>>(items: TItemSchema) {
    return new ArraySchema(items)
  }
}

export const yus = new YusraValidator()
