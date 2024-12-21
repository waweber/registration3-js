import { Schema } from "../types.js"
import { getSchemaValidator } from "./base.js"

const schema = {
  type: "string",
  minLength: 2,
  maxLength: 6,
  pattern: "^[a-f]+$",
} satisfies Schema<"string">

const emailSchema = {
  type: "string",
  format: "email",
} satisfies Schema<"string">

const dateSchema = {
  type: "string",
  format: "date",
  "x-minDate": "2000-01-01",
  "x-maxDate": "2010-01-01",
} satisfies Schema<"string">

const optionalSchema = {
  type: ["string", "null"],
} satisfies Schema<"string">

describe("string validation", () => {
  test.each([
    ["ab", true],
    ["abcd", true],
    ["abcdef", true],
    ["  abcdef  ", true],
    ["a", false],
    ["abcdefa", false],
    ["abg", false],
  ])("%s = %s", (value: unknown, valid: boolean) => {
    const validator = getSchemaValidator(schema)
    const result = validator(value)
    expect(result.success).toBe(valid)
  })
})

describe("email validation", () => {
  test.each([
    ["test@example.net", true],
    ["  test@example.net  ", true],
    ["test @example.net", false],
    ["invalid", false],
    ["@invalid.net", false],
    ["test@invalid.not", false],
  ])("%s = %s", (value: unknown, valid: boolean) => {
    const validator = getSchemaValidator(emailSchema)
    const result = validator(value)
    expect(result.success).toBe(valid)
  })
})

describe("email validation", () => {
  test.each([
    ["test@example.net", true],
    ["  test@example.net  ", true],
    ["test @example.net", false],
    ["invalid", false],
    ["@invalid.net", false],
    ["test@invalid.not", false],
  ])("%s = %s", (value: unknown, valid: boolean) => {
    const validator = getSchemaValidator(emailSchema)
    const result = validator(value)
    expect(result.success).toBe(valid)
  })
})

describe("date validation", () => {
  test.each([
    ["2000-01-01", true],
    ["2010-01-01", true],
    ["2004-02-29", true],
    ["2010-01-02", false],
    ["1999-12-31", false],
    ["2001-00-02", false],
    ["0000-00-00", false],
    ["bad", false],
    ["0000", false],
    ["--", false],
    ["", false],
    ["2005-02-29", false],
    ["2010-1-1", true],
  ])("%s = %s", (value: unknown, valid: boolean) => {
    const validator = getSchemaValidator(dateSchema)
    const result = validator(value)
    expect(result.success).toBe(valid)
  })

  test("proper date parsing output", () => {
    const validator = getSchemaValidator(dateSchema)
    const result = validator("2010-1-1")
    expect(result.success).toBe(true)
    expect(result.data).toBe("2010-01-01")
  })
})

describe("empty string coercion", () => {
  test("strings trimmed", () => {
    const validator = getSchemaValidator(optionalSchema)
    const result = validator(" test ")
    expect(result.success).toBe(true)
    expect(result.data).toBe("test")
  })

  test("empty string becomes null", () => {
    const validator = getSchemaValidator(optionalSchema)
    const result = validator("  ")
    expect(result.success).toBe(true)
    expect(result.data).toBe(null)
  })
})
