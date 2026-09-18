export type UserId = string

export interface User {
  id: UserId
  name: string
}

export type Admin = User & {
  permissions: string[]
}
