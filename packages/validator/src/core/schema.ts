import type { TypeOf } from "./types"

export abstract class Schema<TOutput> {
  abstract parse(v: unknown): TOutput

  optional() {
    return new OptionalSchema<TOutput>(this)
  }
}


export class OptionalSchema<TOutput> extends Schema<TOutput | undefined> {
  constructor(public inner: Schema<TOutput>) {
    super()
  }

  parse(v: unknown): TOutput | undefined {
    if (v === undefined) return undefined
    return this.inner.parse(v)
  }

}
