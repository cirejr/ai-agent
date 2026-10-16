import { yus } from '../yusra'
import type { Schema } from '../../core'

export const ModelID = yus.string().brand<'ModelID'>()
export const ProviderID = yus.string().brand<'ProviderID'>()
export const ModelSchema = yus.object({ id: ModelID, provider: ProviderID })
export const ResultSchema = <T, E>(T: Schema<T>, E: Schema<E>) =>
  yus.union([
    yus.object({ ok: yus.literal(true), value: T }),
    yus.object({ ok: yus.literal(false), error: E }),
  ])
