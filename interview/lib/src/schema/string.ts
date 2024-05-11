import { Schema } from "./types.js"
import { z } from "zod"
import * as EmailValidator from "email-validator"
import psl from "psl"

export const getStringValidator = (schema: Schema): z.ZodType<string> => {
  let strSchema = z.string()
  if (schema.minLength != null) {
    strSchema = strSchema.min(
      schema.minLength,
      `Must be at least ${schema.minLength} characters`,
    )
  }
  if (schema.maxLength != null) {
    strSchema = strSchema.max(
      schema.maxLength,
      `Must be at most ${schema.maxLength} characters`,
    )
  }
  if (schema.pattern != null) {
    strSchema = strSchema.regex(new RegExp(schema.pattern), "Invalid value")
  }

  let res: z.ZodType<string> = strSchema

  if (schema.format == "date") {
    const dateFormat = handleDateFormat(schema)
    res = res.pipe(dateFormat)
  } else if (schema.format == "email") {
    res = res.pipe(handleEmailFormat(schema))
  }

  return res
}

const handleDateFormat = (schema: Schema): z.ZodType<string> => {
  let v = z
    .string()
    .transform(parseDate)
    .refine((v) => !isNaN(v.getTime()), "Invalid date")

  let dv = z.date()

  const minDate = schema["x-minDate"]
    ? parseDate(schema["x-minDate"])
    : undefined
  const maxDate = schema["x-maxDate"]
    ? parseDate(schema["x-maxDate"])
    : undefined
  if (minDate && !isNaN(minDate.getTime())) {
    dv = dv.min(minDate, `Must be on or after ${minDate.toLocaleDateString()}`)
  }
  if (maxDate && !isNaN(maxDate.getTime())) {
    dv = dv.max(maxDate, `Must be on or before ${maxDate.toLocaleDateString()}`)
  }

  return v
    .pipe(dv)
    .transform((v) => v.toISOString().substring(0, 10))
    .pipe(z.string())
}

const parseDate = (s: string): Date => {
  return new Date(s.substring(0, 10) + "T00:00:00")
}

const handleEmailFormat = (schema: Schema): z.ZodType<string> => {
  return z.string().refine(validateEmail, "Invalid email")
}

const validateEmail = (email: string): boolean => {
  if (!EmailValidator.validate(email)) {
    return false
  }
  const parts = email.split("@")
  const domain = parts[parts.length - 1]
  return psl.isValid(domain)
}
