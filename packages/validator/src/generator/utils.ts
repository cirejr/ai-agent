import * as ts from "typescript";
import type { ArrayNode, EnumNode, IntersectionNode, ObjectNode, OptionalNode, PrimitiveNode, ReferenceNode, Schema, SchemaNode, TupleNode, UnionNode } from "./types";


export function convertEnum(members: ts.NodeArray<ts.EnumMember>, checker: ts.TypeChecker) {
  let types = []
  for (const member of members) {
    const value = checker.getConstantValue(member)
    if (value == undefined) {
      throw new Error(`Cannot resolve enum member ${member.name.getText()}`)
    }
    types.push({
      name: member.name.getText(),
      value
    })
  }

  return {
    kind: "enum",
    members: types
  } satisfies EnumNode
}

export function convertType(typeNode: ts.TypeNode, checker: ts.TypeChecker): SchemaNode {

  if (ts.isIntersectionTypeNode(typeNode)) {
    let types= []
    for (const type of typeNode.types) {
      types.push(convertType(type, checker))
    }
    return {
      kind: "intersection",
      types
    } satisfies IntersectionNode
  }

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


export function convertDeclarations(node: ts.Node, checker: ts.TypeChecker) : Schema | undefined {
  if (ts.isEnumDeclaration(node)) {
    const schema = {
      name: toSchemaName(node.name.text),
      type: convertEnum(node.members, checker)
    }
    return schema
  }

  if (ts.isInterfaceDeclaration(node)) {
    const schema = {
      name: toSchemaName(node.name.text),
      type: {
        kind: "object",
        properties: convertProperties(node.members, checker)
      } satisfies SchemaNode
    }
    return schema
  }

  if (ts.isTypeAliasDeclaration(node)) {
    const type = ts.isTypeLiteralNode(node.type) ? {
      kind: "object" as const,
      properties: convertProperties(node.type.members, checker)
    } : convertType(node.type, checker)

    const schema = {
      name : toSchemaName(node.name.text),
      type
    }
    return schema
  }

  return undefined
}

export function convertProperties(members: ts.NodeArray<ts.TypeElement>, checker: ts.TypeChecker) {
  let type: Record<string, SchemaNode> = {}
  for (const member of members) {
    if (!ts.isPropertySignature(member) || !member.type) {
      type = {}
      continue
    }
    const propertyName = member.name.getText()
    const propertyType = convertType(member.type, checker)

    type[propertyName] = member.questionToken ? {
      kind: "optional",
      type: convertType(member.type, checker)
    } satisfies OptionalNode : propertyType

  }
    return type
}
