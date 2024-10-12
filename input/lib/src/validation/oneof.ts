import { JSONType, Schema } from "../types.js"
import { z } from "zod"
import { getZodSchema } from "./base.js"

/**
 * Get a schema for a oneOf constraint.
 */
export const getOneOfZodSchema = (
  schemas: readonly Schema[],
): z.ZodType<JSONType, z.ZodTypeDef, unknown> => {
  if (schemas.length == 0) {
    return z.never()
  } else if (schemas.length == 1) {
    return getZodSchema(schemas[0])
  } else {
    return schemas.map((s) => getZodSchema(s)).reduce((zs, p) => p.or(zs))
  }
}
