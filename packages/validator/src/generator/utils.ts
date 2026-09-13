import * as ts from "typescript";
import type { ArrayNode, EnumNode, LiteralNode, ObjectNode, OptionalNode, PrimitiveNode, ReferenceNode, Schema, SchemaNode, UnionNode } from "./types";
import { convertProperties } from "./ts-to-schema";

export function convertType(typeNode: ts.TypeNode, checker: ts.TypeChecker): SchemaNode {
  if (ts.isTypeLiteralNode(typeNode)) {
    return convertObject(typeNode, checker)
  }

  if (ts.isArrayTypeNode(typeNode)) {
    const items = toPrimitiveNode(typeNode?.elementType, checker)
    return {
      kind: "array",
      items
    } satisfies ArrayNode
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    const literal = typeNode.literal!

    if (literal.kind === ts.SyntaxKind.TrueKeyword) {
      return {
        kind: "literal",
        value: true
      }
    }

    if (literal.kind === ts.SyntaxKind.FalseKeyword) {
      return {
        kind: "literal",
        value: false
      }
    }

    if (ts.isNumericLiteral(literal)) {
      return {
        kind: "literal",
        value: Number(literal.text)
      }
    }

    if (literal.kind === ts.SyntaxKind.NullKeyword) {
      return {
        kind: "literal",
        value: null
      }
    }

    return {
      kind: "literal",
      value: literal.getText()
    }
  }

  if (ts.isUnionTypeNode(typeNode)) {
    let types = []
    for (const type of typeNode.types) {
      const schemaNode = convertType(type, checker)
      types.push(schemaNode)
    }
    return {
      kind: "union",
      types
    } satisfies UnionNode
  }

  if (ts.isTypeReferenceNode(typeNode)) {
      const propertyName = typeNode.typeName.getText()
      const nodeName = toSchemaName(propertyName)
      return {
        kind: "reference",
        name: nodeName
      } satisfies ReferenceNode
  }

  return toPrimitiveNode(typeNode, checker)
}

export function convertObject(
  node: ts.TypeLiteralNode,
  checker: ts.TypeChecker
): ObjectNode {
  return {
    kind: "object",
    properties: convertProperties(node.members, checker)
  }
}

function toSchemaName(typeName: string): string {
  if (typeName.includes("type")) {
    return typeName.replace("type", "Schema")
  }
  if (typeName.includes("Type")) return typeName.replace("Type", "Schema")

  return typeName.concat("Schema")
}

function primitivesToSchemaNode(flag: ts.TypeFlags, typeNode: ts.TypeNode){
  switch (ts.TypeFlags[flag]) {
    case "String":{
      return { kind: "primitive", type: "string" } satisfies PrimitiveNode
    }
    case "Number": {
      return { kind: "primitive",type: "number" } satisfies PrimitiveNode
    }
    case "BigInt": {
      return { kind: "primitive",type: "number" } satisfies PrimitiveNode
    }
    case "Null": {
      return { kind: "primitive",type: "null" }
    }
    case "Nullable": {
      return { kind: "primitive",type: "null" }
    }
    case "Literal": {
      return { kind: "literal", value: "" } satisfies LiteralNode
    }
    case "Enum": {
      return { kind: "enum", types: []} satisfies EnumNode
    }
    case "Object": {
      return { kind: "object", properties: {} } satisfies ObjectNode
    }
    case "Union": {
      return { kind: "union", types: [] } satisfies UnionNode
    }
    case "undefined": {
      return { kind: "optional", type: { }  } satisfies OptionalNode
    }
    case "Boolean": {
      return { kind: "primitive",type: "boolean" } satisfies PrimitiveNode
    }
    case "BooleanLike": {
      return { kind: "primitive",type: "boolean" }
    }
    case "BooleanLikeLiteral": {
      return { kind: "primitive",type: "boolean" }
    }
  }
}


export function toPrimitiveNode(typeNode: ts.TypeNode, checker: ts.TypeChecker): SchemaNode {
  const type = checker.getTypeAtLocation(typeNode)
  if(ts.SyntaxKind[typeNode.kind] === "StringKeyword" || ts.NodeFlags[type.flags] === "String" ) {
      return { kind: "primitive" as const, type: "string"} satisfies PrimitiveNode
    }
  if (ts.SyntaxKind[typeNode.kind] === "NumberKeyword" || ts.NodeFlags[type.flags] === "Number") {
      return {type: "number", kind: "primitive" } satisfies PrimitiveNode
    }
  if (ts.SyntaxKind[typeNode.kind] === "BooleanKeyword" || ts.NodeFlags[type.flags] === "Boolean") {

      return { type: "boolean", kind: "primitive" }

  } else if (ts.SyntaxKind[typeNode.kind] === "NullKeyword" || ts.NodeFlags[type.flags] === "Null") {
      return { type: "null", kind: "primitive" }
    }

}
