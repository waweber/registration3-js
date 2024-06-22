import { Schema } from "./types.js"

import { z } from "zod"
import { getValidationSchema, jsonSchema } from "./validate.js"

export const getArrayValidator = (schema: Schema): z.ZodType<unknown[]> => {
  const itemSchema = schema.items
    ? getValidationSchema(schema.items)
    : jsonSchema
  let s = z.array(itemSchema)

  s = schema.minItems
    ? s.min(schema.minItems, `Choose at least ${schema.minItems}`)
    : s
  s = schema.maxItems
    ? s.max(schema.maxItems, `Choose at most ${schema.maxItems}`)
    : s

  return s
}
