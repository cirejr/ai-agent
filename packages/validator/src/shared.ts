export type Result<T, E> = { ok: true, value: T } | { ok: false, error: E }

export type JsonSchema =
  | ObjectSchema
  | ArraySchema
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | NullSchema

export type ObjectSchema = {
  type: "object",
  properties: Record<string, JsonSchema>
  enum?: unknown[],
  value?: unknown
  required?: string[],
}

export type ArraySchema = {
  type: "array",
  items: JsonSchema,
  enum?: unknown[],
  value?: unknown
}

export type StringSchema = {
  type: "string",
  enum?: unknown[],
  value?: string
}

export type NumberSchema = {
  type: "number" | "integer",
  enum?: unknown[],
  value?: number
}

export type BooleanSchema = {
  type: "boolean",
  enum?: boolean[]
  value?: boolean
}

export type NullSchema = {
  type: "null",
  enum?: [null]
  value?: null
}
