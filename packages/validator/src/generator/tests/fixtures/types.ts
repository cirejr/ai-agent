// ============================================================
// PRIMITIVES
// ============================================================

export type StringType = string
export type NumberType = number
export type BooleanType = boolean
export type NullType = null
export type UndefinedType = undefined

// ============================================================
// LITERALS
// ============================================================

export type StringLiteral = "hello"
export type NumberLiteral = 42
export type TrueLiteral = true
export type FalseLiteral = false

export type LiteralUnion =
  | "pending"
  | "active"
  | "disabled"

export type MixedLiteralUnion =
  | "hello"
  | 42
  | true
  | null

// ============================================================
// OBJECTS
// ============================================================

export type SimpleObject = {
  id: string
  name: string
  age: number
}

export type NestedObject = {
  user: {
    id: string
    profile: {
      name: string
  }
  }
}

export type ComplexObject = {
  id: string
  name: string | null
  tags: string[]
  metadata: {
    createdAt: string
    version: number
  }
}

// ============================================================
// OPTIONAL PROPERTIES
// ============================================================

export type OptionalObject = {
  id: string
  nickname?: string
  age?: number
}

export type ComplexOptionalObject = {
  name?: string | null
  tags?: string[]
  metadata?: {
    createdAt: string
  }
  role?: "admin" | "user"
}

// ============================================================
// INTERFACES
// ============================================================

export interface User {
  id: string
  name: string
}

export interface Address {
  street: string
  city: string
  country: string
}

export interface UserWithAddress {
  id: string
  address: Address
}

// ============================================================
// REFERENCES
// ============================================================

export type UserId = string

export interface UserWithIdReference {
  id: UserId
}

export type UserOrAddress = User | Address

// ============================================================
// ARRAYS
// ============================================================

export type StringArray = string[]
export type NumberArray = number[]
export type ObjectArray = SimpleObject[]

export type UnionArray = (string | number)[]

export type LiteralArray = ("admin" | "user")[]

export type NestedArray = string[][]

export type ArrayOfArrays = number[][][]

export type ArrayOfTuples = [string, number][]

// ============================================================
// UNIONS
// ============================================================

export type StringOrNumber = string | number

export type PrimitiveUnion =
  | string
  | number
  | boolean
  | null

export type ComplexUnion =
  | string
  | number[]
  | SimpleObject
  | User

export type ObjectUnion =
  | {
      success: true
      data: string
    }
  | {
      success: false
      error: string
    }

// ============================================================
// INTERSECTIONS
// ============================================================

export type SimpleIntersection =
  User & Address

export type ThreeWayIntersection =
  User
  & Address
  & {
    active: boolean
  }

export type ObjectAndReferenceIntersection =
  {
    permissions: string[]
  }
  & User

export type IntersectionWithUnion =
  (
    { success: true }
    | { success: false }
  )
  & {
    requestId: string
  }

export type UnionWithIntersection =
  (User & Address)
  | {
      error: string
    }

export type NestedIntersection =
  User
  & (Address & {
    active: boolean
  })

// ============================================================
// TUPLES
// ============================================================

export type SimpleTuple = [string, number]

export type ComplexTuple = [
  string,
  number,
  boolean,
  null
]

export type NestedTuple = [
  string,
  {
    id: string
  },
  boolean[],
  ["nested", number]
]

export type TupleWithUnion = [
  string | number,
  boolean
]

export type TupleWithArray = [
  string,
  number[]
]

export type TupleWithObject = [
  {
    id: string
  },
  {
    name: string
  }
]

// ============================================================
// ENUMS
// ============================================================

export enum NumericEnum {
  Pending,
  Active,
  Disabled
}

export enum ExplicitNumericEnum {
  Pending = 1,
  Active = 2,
  Disabled = 3
}

export enum StringEnum {
  Pending = "pending",
  Active = "active",
  Disabled = "disabled"
}

// ============================================================
// RECURSIVE / CIRCULAR TYPES
// ============================================================

export interface TreeNode {
  value: string
  children: TreeNode[]
}

export interface LinkedNode {
  value: string
  next: LinkedNode
}

export interface Person {
  name: string
  address: PersonAddress
}

export interface PersonAddress {
  city: string
  owner: Person
}

export interface A {
  b: B
}

export interface B {
  c: C
}

export interface C {
  a: A
}

// ============================================================
// RECURSIVE TYPE ALIAS
// ============================================================

export type RecursiveTree = {
  value: string
  children: RecursiveTree[]
}

// ============================================================
// COMPLEX COMPOSITIONS
// ============================================================

export interface Timestamped {
  createdAt: string
  updatedAt: string
}

export type Admin =
  User
  & Timestamped
  & {
    permissions: (
      "read"
      | "write"
      | "delete"
    )[]
  }

export type ApiResponse =
  | {
      success: true
      data: User[]
    }
  | {
      success: false
      error: {
        code: number
        message: string
      }
    }

export type ComplexComposition =
  (
    User
    & Timestamped
  )
  | (
    Address
    & {
      verified: boolean
      tags: string[]
    }
  )

// ============================================================
// PARENTHESIZED TYPES
// ============================================================

export type ParenthesizedPrimitive = (string)

export type ParenthesizedUnion =
  (string | number)

export type ParenthesizedIntersection =
  (User & Address)

export type ParenthesizedArray =
  (string | number)[]

export type NestedParentheses =
  ((string | number))

// ============================================================
// CURRENTLY UNSUPPORTED / FUTURE TESTS
// ============================================================

// These are intentionally here so you know what the converter
// eventually needs to deal with.

// export type AnyType = any
// export type UnknownType = unknown
// export type NeverType = never
// export type VoidType = void
// export type BigIntType = bigint
// export type SymbolType = symbol

// export type FunctionType = (value: string) => number

// export type Dictionary = {
//   [key: string]: number
// }

// export type KeyOfUser = keyof User

// export type UserName = User["name"]

// export type ReadonlyUser = {
//   readonly [K in keyof User]: User[K]
// }

// export type Conditional<T> = T extends string ? true : false

// export type GenericWithId<T> = T & {
//   id: string
// }
