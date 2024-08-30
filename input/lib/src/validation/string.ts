import { StringSchemaProps } from "../types.js"
import { z } from "zod"

export const getStringZodSchema = (
  schema: StringSchemaProps,
): z.ZodType<string> => {
  let zs = z.string()

  if (schema.minLength != null) {
    zs = zs.min(
      schema.minLength,
      `Must be at least ${schema.minLength} characters`,
    )
  }

  if (schema.maxLength != null) {
    zs = zs.max(
      schema.maxLength,
      `Must be at most ${schema.maxLength} characters`,
    )
  }

  if (schema.pattern) {
    const regexp = new RegExp(schema.pattern)
    zs = zs.regex(regexp, "Invalid value")
  }

  // TODO: formats
  return zs
}
