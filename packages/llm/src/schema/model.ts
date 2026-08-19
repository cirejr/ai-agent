declare const __brand: unique symbol

export type Model = {
  id: ModelID,
  provider: ProviderID
}

type Brand<T, B extends T> = T & { [__brand]: B }

export type ModelID = Brand<string, "ModelID">
export type ProviderID = Brand<string, "ProviderID">

export const ModelID = {
  make: (input: string) => input as ModelID
}

export const ProviderID = {
  make: (input: string) => input as ProviderID
}

export const Model = {
  make: (input: { id: string, provider: string}) => {
    return {
      id: ModelID.make(input.id),
      provider: ProviderID.make(input.provider)
    }
  }

}
