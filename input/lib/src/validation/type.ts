import { isType } from "../schema.js"
import { Schema } from "../types.js"
import { z } from "zod"

/**
 * Get a zod validator for the "type" keyword.
 */
export const getTypeValidator = (
  schema: Schema,
): ((v: unknown, ctx: z.RefinementCtx) => void) => {
  const validator = (v: unknown, ctx: z.RefinementCtx): void => {
    if (!schema.type) {
      return
    } else if (v === null && !isType(schema, "null")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
      })
    } else if (
      (typeof v == "number" &&
        !isType(schema, "number") &&
        !isType(schema, "integer")) ||
      (typeof v == "boolean" && !isType(schema, "boolean")) ||
      (typeof v == "string" && !isType(schema, "string")) ||
      (Array.isArray(v) && !isType(schema, "array")) ||
      (typeof v == "object" &&
        v !== null &&
        !Array.isArray(v) &&
        !isType(schema, "object"))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid value",
      })
    }
  }
  return validator
}
