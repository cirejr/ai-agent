import * as ts from "typescript";
import type { ArrayNode, EnumNode, IntersectionNode, ObjectNode, OptionalNode, PrimitiveNode, ReferenceNode, IR, IRNode, TupleNode, UnionNode, RecordNode, BuiltInNode, MapNode } from "./types";


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

export function convertType(typeNode: ts.TypeNode, checker: ts.TypeChecker): IRNode {
  const type = checker.getTypeAtLocation(typeNode)

  if (typeNode.kind == ts.SyntaxKind.AnyKeyword) {
    return {
      kind : "any"
    }
  }

  if (typeNode.kind == ts.SyntaxKind.UnknownKeyword || type.flags & ts.TypeFlags.Unknown) {
    return {
      kind : "unknown"
    }
  }

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
    const items = convertType(typeNode?.elementType, checker)
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

    console.error(`Unsupported literal: ${literal.getText()}`)
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
    //console.log("ref", typeNode.typeName)
    if (type.isTypeParameter()) {
      return {
        kind: "typeParameter",
        name: typeNode.typeName.getText()
      }
    }
    if (ts.isIdentifier(typeNode.typeName)) {
      const nodeName = typeNode.typeName.getText()
      if ( nodeName === "Record" || nodeName === "Map") {
        const [key, value] = typeNode.typeArguments ?? []

        return {
          kind: nodeName === "Record" ? "record" : "map",
          key: convertType(key, checker),
          value: convertType(value, checker)
        } satisfies RecordNode | MapNode
      }
      const symbol = checker.getSymbolAtLocation(typeNode.typeName)
      for (const declaration of symbol?.declarations ?? []) {
        const sourceFile = declaration.getSourceFile()
        if (sourceFile.isDeclarationFile) {
          if (typeNode.typeArguments) {
            const types = typeNode.typeArguments.map(t => convertType(t, checker))
            return {
              kind: "builtin",
              name: typeNode.typeName.text,
              typeArguments: types
            } satisfies BuiltInNode

          }
          return {
            kind: "builtin",
            name: typeNode.typeName.text
          } satisfies BuiltInNode
        }
      }
    }
      const propertyName = typeNode.typeName.getText()
      const nodeName = toIRName(propertyName)
      return {
        kind: "reference",
        name: nodeName,
        typeArguments: typeNode.typeArguments && typeNode.typeArguments.map( arg => convertType(arg, checker))
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

function toIRName(typeName: string): string {
  if (typeName.includes("type")) {
    return typeName.replace("type", "IR")
  }
  if (typeName.includes("Type")) return typeName.replace("Type", "IR")

  return typeName.concat("IR")
}

export function toPrimitiveNode(typeNode: ts.TypeNode, checker: ts.TypeChecker): IRNode {
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

  console.error(`Unsupported type: ${ts.SyntaxKind[typeNode.kind]} `)
}


export function convertDeclarations(node: ts.Node, checker: ts.TypeChecker): IR | undefined {
  if (ts.isEnumDeclaration(node)) {
    const schema = {
      name: toIRName(node.name.text),
      type: convertEnum(node.members, checker)
    }
    return schema
  }

  if (ts.isInterfaceDeclaration(node)) {

    const schema = {
      name: toIRName(node.name.text),
      typeParameters: node.typeParameters?.map(param => (
        {
          name: param.name.text,
          constraint: param.constraint && convertType(param.constraint, checker),
          default: param.default && convertType(param.default, checker)
        }
      )),
      type: {
        kind: "object",
        properties: convertProperties(node.members, checker),
      } satisfies IRNode,
    }
    return schema
  }

  if (ts.isTypeAliasDeclaration(node)) {
    const type = ts.isTypeLiteralNode(node.type) ? {
      kind: "object" as const,
      properties: convertProperties(node.type.members, checker)
    } : convertType(node.type, checker)

    const schema = {
      name : toIRName(node.name.text),
      typeParameters: node.typeParameters?.map(param => (
        {
          name: param.name.text,
          constraint: param.constraint && convertType(param.constraint, checker),
          default: param.default && convertType(param.default, checker)
        }
      )),
      type,
    }
    return schema
  }

  return undefined
}

export function convertProperties(members: ts.NodeArray<ts.TypeElement>, checker: ts.TypeChecker) {
  let type: Record<string, IRNode> = {}
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
