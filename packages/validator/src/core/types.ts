export * as Types from "./types"

import type { OptionalSchema, Schema } from "./schema"

export type Prettify<TData> = {
  [K in keyof TData]: TData[K]
} & {}

export type OptionalKeys<TProperties> = {
  [Key in keyof TProperties]: TProperties[Key] extends OptionalSchema<any> ? Key : never
  }[keyof TProperties]

export type RequiredKeys<TProperties extends Record<string, Schema<any>>> = {
  [Key in keyof TProperties]: TProperties[Key] extends OptionalSchema<any> ? never : Key
  }[keyof TProperties]

export type TObjectOuput<
  TProperties extends Record<string, Schema<any>>
> = Prettify<{
    [Key in RequiredKeys<TProperties>]: TypeOf<TProperties[Key]>
  } & {
  [Key in OptionalKeys<TProperties>]?: Exclude<TypeOf<TProperties[Key]>, undefined>
}>

export type Enum = readonly (string | number)[]

export type SchemaTuple = readonly Schema<any>[]

export type TypeOf<S extends Schema<any>> = S extends Schema<infer TData> ? TData : never
