import { ArraySchemaProps, JSONType } from "../types.js"
import { z } from "zod"
import { getZodSchema, jsonZodSchema } from "./base.js"

export const getArrayZodSchema = (
  schema: ArraySchemaProps,
): z.ZodType<JSONType[], z.ZodTypeDef, unknown> => {
  const itemSchema = schema.items ? getZodSchema(schema.items) : jsonZodSchema
  let zs = z.array(itemSchema)

  if (schema.minItems != null) {
    zs = zs.min(schema.minItems, `Choose at least ${schema.minItems}`)
  }

  if (schema.maxItems != null) {
    zs = zs.max(schema.maxItems, `Choose at most ${schema.maxItems}`)
  }

  if (schema.uniqueItems) {
    return zs.superRefine((v, ctx) => {
      const itemSet = new Set<unknown>(v)
      if (itemSet.size != v.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No duplicates allowed",
        })
      }
    })
  } else {
    return zs
  }
}
