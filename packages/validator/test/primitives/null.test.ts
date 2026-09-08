import { test, expect } from 'bun:test'
import { yus } from '../../src'

const nullSchema = yus.null()

test("accepts null", () => {
  expect(nullSchema.parse(null)).toBe(null)
})

test("rejects 'null'", () => {
  expect(() => nullSchema.parse('null')).toThrow("Expected null")
})

test("rejects undefined", () => {
  expect(() => nullSchema.parse(undefined)).toThrow("Expected null")
})

test("rejects 0", () => {
  expect(() => nullSchema.parse(0)).toThrow("Expected null")
})

test("accepts object.property: null", () => {
  const jk = {
    name: null
  }
  expect(nullSchema.parse(jk.name)).toBe(null)
})
