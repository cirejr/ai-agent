export interface User {
  id: number
  name: string
  active: boolean
  nickname?: string
}

export type UserId = string

export type Status = "pending" | "active" | "disabled"
