export type Result<T, E = Error> = { ok: true, value: T } | { ok: false, error: E }
type User = {
  name: string
}

type AppError = {
  _tag: "hello"
}

type UserResult = Result<User, AppError>
