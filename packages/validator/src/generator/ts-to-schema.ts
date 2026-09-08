import * as ts from "typescript";
import { files } from "./files";
import { yus } from "../yusra";
import type { SHA384 } from "bun";

interface Schema {
  name: string,
  properties?: Record<string, unknown>
  type?: unknown
}
export async function toSchema(files: string[], options: ts.CompilerOptions) {
  console.log("files", files)
  let program = ts.createProgram(files, options)

  const checker = program.getTypeChecker()

  for (const file of files) {
    const sourceFile = program.getSourceFile(file)
    if(!sourceFile) throw new Error("No Source File found")
    visit(sourceFile, checker)

  }
  /* const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
    console.log("fileName", sourceFile?.fileName)
    ts.forEachChild(sourceFile!, node => {
      console.log("node", node.kind)
    })
  } */
}

toSchema(files, {})

function visit(node: ts.Node, checker: ts.TypeChecker) {
  if (!ts.isTypeAliasDeclaration(node) && !ts.isInterfaceDeclaration(node)) {
     ts.forEachChild(node, child => visit(child, checker))
     return;
  }

  const schema = {
    name: "",
    properties: {},
    type: ""
  } satisfies Schema

  if (ts.isInterfaceDeclaration(node)) {
    schema.name = toSchemaName(node.name.text)
    convertProperties(node.members, checker, schema)
  }
  if (ts.isTypeAliasDeclaration(node)) {

      schema.name = toSchemaName(node.name.text)
      if (ts.isTypeLiteralNode(node.type)) {
        convertProperties(node.type.members, checker, schema)
      }

      const result = convertType(node.type, checker)
      schema.type = result?.type as string

    }
    ts.forEachChild(node, (child) => visit(child, checker))
    console.log("schema:", schema)
}

function convertProperties(members: ts.NodeArray<ts.TypeElement>, checker: ts.TypeChecker, schema: Schema) {
  for (const member of members) {
    if (!ts.isPropertySignature(member) || !member.type) {
      continue
    }
    const propertyName = member.name.getText()
    const propertyType = convertType(member.type, checker)?.type
    schema.properties![propertyName] = propertyType
  }
}

function tsTypesToYus(propertyType: ts.TypeNode) {
  switch (ts.SyntaxKind[propertyType.kind]) {
    case "StringKeyword": {
      return { type: "yus.string()", innerType: undefined }

    }
    case "NumberKeyword": {
      return {type: "yus.number()", innerType: undefined }
    }
    case "BooleanKeyword": {
      return {type: "yus.boolean()", innerType: undefined }
    }
    case "ArrayType": {
      return {type: "yus.array()"}
    }
    case "UnionType": {
      return {type: "yus.union()"}
    }
  }
}

function convertType(typeNode: ts.TypeNode, checker: ts.TypeChecker) {
  if (ts.isTypeReferenceNode(typeNode)) {
    return convertTypeReference(typeNode, checker)
  }

  return tsTypesToYus(typeNode)
}

function convertTypeReference(typeNode: ts.TypeNode, checker: ts.TypeChecker) {
  const type = checker.getTypeAtLocation(typeNode)
  const name = toSchemaName(typeNode.getText())
  const innerType = primitivesToYus(type.flags)

  return {
    type: name,
    innerType
  }
}

function primitivesToYus(flag: ts.TypeFlags){
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
