import { isType } from "../schema.js"
import { NumberSchemaProps, SchemaType } from "../types.js"
import { z } from "zod"

export const getNumberZodSchema = (
  schema: NumberSchemaProps & {
    readonly type?: SchemaType | readonly SchemaType[]
  },
): z.ZodType<number> => {
  let zs = z.number()

  if (schema.minimum != null) {
    zs = zs.min(schema.minimum, `Must be at least ${schema.minimum}`)
  }

  if (schema.maximum != null) {
    zs = zs.max(schema.maximum, `Must be at most ${schema.maximum}`)
  }

  if (isType(schema, "integer")) {
    zs = zs.int("Must be a whole number")
  }

  return zs
}
