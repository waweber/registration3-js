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
  let s: z.ZodType<unknown> = getNullValidator(schema)

  s = schema.type ? s.and(getTypeValidator(schema.type)) : s
  s = schema.const != null ? s.and(getConstValidator(schema.const)) : s
  s = schema.oneOf ? s.and(getOneOfValidator(schema.oneOf)) : s

  s = s.and(
    getStringValidator(schema).or(
      z.unknown().refine((v) => typeof v != "string"),
    ),
  )
  s = s.and(
    getArrayValidator(schema).or(z.unknown().refine((v) => !Array.isArray(v))),
  )
  s = s.and(
    getNumberValidator(schema).or(
      z.unknown().refine((v) => typeof v != "number"),
    ),
  )

  if (schema.properties) {
    s = s.and(
      getObjectValidator(schema).or(
        z.unknown().refine((v) => typeof v != "object" || v === null),
      ),
    )
  }

  const preprocessed = z.preprocess(
    (v) => (typeof v == "string" ? v.trim() : v),
    z.preprocess(
      (v) => (v === "" && schema.type && includesNull(schema.type) ? null : v),
      s,
    ),
  )

  return preprocessed
}

const getTypeValidator = (
  type: SchemaTypes | readonly SchemaTypes[],
): z.ZodType<unknown> => {
  const typesArr: readonly SchemaTypes[] = Array.isArray(type) ? type : [type]
  const tests = typesArr.map((t) => typeTests[t])
  return z
    .unknown()
    .refine((v) => v == null || tests.some((t) => t(v)), "Invalid value")
}

const getNullValidator = (schema: Schema): z.ZodType<unknown> => {
  return z
    .unknown()
    .refine(
      (v) => v != null || !schema.type || includesNull(schema.type),
      "Required",
    )
}

const includesNull = (t: SchemaTypes | readonly SchemaTypes[]) => {
  return (Array.isArray(t) && t.includes("null")) || t == "null"
}

const typeTests = {
  string: (v) => typeof v == "string",
  number: (v) => typeof v == "number",
  integer: (v) => typeof v == "number" && Number.isInteger(v),
  array: (v) => Array.isArray(v),
  object: (v) => typeof v == "object" && v !== null,
  null: (v) => v === null,
} satisfies { [K in SchemaTypes]: (v: unknown) => boolean }

const getConstValidator = (value: unknown): z.ZodType<unknown> => {
  return z.unknown().refine((v) => v == value, "Invalid value")
}

const getOneOfValidator = (oneOf: readonly Schema[]): z.ZodType<unknown> => {
  const s: z.ZodType<unknown> = z.never()
  return oneOf.reduce((s, v) => s.or(getValidationSchema(v)), s)
}
