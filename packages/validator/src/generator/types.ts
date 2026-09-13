export type Primitives = "string" | "number" | "boolean" | "null"

export interface Schema {
  name: string,
  properties?: Record<string, SchemaNode>
  type?: SchemaNode
}

export interface PrimitiveNode {
  kind: "primitive",
  type: Primitives
}

export interface ArrayNode {
  kind: "array",
  items:  SchemaNode
}

export interface LiteralNode {
  kind: "literal",
  value: string | number | null | boolean
}

export interface UnionNode {
  kind: "union",
  types: SchemaNode[]
}

export interface ObjectNode {
  kind: "object",
  properties: Record<string, SchemaNode>
}

export interface TupleNode {
  kind: "tuple",
  elements: SchemaNode[]
}

export interface IntersectionNode {
  kind: "intersection",
  types: SchemaNode[]
}

export interface OptionalNode {
  kind: "optional",
  type: SchemaNode
}

export interface EnumNode {
  kind: "enum",
  types: SchemaNode[]
}

export interface ReferenceNode {
  kind: "reference",
  name: string
}

export type SchemaNode =
  | PrimitiveNode
  | LiteralNode
  | ReferenceNode
  | EnumNode
  | OptionalNode
  | IntersectionNode
  | TupleNode
  | ObjectNode
  | ArrayNode
  | UnionNode
