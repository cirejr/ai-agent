import { test, expect } from 'bun:test'
import { yus } from '../../src'

const enumSchema = yus.enum(["married", "single", "divorced"])

test("accepts either of", () => {
  for (const i of ["married", "single", "divorced"]) {

  expect(enumSchema.parse(i)).toBe(i  as "married" | "single" | "divorced")
  }
})

test("rejects if neither of", () => {
  expect(() => enumSchema.parse("marrried")).toThrow()
})
