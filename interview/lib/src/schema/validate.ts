import { getArrayValidator } from "./array.js"
import { getNumberValidator } from "./number.js"
import { getObjectValidator } from "./object.js"
import { getStringValidator } from "./string.js"
import {
  Schema,
  SchemaTypes,
  ValidationError,
  ValidationResult,
  Validator,
} from "./types.js"
import { z } from "zod"

const jsonScalar = z.union([z.string(), z.number(), z.boolean(), z.null()])
type JsonType =
  | z.infer<typeof jsonScalar>
  | JsonType[]
  | { [key: string]: JsonType }
export const jsonSchema: z.ZodType<JsonType> = z.lazy(() =>
  z.union([jsonScalar, z.record(jsonSchema), z.array(jsonSchema)]),
)

export const getValidator = (schema: Schema): Validator => {
  const validationSchema = getValidationSchema(schema)

  const validate = (value: unknown): ValidationResult => {
    const result = validationSchema.safeParse(value, {})
    if (result.success) {
      return {
        success: true,
        value: result.data,
      }
    } else {
      const err = result.error.format()
      return {
        success: false,
        ...formatError(err),
      }
    }
  }

  return validate
}

const formatError = (err: z.ZodFormattedError<unknown>): ValidationError => {
  let children

  if (Array.isArray(err)) {
    children = err.map(formatError)
  } else {
    const errObj = err as z.ZodFormattedError<Record<string, unknown>>
    children = {} as Record<string, ValidationError>
    let added = false
    for (const key of Object.keys(err)) {
      if (key != "_errors") {
        const errVal = errObj[key]
        if (errVal != null) {
          children[key] = formatError(errVal)
          added = true
        }
      }
    }

    if (!added) {
      children = undefined
    }
  }

  let res: ValidationError = {
    errors: err._errors,
  }

  if (children) {
    res = { ...res, children }
  }

  return res
}

export const getValidationSchema = (schema: Schema): z.ZodType<unknown> => {
  let s = jsonSchema

  s = s.superRefine((v, ctx) => validateType(schema, v, ctx))

  const strSchema = getStringValidator(schema)
  const numberSchema = getNumberValidator(schema)
  const objectSchema = getObjectValidator(schema)
  const arraySchema = getArrayValidator(schema)

  s = s.superRefine((v, ctx) => {
    if (typeof v == "string") {
      validateSubSchema(strSchema, v, ctx)
    } else if (typeof v == "number") {
      validateSubSchema(numberSchema, v, ctx)
    } else if (Array.isArray(v)) {
      validateSubSchema(arraySchema, v, ctx)
    } else if (typeof v == "object" && v !== null) {
      validateSubSchema(objectSchema, v, ctx)
    }
  })

  s = schema.const != null ? s.and(getConstValidator(schema.const)) : s
  s = schema.oneOf ? s.and(getOneOfValidator(schema.oneOf)) : s

  const preprocessed = z.preprocess(
    (v, ctx) => {
      if (v === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: "Required",
        })
      }
      return v
    },
    z.preprocess(
      (v) => (typeof v == "string" ? v.trim() : v),
      z.preprocess(
        (v) => (v === "" && schema.type && isOfType(schema, "null") ? null : v),
        s,
      ),
    ),
  )

  return preprocessed
}

const validateType = (schema: Schema, v: unknown, ctx: z.RefinementCtx) => {
  if (!schema.type) {
    return
  } else if (v === null && !isOfType(schema, "null")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Required",
    })
  } else if (
    (typeof v == "number" &&
      !isOfType(schema, "number") &&
      !isOfType(schema, "integer")) ||
    (typeof v == "boolean" && !isOfType(schema, "boolean")) ||
    (typeof v == "string" && !isOfType(schema, "string")) ||
    (Array.isArray(v) && !isOfType(schema, "array")) ||
    (typeof v == "object" &&
      v !== null &&
      !Array.isArray(v) &&
      !isOfType(schema, "object"))
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid value",
    })
  }
}

const getConstValidator = (value: unknown): z.ZodType<unknown> => {
  return jsonSchema
    .refine((v) => v !== null || value === null, "Required")
    .refine((v) => v === null || v === value, "Invalid value")
}

const getOneOfValidator = (oneOf: readonly Schema[]): z.ZodType<unknown> => {
  const s: z.ZodType<unknown> = z.never()
  return oneOf.reduce((s, v) => s.or(getValidationSchema(v)), s)
}

const isOfType = (schema: Schema, type: SchemaTypes): boolean => {
  return (
    (Array.isArray(schema.type) && schema.type.includes(type)) ||
    schema.type == type
  )
}

const validateSubSchema = (
  zodSchema: z.ZodType<unknown>,
  v: unknown,
  ctx: z.RefinementCtx,
) => {
  const res = zodSchema.safeParse(v)
  if (res.error) {
    res.error.issues.forEach((i) => ctx.addIssue(i))
  }
}
