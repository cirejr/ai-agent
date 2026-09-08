import { test, expect } from "bun:test"
import { yus } from "../../src"

const booleanSchema = yus.boolean()

test("accepts true", () => {
  expect(booleanSchema.parse(true)).toBe(true)
})

test("accepts false", () => {
  expect(booleanSchema.parse(false)).toBe(false)
})

test("rejects string", () => {
  expect(() => booleanSchema.parse("hello")).toThrowError("Expected a boolean")
})

test("rejects number", () => {
  expect(() => booleanSchema.parse(43)).toThrowError("Expected a boolean")
})

test("rejects zero", () => {
  expect(() => booleanSchema.parse(0)).toThrowError("Expected a boolean")
})

test("rejects one", () => {
  expect(() => booleanSchema.parse(1)).toThrowError("Expected a boolean")
})

test("rejects object", () => {
  expect(() => booleanSchema.parse({isActive: false})).toThrowError("Expected a boolean")
})
