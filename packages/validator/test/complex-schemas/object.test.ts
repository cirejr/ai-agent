import { test, expect } from 'bun:test'
import { yus } from '../../src'
import type { TypeOf } from '../../src/core'

const objSchema = yus.object({
  name: yus.string(),
  age: yus.number().optional(),
  status: yus.enum(["ok", "error"])
})

type User = TypeOf<typeof objSchema>

test("accepts mirroring object", () => {
  const v = {
    name: "junior",
    age: 45,
    status: "ok" as const
  }
  expect(objSchema.parse(v)).toEqual(v)
})

test("accepts missing optional fields", () => {
  const v = {
    name: "junior",
    status: "error" as const
  }
  expect(objSchema.parse(v)).toEqual(v)
})

test("rejects missing required fields", () => {
  const v = {
    status: "error" as const
  }
  expect(() => objSchema.parse(v)).toThrowError("Expected a string")
})

test("rejects invalid fields", () => {
  const v = {
    name: 31,
    age: "45",
    status: "ok" as const
  }
  expect(() => objSchema.parse(v)).toThrowError("Expected a string")
})

test("allows additional unknown fields", () => {
  const v = {
    name: "junior",
    age: 45,
    status: "ok" as const,
    time: "12am"
  }
  expect(objSchema.parse(v)).toEqual(v)
})

test("objects with literal union", () => {
  const objSchema = yus.object({
    kind: yus.union([yus.literal("rect"), yus.literal("circle")]),
    radius: yus.number().optional(),
    long: yus.number().optional()
  })
  const v = {
    kind: "rect" as const,
  }
  expect(objSchema.parse(v)).toEqual(v)
})
