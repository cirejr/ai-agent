declare const __brand: unique symbol
/*
export type Model = {
  id: ModelID,
  provider: ProviderID
} */

type Brand<T, B extends T> = T & { [__brand]: B }
type User = { name: string }
type Branded<K, T> = { readonly __brand: T } & User;
/*
export type ModelID = Brand<string, "ModelID">
export type ProviderID = Brand<string, "ProviderID">
 */
