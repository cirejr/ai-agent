import * as ts from "typescript";
import { files } from "./files";
import { convertDeclarations } from "./utils";
import type { OptionalNode, ReferenceNode, Schema, SchemaNode } from "./types";

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
  if (!ts.isTypeAliasDeclaration(node) && !ts.isInterfaceDeclaration(node) && !ts.isEnumDeclaration(node)) {
    ts.forEachChild(node, child => visit(child, checker))
     return;
  }

  const schema = convertDeclarations(node, checker)

    ts.forEachChild(node, (child) => visit(child, checker))
    console.log("schema:", JSON.stringify(schema, null, 2))
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
