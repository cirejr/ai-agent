import type { Schema } from "../core";
import { yus } from "../yusra";
import { expected } from "./tests/expected";
import { typescriptToIR } from "./ts-to-ir";
import type { IR, IRNode } from "./types";

export async function generateFile(files: string[], options = {}) {
  const ir = typescriptToIR(files, options)
  const declarations = generateDeclaration(ir)

  const fileContent = [
    `import { yus } from "../yusra"; `,
    ...declarations
    ].join("\n")

  const file = await Bun.write("schemas.ts", fileContent)

  return file
}

export function generateDeclaration(ir: IR[]) {
  return ir.map(item => (
    `export const ${item.name.replace("IR", "Schema")} = ${toSchema(item.type)}`))
}

export function toSchema(node: IRNode): string {
  switch (node.kind) {
    case "primitive": {
      return `yus.${node.type}()`
    }
    case "literal": {
      return `yus.literal(${JSON.stringify(node.value)})`
    }

    case "union": {
      return `yus.union([${node.types.map(toSchema).join(", ")}])`
    }

    case "enum": {
      return `yus.enum([${node.members.map(member => member.name)}])`
    }

    case "array": {
      return `yus.array(${toSchema(node.items)})`
    }

    case "optional": {
      return `${toSchema(node.type)}.optional()`
    }

    case "object": {
      const properties = Object.entries(node.properties).map(([name, type]) => {
        return `${name}: ${toSchema(type)}`
      }).join(", ")
      return `yus.object({ ${properties} })`
    }

    case "reference": {
      return node.name.replace("IR", "Schema")
    }

    case "intersection": {
      const schemas = node.types.map( item => toSchema(item)).join(", ")
      return `yus.intersection(${schemas})`
    }

    case "tuple": {
      return `yus.tuple([${node.elements.map(toSchema).join(", ")}])`
    }
  }
}

const result = generateDeclaration(expected.complex)
console.log("result", JSON.stringify(result, null, 2))

/* export function irToYus(node: IRNode){
  switch (node.kind) {
    case "primitive": {
      return yus[node.type]()
    }
    case "literal": {
      return yus.literal(node.value)
    }

    case "union": {
      return yus.union(node.types.map(irToYus))
    }

    case "enum": {
      return yus.enum(node.members.map(member => member.name))
    }

    case "array": {
      return yus.array(irToYus(node.items))
    }

    case "optional": {
      return irToYus(node.type).optional()
    }

    case "object": {
      const properties: Record<string, Schema<any>> = {}
      for (const [key, value] of Object.entries(node.properties)) {
        properties[key] = irToYus(value)
      }
      return yus.object(properties)
    }
  }
} */

await generateFile(["/home/cirejr/work/personal/ai-agent-demo/packages/llm/src/schema/errors.ts"])
