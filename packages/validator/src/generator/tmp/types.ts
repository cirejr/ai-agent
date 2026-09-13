/* type User = {
  sex: "male"
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

type A = "foo"
type B = 42
type C = true
type D = false
type E = null


type Optional = {
  age?: number
}
 */

type Optional = {
  value?: string[]
  status?: "active" | "inactive"
  user?: {
    name: string
  }
}
