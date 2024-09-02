import { z } from "zod"
import { JSONType, Schema, Validator } from "../types.js"
import { isType } from "../schema.js"
import { getStringZodSchema } from "./string.js"
import { getNumberZodSchema } from "./number.js"
import { getArrayZodSchema } from "./array.js"
import { getObjectZodSchema } from "./object.js"

export const jsonScalarZodSchema = z.union([
  z.number(),
  z.boolean(),
  z.string(),
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
export const getSchemaValidator = (schema: Schema): Validator => {
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
 * Get a Zod schema for a JSON schema.
 */
export const getZodSchema = (schema: Schema): z.ZodType<JSONType> => {
  let zs = jsonZodSchema

  zs = zs.superRefine((v, ctx) => typeValidator(schema, v, ctx))

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

  if (schema.oneOf != null) {
    zs = zs.and(getOneOfZodSchema(schema.oneOf))
  }

  return withPreprocess(zs, schema)
}

/**
 * Validator for the type constraint.
 */
export const typeValidator = (
  schema: Schema,
  v: unknown,
  ctx: z.RefinementCtx,
): void => {
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

/**
 * Get a schema that validates a const property.
 */
export const getConstZodSchema = (
  constValue: JSONType,
): z.ZodType<JSONType> => {
  return jsonZodSchema.superRefine((v, ctx) => {
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
}

/**
 * Get a schema for a oneOf constraint.
 */
export const getOneOfZodSchema = (
  schemas: readonly Schema[],
): z.ZodType<JSONType> => {
  if (schemas.length == 0) {
    return z.never()
  } else if (schemas.length == 1) {
    return getZodSchema(schemas[0])
  } else {
    return schemas.map((s) => getZodSchema(s)).reduce((zs, p) => p.or(zs))
  }
}

const withPreprocess = (
  zs: z.ZodType<JSONType>,
  s: Schema,
): z.ZodType<JSONType> => {
  const strToNull = z.preprocess(
    (v) => (v === "" && isType(s, "null") ? null : v),
    zs,
  )
  const stripStr = z.preprocess(
    (v) => (typeof v == "string" ? v.trim() : v),
    strToNull,
  )
  const coerced = jsonZodSchema.pipe(stripStr)
  return coerced
}

const validateSubSchema = <T>(
  zs: z.ZodType<T>,
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
