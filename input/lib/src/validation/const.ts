import { JSONType } from "../types.js"
import { z } from "zod"
import { jsonZodSchema } from "./base.js"

/**
 * Get a schema that validates a const property.
 */
export const getConstZodSchema = (
  constValue: JSONType,
): z.ZodType<JSONType, z.ZodTypeDef, unknown> => {
  let zs: z.ZodType<JSONType, z.ZodTypeDef, unknown> = jsonZodSchema
  zs = zs.superRefine((v, ctx) => {
    if (v === null && constValue !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_literal,
        expected: constValue,
        received: v,
        message: "Required",
      })
    } else if (v !== constValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_literal,
        expected: constValue,
        received: v,
        message: "Invalid value",
      })
    }
  })
  return zs
}
