
import type { Model } from "../files";

type LLMRequest = {
  model: Model,
}
/* type User = {
  sex: "male"
  name: string
  age?: number
  active: boolean
  id: UserId
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
  value?: string[]
  status?: "active" | "inactive"
  user?: {
    name: string
  }
}

type Tuple = {
  random:["foo", 42],
  random1: [string, "foo"],
  random2:[{ name: string }, boolean[]],
  random3: [string | number, boolean]
}

 */
/* enum Status {
  Pending,
  Active,
  Disabled
} */
/* type A = { a: string }
type B = { b: number }
type C = { c: boolean }

type D = A & (B & C) */

type New = {
  data: Map<string, Model>
}

type MediaPart = {
  type: "media"
  id: string;
  name: string;
  mimeType: string;
  data: string | Uint8Array // string either Base64 encoded data or dataUrl => data:mimeType+base64
}
