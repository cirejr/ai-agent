export interface ImportMetadata {
  importedName: string,
  localName: string,
  from : string
}

export interface FileImport {
  file: string,
  imports: ImportMetadata[],
  ir: IR[]
}

export type Primitives = "string" | "number" | "boolean" | "null"

export interface IR {
  name: string,
  type: IRNode,
  typeParameters?: TypeParameter[]
}

export interface TypeParameter {
  name: string,
  constraint?: IRNode,
  constraintText?: string
  default?: IRNode,
  defaultText?: string
}

export interface TypeParameterNode {
  kind: "typeParameter",
  name: string
}

export interface PrimitiveNode {
  kind: "primitive",
  type: Primitives
}

export interface ArrayNode {
  kind: "array",
  items:  IRNode
}

export interface LiteralNode {
  kind: "literal",
  value: string | number | null | boolean
}

export interface UnionNode {
  kind: "union",
  types: IRNode[]
}

export interface ObjectNode {
  kind: "object",
  properties: Record<string, IRNode>
}

export interface TupleNode {
  kind: "tuple",
  elements: IRNode[]
}

export interface IntersectionNode {
  kind: "intersection",
  types: IRNode[]
}

export interface OptionalNode {
  kind: "optional",
  type: IRNode
}

export interface UnknownNode {
  kind: "unknown",
}

export interface AnyNode {
  kind: "any",
}

export interface RecordNode {
  kind: "record",
  key: IRNode,
  value: IRNode
}

export interface MapNode {
  kind: "map",
  key: IRNode,
  value: IRNode
}

export interface EnumNode {
  kind: "enum",
  members: {
    name: string,
    value: string | number
  }[]
}

export interface ReferenceNode {
  kind: "reference",
  name: string,
  typeArguments?: IRNode[]
}

export interface BuiltInNode{
  kind: "builtin",
  name: string,
  typeArguments? : IRNode[]
}

export type IRNode =
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
  | UnknownNode
  | AnyNode
  | RecordNode
  | BuiltInNode
  | MapNode
  | TypeParameterNode
