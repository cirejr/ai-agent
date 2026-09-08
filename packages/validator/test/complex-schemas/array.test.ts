import { test, expect } from 'bun:test'
import { yus } from '../../src'

const arrSchema = yus.array(yus.string())

test("accepts mirroring object", () => {
  const v = ["str"]
  expect(arrSchema.parse(v)).toEqual(v)
})

test("accepts nested array in object", () => {
  const a = null
  const b = null
  const c = null
  const d = null
  const sch = yus.object({
    arr: yus.array(yus.null())
  })

  const v = {
    arr: [a,b,c,d]
  }

  expect(sch.parse(v)).toEqual(v)
})

test("accepts deep nesting", () => {
  const a = 0
  const b = -1
  const c = 2.5
  const d = +10
  const sch = yus.array(yus.object({
    arr: yus.array(yus.number())
  }))

  const v = [{
    arr: [a,b,c,d]
  },
  {
    arr: [d,a,b,c]
  },
  {
    arr: [c,d,a,b]
  },
  ]

  expect(sch.parse(v)).toEqual(v)
})

test("rejects mismatch", () => {
  const a = 0
  const b = -1
  const c = 2.5
  const d = +10
  const sch = yus.array(yus.object({
    arr: yus.array(yus.number())
  }))

  const v = [{
    arr: [a,b,c,d]
  },
  {
    arr: ["a","a","b","c"]
  },
  {
    arr: [c,d,a,b]
  },
  ]

  expect(() => sch.parse(v)).toThrowError("Expected a number")
})

test("accepts union", () => {
  const a = 0
  const b = -1
  const c = "2.5"
  const d = "+10"

  const sch = yus.array(yus.union([yus.string(), yus.number()]))

  const v = [a, b, "a", "d", 4, 4.2, "junior"]

  expect(sch.parse(v)).toEqual(v)
})

test("turns whole array into optional field", () => {
  const a = 0
  const b = -1
  const c = "2.5"
  const d = "+10"

  const sch = yus.array(yus.union([yus.string(), yus.number()])).optional()

  const v = undefined

  expect(sch.parse(v)).toEqual(v)
})

test("accepts optional children", () => {
  const a = 0
  const b = -1
  const c = "2.5"
  const d = "+10"

  const sch = yus.array(yus.union([yus.string(), yus.number()]).optional())

  const v: (string | number)[] = []

  expect(sch.parse(v)).toEqual(v)
})
