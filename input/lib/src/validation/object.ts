import { JSONType, ObjectSchemaProps } from "../types.js"
import { z } from "zod"
import { getZodSchema } from "./base.js"

export const getObjectZodSchema = (
  schema: ObjectSchemaProps,
): z.ZodType<Record<string, JSONType>, z.ZodTypeDef, unknown> => {
  const props = schema.properties ?? {}
  const required = schema.required ?? []
  const schemaRecords: Record<
    string,
    z.ZodType<JSONType, z.ZodTypeDef, unknown>
  > = {}
  const requiredObj: Record<string, true> = {}

  for (const prop of Object.keys(props)) {
    schemaRecords[prop] = getZodSchema(props[prop])
    if (required.includes(prop)) {
      requiredObj[prop] = true
    }
  }

  return z
    .object(schemaRecords, { required_error: "Required" })
    .partial()
    .required(requiredObj)
}
