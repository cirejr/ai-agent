import type { Schema } from '../core'
import type { JsonSchema } from './types'

export function toJsonSchema(schema: Schema<any>): JsonSchema {
  const jsonSchema = {
    type: 'object',
    properties: {},
  } satisfies JsonSchema
  return jsonSchema
}
