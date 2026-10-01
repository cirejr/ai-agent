/* export type Result<T extends {name:string}, E= Error> = { ok: true, value: T } | { ok: false, error: E }
type User = string

type AppError = {
  _tag: "hello"
}

type UserResult = Result<User, AppError>
 */
// Constraint + Default on the same parameter
type EventResult<T extends `event_${string}`, E = Error> = { ok: true, value: T } | { ok: false, error: E };

// Using one parameter to constrain another (Dependent Constraints)
type Store<T, K extends keyof T> = { item: T; key: K };
