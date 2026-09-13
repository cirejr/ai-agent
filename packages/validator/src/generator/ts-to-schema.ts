import * as ts from "typescript";
import { files } from "./files";
import { convertType, toPrimitiveNode } from "./utils";
import type { OptionalNode, ReferenceNode, Schema, SchemaNode } from "./types";

//TODO: Fix literal cases working for other types rather than string alone -> .text isn't the way // DONE.
// Fix optional cases -> look into questionToken // DONE
// Fix recursive check in objects not just top level. // DONE
// tuple support
// intersection support

export async function toSchema(files: string[], options: ts.CompilerOptions) {
  console.log("files", files)
  let program = ts.createProgram(files, options)

  const checker = program.getTypeChecker()

  for (const file of files) {
    const sourceFile = program.getSourceFile(file)
    if(!sourceFile) throw new Error("No Source File found")
    visit(sourceFile, checker)

  }
}

toSchema(files, {})

function visit(node: ts.Node, checker: ts.TypeChecker) {
  if (!ts.isTypeAliasDeclaration(node) && !ts.isInterfaceDeclaration(node)) {
     ts.forEachChild(node, child => visit(child, checker))
     return;
  }

  const schema: Schema = {
    name: "",
    properties: {},
    type: undefined
  }

  if (ts.isInterfaceDeclaration(node)) {
    schema.name = toSchemaName(node.name.text)
    schema.properties = convertProperties(node.members, checker)
  }

  if (ts.isTypeAliasDeclaration(node)) {
    schema.name = toSchemaName(node.name.text)

    if (ts.isTypeLiteralNode(node.type)) {
      schema.properties = convertProperties(node.type.members, checker)
    } else {
      schema.type = convertType(node.type, checker)
    }

  }

    ts.forEachChild(node, (child) => visit(child, checker))
    console.log("schema:", schema)
}

export function convertProperties(members: ts.NodeArray<ts.TypeElement>, checker: ts.TypeChecker) {
  let properties: Record<string, SchemaNode> = {}
  for (const member of members) {
    if (!ts.isPropertySignature(member) || !member.type) {
      properties = {}
      continue
    }

    const propertyName = member.name.getText()
    const propertyType = convertType(member.type, checker)

    properties[propertyName] = member.questionToken ? {
      kind: "optional",
      type: convertType(member.type, checker)
    } satisfies OptionalNode : propertyType

  }
    return properties
}

/* function convertType(typeNode: ts.TypeNode, checker: ts.TypeChecker) {
  if (ts.isTypeReferenceNode(typeNode)) {
    return convertTypeReference(typeNode, checker)
  }

  return tsTypesToYus(typeNode)
} */

function convertTypeReference(typeNode: ts.TypeNode, checker: ts.TypeChecker) {
  const type = checker.getTypeAtLocation(typeNode)
  const name = toSchemaName(typeNode.getText())
  const innerType = primitivesToYus(type.flags)

  return {
    type: name,
    innerType
  }
}

function primitivesToYus(flag: ts.TypeFlags) {
  switch (ts.TypeFlags[flag]) {
    case "String":{
      return { type: "yus.string()" }
    }
    case "Number": {
      return { type: "yus.number()" }
    }
    case "BigInt": {
      return { type: "yus.number()" }
    }
    case "Null": {
      return { type: "yus.null()" }
    }
    case "Nullable": {
      return { type: "yus.null()" }
    }
    case "Literal": {
      return { type: "yus.literal()" }
    }
    case "Enum": {
      return { type: "yus.enum()" }
    }
    case "Object": {
      return { type: "yus.object()" }
    }
    case "Union": {
      return { type: "yus.union()" }
    }
    case "undefined": {
      return { type: "yus.optional()" }
    }
    case "Boolean": {
      return { type: "yus.boolean()" }
    }
    case "BooleanLike": {
      return { type: "yus.boolean()" }
    }
    case "BooleanLikeLiteral": {
      return { type: "yus.boolean()" }
    }
  }
}

function toSchemaName(typeName: string): string {
  if (typeName.includes("type")) {
    return typeName.replace("type", "Schema")
  }
  if (typeName.includes("Type")) return typeName.replace("Type", "Schema")

  return typeName.concat("Schema")
}


/* function schemaDeclaration(node: ts.TypeAliasDeclaration | ts.InterfaceDeclaration): Schema {
  const typeName = node.name.text
  let name
  if (typeName.includes("type")) name = typeName.replace("type", "Schema")
  if (typeName.includes("Type")) name = typeName.replace("Type", "Schema")

  name = typeName.concat("Schema")
  if(ts.isTypeLiteralNode(node)) return {
    name: typeName.concat("Schema"),
    properties : {}
  }

  return {
    name: typeName.concat("Schema"),
    properties: {},
    type: convertType(ts.isTypeNode(node),)
  }
} */

/* const TOYUSSCHEMA_MAP = {
  ts.TypeFlags.String: "yus.string()",
  ts.TypeFlags.Boolean: "yus.boolean()",
  }
 */
