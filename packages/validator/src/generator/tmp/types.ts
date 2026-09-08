type User = {
  name: string
  age?: number
  active: boolean
  id: UserId
  hobbies: string[]
  status: "active" | "inactive"
  adress: UserAdress
}

type UserId = string

interface UserAdress {
  adress: string
}
