export type User = {
  id: number
  name: string
  tags: string[]
  metadata: {
    createdAt: string
    updatedAt?: string
  }
  status: "active" | "disabled"
}

export type SearchResult = User | null

export type UserWithId = User & {
  id: number
}

export type Coordinates = [number, number]

export type Matrix = number[][]

export type MixedTuple = [string, number, boolean]
