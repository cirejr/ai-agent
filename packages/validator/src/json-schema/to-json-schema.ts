import type { Schema } from "../core";
import type { JsonSchema } from "./types";

export function toJsonSchema(schema: Schema<any>): JsonSchema {
  let jsonSchema = {
    type: "object",
    properties: {

    }
  } satisfies JsonSchema
  return jsonSchema
}
