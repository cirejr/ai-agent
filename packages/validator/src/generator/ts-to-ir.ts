import * as ts from "typescript";
import { files } from "./files";
import { convertDeclarations } from "./utils";
import type { IR } from "./types";

export function typescriptToIR(files: string[], options: ts.CompilerOptions) {
  let program = ts.createProgram(files, options)
  const checker = program.getTypeChecker()
  const ir: IR[] = []

  for (const file of files) {
    const sourceFile = program.getSourceFile(file)
    if(!sourceFile) throw new Error("No Source File found")
    visit(sourceFile, checker, ir)
  }

  return ir
}

function visit(node: ts.Node, checker: ts.TypeChecker, ir: IR[]) {
  if (!ts.isTypeAliasDeclaration(node) && !ts.isInterfaceDeclaration(node) && !ts.isEnumDeclaration(node)) {
    ts.forEachChild(node, child => visit(child, checker, ir))
     return;
  }

  const result = convertDeclarations(node, checker)

  if (result) ir.push(result)

  ts.forEachChild(node, (child) => visit(child, checker, ir))
}

const ir = typescriptToIR(/* ["/home/cirejr/work/personal/ai-agent-demo/packages/llm/src/schema/messages.ts"] */ files, {})
console.log("IR:", JSON.stringify(ir, null, 2))
