declare const __brand: unique symbol

export type Model = {
  id: ModelID
  provider: ProviderID
}

type Brand<T, B extends T> = T & { [__brand]: B }

export type ModelID = Brand<string, 'ModelID'>
export type ProviderID = Brand<string, 'ProviderID'>

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
