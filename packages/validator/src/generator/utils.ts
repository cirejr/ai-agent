import * as ts from "typescript";
import type { ArrayNode, EnumNode, LiteralNode, ObjectNode, OptionalNode, PrimitiveNode, ReferenceNode, Schema, SchemaNode, TupleNode, UnionNode } from "./types";
import { convertProperties } from "./ts-to-schema";

export function convertType(typeNode: ts.TypeNode, checker: ts.TypeChecker): SchemaNode {

  if (ts.isTupleTypeNode(typeNode)) {
    let elements = []
    for (const el of typeNode.elements) {
      elements.push(convertType(el, checker))
    }
    return {
      kind: "tuple",
      elements
    } satisfies TupleNode
  }
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

    if(ts.isStringLiteral(literal)){
      return {
        kind: "literal",
        value: literal.text
      }
    }

    throw new Error(`Unsupported literal: ${literal.getText()}`)
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

export function toPrimitiveNode(typeNode: ts.TypeNode, checker: ts.TypeChecker): SchemaNode {
  const type = checker.getTypeAtLocation(typeNode)
  if(typeNode.kind === ts.SyntaxKind.StringKeyword || type.flags & ts.TypeFlags.String) {
      return { kind: "primitive" as const, type: "string"} satisfies PrimitiveNode
  }

  if (typeNode.kind === ts.SyntaxKind.NumberKeyword || (type.flags & ts.TypeFlags.Number)) {
      return {type: "number", kind: "primitive" } satisfies PrimitiveNode
  }

  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword || (type.flags & ts.TypeFlags.Boolean)) {
    return { type: "boolean", kind: "primitive" }

  }

  if (typeNode.kind === ts.SyntaxKind.NullKeyword || (type.flags & ts.TypeFlags.Null)) {
    return {
      kind: "primitive",
      type: "null",
    }
  }

  throw new Error(`Unsupported type: ${typeNode.getText()} `)
}
