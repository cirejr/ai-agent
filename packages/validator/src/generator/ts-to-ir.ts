import * as ts from "typescript";
import { files } from "./files";
import { convertDeclarations } from "./utils";
import type { IR, FileImport } from "./types";

export function typescriptToIR(files: string[], options: ts.CompilerOptions): FileImport[] {
  let program = ts.createProgram(files, options)
  const checker = program.getTypeChecker()
  const importFiles: FileImport[] = []

  for (const file of files) {
    const sourceFile = program.getSourceFile(file)
    if (!sourceFile) throw new Error("No Source File found")

    const imports = sourceFile.statements.filter(ts.isImportDeclaration).flatMap((importDeclaration) => {
      const bindings = importDeclaration.importClause?.namedBindings
      if (!bindings || !ts.isNamedImports(bindings)) return []

      return bindings.elements.map(element => ({
        importedName: element.propertyName?.getText() ?? element.name.getText(),
        localName: element.name?.getText(),
        from: (importDeclaration.moduleSpecifier as ts.StringLiteral).text,
      }))
    })

    const importFile: FileImport = {
      file: sourceFile.fileName,
      imports,
      ir: []
    }

    importFiles.push(importFile)
    visit(sourceFile, checker, importFile.ir)
  }

  return importFiles
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

//const ir = typescriptToIR(/* ["/home/cirejr/work/personel/ai-agent/packages/llm/src/schema/messages.ts"] */ files, {})
//console.log("IR:", JSON.stringify(ir, null, 2))
