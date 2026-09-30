import * as ts from "typescript";
import { files } from "./files";
import { convertDeclarations } from "./utils";
import type { IR, FileImport, IRNode } from "./types";

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

  const reorderedIR = orderDeclarations(importFiles)
  return reorderedIR
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

export function orderDeclarations(importFiles: FileImport[]): FileImport[] {
  for (const file of importFiles) {
    const result: IR[] = []
    const visiting = new Set<string>()
    for (const declaration of file.ir) {
       reorder(declaration, file.ir, result, visiting)
    }
    file.ir = result
  }
  return importFiles
}

function getReferences(node: IRNode): string[]{
  const references: string[] = []
  const kind = node.kind

    if (kind == "object") {
      for (const value of Object.values(node.properties)) {
        references.push(...getReferences(value))
      }
    }

    if (kind == "array") {
      references.push(...getReferences(node.items))
    }

    if (kind == "optional") references.push(...getReferences(node.type))
    if (kind == "intersection" || kind == "union") {
      for (const type of node.types) {
        references.push(...getReferences(type))
      }
    }

    if (kind == "tuple") {
      for (const el of node.elements) {
        references.push(...getReferences(el))
      }
    }

    if (kind == "record" || kind == "map") {
      references.push(...getReferences(node.key))
      references.push(...getReferences(node.value))
    }

    if (kind == "reference") {
      references.push(node.name)
    }

  return references
}

function reorder(
  declaration: IR,
  ir: IR[],
  result: IR[],
  visiting: Set<string>
) {
  if (visiting.has(declaration.name)) return

  if (result.some(item => item.name === declaration.name)) return

  visiting.add(declaration.name)

  const references = getReferences(declaration.type)

  for (const ref of references) {
    const dependency = ir.find(item => item.name === ref)
    if (dependency) {
      reorder(dependency, ir, result, visiting)
    }
  }
  visiting.delete(declaration.name)
  result.push(declaration)
}

const ir = typescriptToIR(/* ["/home/cirejr/work/personel/ai-agent/packages/llm/src/schema/messages.ts"] */ files, {})
const orderedIR = orderDeclarations(ir)
console.log("IR:", JSON.stringify(orderedIR, null, 2))
