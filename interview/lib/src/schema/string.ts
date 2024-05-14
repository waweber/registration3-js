import { Schema } from "./types.js"
import { z } from "zod"
import * as EmailValidator from "email-validator"
import psl from "psl"
import { parseISO } from "date-fns"

export const getStringValidator = (schema: Schema): z.ZodType<string> => {
  let strSchema = z.string()
  if (schema.minLength != null) {
    strSchema = strSchema.min(
      schema.minLength,
      schema.minLength == 1
        ? "Required"
        : `Must be at least ${schema.minLength} characters`,
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
    res = res.pipe(handleEmailFormat())
  }

  return res
}

const handleDateFormat = (schema: Schema): z.ZodType<string> => {
  const minDate = schema["x-minDate"]
    ? parseDate(schema["x-minDate"])
    : undefined
  const maxDate = schema["x-maxDate"]
    ? parseDate(schema["x-maxDate"])
    : undefined

  const minDateVal = minDate?.getTime()
  const maxDateVal = maxDate?.getTime()

  const v = z.string().superRefine((v, ctx) => {
    const asDate = parseDate(v)
    if (isNaN(asDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "Invalid date",
      })
    } else {
      if (
        minDateVal != null &&
        !isNaN(minDateVal) &&
        asDate.getTime() < minDateVal
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          inclusive: true,
          minimum: minDateVal,
          type: "date",
          message: `Must be on or after ${minDate?.toLocaleDateString()}`,
        })
      }

      if (
        maxDateVal != null &&
        !isNaN(maxDateVal) &&
        asDate.getTime() > maxDateVal
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          inclusive: true,
          maximum: maxDateVal,
          type: "date",
          message: `Must be on or before ${maxDate?.toLocaleDateString()}`,
        })
      }
    }

    return z.NEVER
  })

  return v
}

const parseDate = (s: string): Date => {
  return parseISO(s.substring(0, 10))
}

const handleEmailFormat = (): z.ZodType<string> => {
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
