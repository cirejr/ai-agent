import {test, expect } from "bun:test"

import { yus } from "../../src/yusra"
import type { TypeOf } from "../../src/core"

const numberSchema = yus.number().optional()

type Num = TypeOf<typeof numberSchema>

test("accepts int", () => {
  const num = 42
  expect(numberSchema.parse(num)).toBe(42)
})

test("rejects string", () => {
  const noNum = "45"
  expect(() => numberSchema.parse(noNum)).toThrowError("Expected a number")
})


test("rejects object", () => {
  const noNum = {
    name: "junior",
    age: 45
  }
  expect(() => numberSchema.parse(noNum)).toThrowError("Expected a number")
})

test("accepts zero", () => {
  expect(numberSchema.parse(0)).toBe(0)
})

test("rejects boolean", () => {
  expect(() => numberSchema.parse(true))
    .toThrowError("Expected a number")
})

test("rejects null", () => {
  expect(() => numberSchema.parse(null))
    .toThrowError("Expected a number")
})

test("accepts decimal numbers", () => {
  expect(numberSchema.parse(42.5)).toBe(42.5)
})
