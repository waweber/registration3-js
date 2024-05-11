import { Schema } from "./types.js"
import { z } from "zod"

export const getNumberValidator = (schema: Schema): z.ZodType<number> => {
  let s = z.number()

  if (
    (Array.isArray(schema.type) && schema.type.includes("integer")) ||
    schema.type == "integer"
  ) {
    s = s.int("Enter a whole number")
  }

  s =
    schema.minimum != null
      ? s.min(schema.minimum, `Must be at least ${schema.minimum}`)
      : s
  s =
    schema.maximum != null
      ? s.max(schema.maximum, `Must be at most ${schema.maximum}`)
      : s

  return s
}
