import { Schema } from "./types.js"
import { z } from "zod"
import { getValidationSchema } from "./validate.js"

export const getObjectValidator = (
  schema: Schema,
): z.ZodType<Record<string, unknown>> => {
  const schemaObj: Record<string, z.ZodType<unknown>> = {}
  const requiredObj: Record<string, true> = {}
  const props = schema.properties ?? {}
  const required = schema.required ?? []

  for (const prop of Object.keys(props)) {
    const propSchema = getValidationSchema(props[prop])
    schemaObj[prop] = propSchema
    if (required.includes(prop)) {
      requiredObj[prop] = true
    }
  }

  return z
    .object(schemaObj, { required_error: "Required" })
    .partial()
    .required(requiredObj)
}
