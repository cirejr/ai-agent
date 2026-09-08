export type Result<T, E> = { ok: true, value: T } | { ok: false, error: E }

export type JsonSchema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | NullSchema
  | ArraySchema<JsonSchema>
  | ObjectSchema<Record<string, JsonSchema>>

export interface ObjectSchema<P extends Record<string, JsonSchema>> {
  type: "object",
  properties: P,
  enum?: unknown[],
  value?: unknown
  required?: string[],
}

export interface ArraySchema<ItemSchema extends JsonSchema> {
  type: "array",
  items: ItemSchema,
  enum?: unknown[],
  value?: unknown
}

export interface StringSchema {
  type: "string",
  enum?: string[],
  value?: string
}

export interface NumberSchema {
  type: "number" | "integer",
  enum?: number[],
  value?: number
}

export interface BooleanSchema {
  type: "boolean",
  enum?: boolean[]
  value?: boolean
}

export interface NullSchema {
  type: "null",
  enum?: [null]
  value?: null
}

export type TypeOf<Schema> =
   Schema extends StringSchema ? string :
   Schema extends NumberSchema ? number :
   Schema extends BooleanSchema ? boolean :
   Schema extends NullSchema ? null :
   Schema extends ArraySchema<infer ItemSchema> ? TypeOf<ItemSchema>[] :
   Schema extends ObjectSchema<infer Properties> ? { [key in keyof Properties ]: TypeOf<Properties[key]> } :
  never
