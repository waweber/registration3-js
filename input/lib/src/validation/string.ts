import { Schema, StringSchemaProps } from "../types.js"
import { z } from "zod"
import { isAfter, isBefore, parseISO, parse, format } from "date-fns"

import * as EmailValidator from "email-validator"
import psl from "psl"

export const getStringZodSchema = (
  schema: StringSchemaProps,
): z.ZodType<string> => {
  let zs = z.string()

  if (schema.minLength != null) {
    zs = zs.min(
      schema.minLength,
      schema.minLength > 1
        ? `Must be at least ${schema.minLength} characters`
        : "Required",
    )
  }

  if (schema.maxLength != null) {
    zs = zs.max(
      schema.maxLength,
      `Must be at most ${schema.maxLength} characters`,
    )
  }

  if (schema.pattern) {
    const regexp = new RegExp(schema.pattern)
    zs = zs.regex(regexp, "Invalid value")
  }

  let ze: z.ZodType<string> = zs

  if (schema.format == "email") {
    ze = ze.superRefine((v, ctx) => {
      if (!validateEmail(v)) {
        ctx.addIssue({
          code: "invalid_string",
          validation: "email",
          message: "Invalid email",
        })
      }
    })
  } else if (schema.format == "date") {
    ze = ze.transform(getDateValidator(schema))
  }

  return ze
}

const validateEmail = (email: string): boolean => {
  if (!EmailValidator.validate(email)) {
    return false
  }
  const parts = email.split("@")
  const domain = parts[parts.length - 1]
  return psl.isValid(domain)
}

const getDateValidator = (
  schema: Schema<"string">,
): ((dateStr: string, ctx: z.RefinementCtx) => string) => {
  const minDateParsed = schema["x-minDate"]
    ? parseISO(schema["x-minDate"])
    : undefined
  const minDate =
    minDateParsed && !isNaN(minDateParsed.getTime()) ? minDateParsed : undefined
  const maxDateParsed = schema["x-maxDate"]
    ? parseISO(schema["x-maxDate"])
    : undefined
  const maxDate =
    maxDateParsed && !isNaN(maxDateParsed.getTime()) ? maxDateParsed : undefined

  return (dateStr, ctx) => {
    if (dateStr === "") {
      ctx.addIssue({
        code: "invalid_date",
        message: "Required",
      })
      return dateStr
    }

    const parsed = parse(dateStr, "yyyy-MM-dd", new Date())
    if (isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Invalid date",
      })
      return dateStr
    }

    if (minDate && isBefore(parsed, minDate)) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Choose a later date",
      })
    }

    if (maxDate && isAfter(parsed, maxDate)) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Choose an earlier date",
      })
    }

    return format(parsed, "yyyy-MM-dd")
  }
}
