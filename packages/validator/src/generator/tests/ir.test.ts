import { describe, expect, test, it } from "bun:test"
import { typescriptToIR } from "../ts-to-ir"
import { expected } from "./expected"

it("converts basic fixture to IR", () => {
  const result = typescriptToIR(
    ["/home/cirejr/work/personal/ai-agent-demo/packages/validator/src/generator/tests/fixtures/basic.ts"],
    {}
  )
  expect(result).toEqual(expected.basic)
})

it("converts enum fixture to IR", () => {
  const result = typescriptToIR(
    ["/home/cirejr/work/personal/ai-agent-demo/packages/validator/src/generator/tests/fixtures/enum.ts"],
    {}
  )
  expect(result).toEqual(expected.enums)
})

it("converts reference fixture to IR", () => {
  const result = typescriptToIR(
    ["/home/cirejr/work/personal/ai-agent-demo/packages/validator/src/generator/tests/fixtures/reference.ts"],
    {}
  )
  expect(result).toEqual(expected.references)
})

it("converts nested fixture to IR", () => {
  const result = typescriptToIR(
    ["/home/cirejr/work/personal/ai-agent-demo/packages/validator/src/generator/tests/fixtures/nested.ts"],
    {}
  )
  expect(result).toEqual(expected.nested)
})

it("converts complex fixture to IR", () => {
  const result = typescriptToIR(
    ["/home/cirejr/work/personal/ai-agent-demo/packages/validator/src/generator/tests/fixtures/complex.ts"],
    {}
  )
  expect(result).toEqual(expected.complex)
})
