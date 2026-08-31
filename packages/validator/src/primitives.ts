import { actualTypeOf, isRecord } from "./guards"

export abstract class Schema<Output> {
  abstract parse(v: unknown): Output

  optional() {
    return new OptionalSchema(this)
  }
}

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

export class ArraySchema<ItemSchema extends Schema<any>> extends Schema<TypeOf<ItemSchema>[]> {
  type= "array" as const
  constructor(public items: ItemSchema) {
    super()
  }

  parse(v: unknown): TypeOf<ItemSchema>[] {
    if (!Array.isArray(v)) throw new Error(`Expected an array`)

    for (const item of v) {
      this.items.parse(item)
    }

    return v
  }
}

type OptionalKeys<Properties> = {
  [Key in keyof Properties]: Properties[Key] extends OptionalSchema<any> ? Key : never
  }[keyof Properties]

type RequiredKeys<Properties extends Record<string, Schema<any>>> = {
  [Key in keyof Properties]: Properties[Key] extends OptionalSchema<any> ? never : Key
  }[keyof Properties]

type ObjectOuput<
  Properties extends Record<string, Schema<unknown>>
> = {
    [Key in RequiredKeys<Properties>]: TypeOf<Properties[Key]>
  } & {
  [Key in OptionalKeys<Properties>]?: TypeOf<Properties[Key]>
}

export class ObjectSchema<Properties extends Record<string, Schema<any>>> extends Schema<ObjectOuput<Properties>> {
  type= "object" as const
  constructor(public properties: Properties) { //properties -> { "name": StringSchema, "age": NumberSchema }
    super()
  }
  parse(v: unknown): ObjectOuput<Properties> {
    if (!isRecord(v)) throw new Error("Expected an object")
    for (const [key, schema] of Object.entries(this.properties)) {
      schema.parse(v[key])
    }

    return v as ObjectOuput<Properties>
  }
}

export class OptionalSchema<InnerSchema extends Schema<TypeOf<InnerSchema>>> extends Schema<TypeOf <InnerSchema> | undefined> {
  constructor(public inner: InnerSchema) {
    super()
  }

  parse(v: unknown) {
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

  object<Properties extends Record<string, Schema<any>>>(properties: Properties) {
    return new ObjectSchema(properties)
  }

  array<ItemSchema extends Schema<any>>(items: ItemSchema) {
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

/* console.log("parse result : ",userSchema.parse({
  name: "Jane",
  hobbies: ["dancing", "reading"]
})
) */
/* export type TypeOf<Schema> =
   Schema extends StringSchema ? string :
   Schema extends NumberSchema ? number :
   Schema extends BooleanSchema ? boolean :
   Schema extends NullSchema ? null :
   Schema extends ArraySchema<infer ItemSchema> ? TypeOf<ItemSchema>[] :
   Schema extends ObjectSchema<infer Properties> ? { [key in keyof Properties ]: TypeOf<Properties[key]> } :
  never */

  export type TypeOf<S extends Schema<any>> = S extends Schema<infer T> ? T : never
