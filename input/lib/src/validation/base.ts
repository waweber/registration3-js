import { z } from "zod"
import { JSONType, Schema, Validator } from "../types.js"
import { isType } from "../schema.js"
import { getTypeValidator } from "./type.js"
import { getStringZodSchema } from "./string.js"
import { getNumberZodSchema } from "./number.js"
import { getArrayZodSchema } from "./array.js"
import { getObjectZodSchema } from "./object.js"
import { getOneOfZodSchema } from "./oneof.js"
import { getConstZodSchema } from "./const.js"

export const jsonScalarZodSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
])

export const jsonZodSchema: z.ZodType<JSONType> = z.lazy(() =>
  z.union([
    jsonScalarZodSchema,
    z.record(jsonZodSchema),
    z.array(jsonZodSchema),
  ]),
)

/**
 * Get a validator function for a schema.
 */
export function getSchemaValidator(
  schema: Schema<"object">,
): Validator<Record<string, JSONType>>
export function getSchemaValidator(
  schema: Schema<"array">,
): Validator<JSONType[]>
export function getSchemaValidator(schema: Schema): Validator
export function getSchemaValidator(schema: Schema): Validator {
  const zs = getZodSchema(schema)

  return (value) => zs.safeParse(value)
}

/**
 * Get a schema's initial value.
 */
export function getInitialValue(
  schema: Schema<"object">,
): Record<string, JSONType>
export function getInitialValue(schema: Schema<"array">): JSONType[]
export function getInitialValue(schema: Schema): JSONType
export function getInitialValue(schema: Schema): JSONType {
  if (schema.default !== undefined) {
    return schema.default
  } else if (isType(schema, "null")) {
    return null
  } else if (isType(schema, "array")) {
    return []
  } else if (isType(schema, "object")) {
    const record: Record<string, JSONType> = {}
    const props = schema.properties ?? {}
    const required = schema.required ?? []
    for (const prop of Object.keys(props)) {
      if (required.includes(prop) || props[prop].default !== undefined) {
        record[prop] = getInitialValue(props[prop])
      }
    }
    return record
  } else if (isType(schema, "boolean")) {
    return false
  } else if (isType(schema, "number") || isType(schema, "integer")) {
    return 0
  } else if (isType(schema, "string")) {
    return ""
  } else {
    return null
  }
}

/**
 * Get a zod schema to validate a JSON schema.
 */
export function getZodSchema(
  schema: Schema<"object">,
): z.ZodType<Record<string, JSONType>, z.ZodTypeDef, unknown>
export function getZodSchema(
  schema: Schema<"array">,
): z.ZodType<JSONType[], z.ZodTypeDef, unknown>
export function getZodSchema(
  schema: Schema,
): z.ZodType<JSONType, z.ZodTypeDef, unknown>
export function getZodSchema(
  schema: Schema,
): z.ZodType<JSONType, z.ZodTypeDef, unknown> {
  let zs: z.ZodType<JSONType, z.ZodTypeDef, unknown> = jsonZodSchema

  zs = zs.superRefine(getTypeValidator(schema))

  const strSchema = getStringZodSchema(schema)
  const numSchema = getNumberZodSchema(schema)
  const boolSchema = z.boolean()
  const arrSchema = getArrayZodSchema(schema)
  const objSchema = getObjectZodSchema(schema)

  zs = zs.transform((v, ctx) => {
    if (typeof v == "string") {
      return validateSubSchema(strSchema, v, ctx)
    } else if (typeof v == "number") {
      return validateSubSchema(numSchema, v, ctx)
    } else if (typeof v == "boolean") {
      return validateSubSchema(boolSchema, v, ctx)
    } else if (Array.isArray(v)) {
      return validateSubSchema(arrSchema, v, ctx)
    } else if (typeof v == "object" && v !== null) {
      return validateSubSchema(objSchema, v, ctx)
    } else {
      return v
    }
  })

  if (schema.const !== undefined) {
    zs = zs.and(getConstZodSchema(schema.const))
  }

  if (schema.oneOf) {
    zs = zs.and(getOneOfZodSchema(schema.oneOf))
  }

  return withPreprocess(zs, schema)
}

const validateSubSchema = <T, D extends z.ZodTypeDef, I>(
  zs: z.ZodType<T, D, I>,
  v: T,
  ctx: z.RefinementCtx,
): T => {
  const res = zs.safeParse(v)

  if (res.error) {
    res.error.issues.forEach((err) => ctx.addIssue(err))
    return v
  } else {
    return res.data
  }
}

const withPreprocess = (
  zs: z.ZodType<JSONType, z.ZodTypeDef, unknown>,
  schema: Schema,
): z.ZodType<JSONType, z.ZodTypeDef, unknown> => {
  const trimStrings = (v: unknown) => (typeof v == "string" ? v.trim() : v)
  const strToNull = (v: unknown) =>
    v === "" && isType(schema, "null") ? null : v
  const strToNum = (v: unknown) => {
    if (
      typeof v == "string" &&
      v &&
      (isType(schema, "number") || isType(schema, "integer"))
    ) {
      const n = parseFloat(v.trim())
      if (!isNaN(n)) {
        return n
      }
    }
    return v
  }
  const stripUndefProps = (v: unknown) => {
    if (!v || typeof v != "object" || Array.isArray(v)) {
      return v
    }

    const newObj: Record<string, unknown> = {}
    for (const key of Object.keys(v)) {
      const val = (v as Record<string, unknown>)[key]
      if (val !== undefined) {
        newObj[key] = val
      }
    }

    return newObj
  }

  return [strToNum, stripUndefProps, strToNull, trimStrings].reduce(
    (p, c) => z.preprocess(c, p),
    zs,
  )
}
