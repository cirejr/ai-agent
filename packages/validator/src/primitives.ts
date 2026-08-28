import { actualTypeOf, isRecord } from "./guards"

export abstract class Schema {
  abstract parse(v: unknown): unknown

  optional() {
    return new OptionalSchema(this)
  }
}

export class StringSchema extends Schema {
  type = "string" as const
  parse(v: unknown): string {
    if (typeof v !== "string") {
      throw new Error ("Expected a string")
    }
    return v
  }
}

export class NumberSchema extends Schema {
  type= "number" as const
  parse(v: unknown): number {
    if (typeof v !== "number") {
      throw new Error("Expected a number")
    }
    return v
  }
}

export class BooleanSchema extends Schema {
  type= "boolean" as const
  parse(v: unknown): boolean {
    if(typeof v !== "boolean") throw new Error("Expected a boolean")
    return v
  }
}

export class NullSchema extends Schema {
  type= "null" as const
  parse(v: unknown): null {
    if (actualTypeOf(v) !== "null") throw new Error("Expected null")
    return v as null
  }
}

export class ArraySchema<ItemSchema extends Schema> extends Schema {
  type= "array" as const
  constructor(public items: ItemSchema) {
    super()
  }

  parse(v: unknown) {
    if (!Array.isArray(v)) throw new Error(`Expected an array`)

    for (const item of v) {
      this.items.parse(item)
    }

    return v
  }
}

export class ObjectSchema<Properties extends Record<string, Schema>> extends Schema {
  type= "object" as const
  constructor(public properties: Properties) { //properties -> { "name": StringSchema, "age": NumberSchema }
    super()
  }
  parse(v: unknown) {
    if (!isRecord(v)) throw new Error("Expected an object")
    for (const [key, schema] of Object.entries(this.properties)) {
      schema.parse(v[key])
    }

    return v
  }
}

export class OptionalSchema<InnerSchema extends Schema> extends Schema {
  constructor(public inner: InnerSchema) {
    super()
  }

  parse(v: unknown): unknown {
    if (v === undefined) return undefined
    return this.inner.parse(v)
  }

}


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

  object<Properties extends Record<string, Schema>>(properties: Properties) {
    return new ObjectSchema(properties)
  }

  array<ItemSchema extends Schema>(items: ItemSchema) {
    return new ArraySchema(items)
  }
}

const yus = new YusraValidator()
const userSchema = yus.object({
  name: yus.string(),
  age: yus.number().optional(),
  hobbies: yus.array(yus.string())
})

type User = TypeOf<typeof userSchema>

export type TypeOf<Schema> =
   Schema extends StringSchema ? string :
   Schema extends NumberSchema ? number :
   Schema extends BooleanSchema ? boolean :
   Schema extends NullSchema ? null :
   Schema extends ArraySchema<infer ItemSchema> ? TypeOf<ItemSchema>[] :
   Schema extends ObjectSchema<infer Properties> ? { [key in keyof Properties ]: TypeOf<Properties[key]> } :
  never
