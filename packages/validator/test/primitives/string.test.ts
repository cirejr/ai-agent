import {test, expect } from "bun:test"
import { yus } from "../../src/yusra"
import type { TypeOf } from "../../src/core"

const stringSchema = yus.string().optional()

type Str = TypeOf<typeof stringSchema>

test("accepts string", () => {
  const str = "hello"
  expect(stringSchema.parse(str)).toBe("hello")
})

test("rejects int", () => {
  const notStr = 42
  expect(() => stringSchema.parse(notStr)).toThrowError("Expected a string")
})


test("rejects object", () => {
  const notStr = {
    name: "junior"
  }
  expect(() => stringSchema.parse(notStr)).toThrowError("Expected a string")
})

test("accepts empty string", () => {
  expect(stringSchema.parse("")).toBe("")
})

test("rejects boolean", () => {
  expect(() => stringSchema.parse(true))
    .toThrowError("Expected a string")
})

test("rejects null", () => {
  expect(() => stringSchema.parse(null))
    .toThrowError("Expected a string")
})
