import { test, expect } from "bun:test"
import { yus } from "../../src"

const literalSchema = yus.literal("const")

test("accepts literal values", () => {
  expect(literalSchema.parse("const")).toBe("const")
})

test("accepts string declaration with const", () => {
  const str = "const"
  expect(literalSchema.parse(str)).toBe("const")
})

test("accepts string declaration with let", () => {
  let str:string = "const"
  expect(literalSchema.parse(str)).toBe("const")
})

test("accepts string declaration with var", () => {
  let str:string = "const"
  expect(literalSchema.parse(str)).toBe("const")
})

test("accepts object.field: literal value", () => {
  const obj = {
    field: "const"
  }
  expect(literalSchema.parse(obj.field)).toBe("const")
})

test("rejects number", () => {
  const obj = {
    field: 45
  }
  expect(() => literalSchema.parse(obj.field)).toThrow("typeof 45 is not assignable to const")
})

test("rejects string", () => {
  const newLitSchema = yus.literal(45)
  const obj = {
    field: "45"
  }
  expect(() => newLitSchema.parse(obj.field)).toThrow("typeof 45 is not assignable to 45")
})
