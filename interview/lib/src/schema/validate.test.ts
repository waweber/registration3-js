import { Schema } from "./types.js"
import { getValidator } from "./validate.js"

describe("string validators", () => {
  const schema: Schema = {
    type: "string",
    minLength: 2,
    maxLength: 4,
    pattern: "^[a-z]+$",
  }

  const emailSchema: Schema = {
    type: "string",
    format: "email",
  }

  test.each([
    ["ab", true],
    ["abcd", true],
    ["a", false],
    ["abcde", false],
    ["abc0", false],
    [123, false],
    [null, false],
  ])("input %s = %s", (input, success) => {
    const v = getValidator(schema)
    const res = v(input)
    expect(res.success).toBe(success)
  })

  test.each([
    ["test@test.com", true],
    ["test@test.co", true],
    ["testtest.com", false],
    [".com", false],
    ["test@com", false],
    ["test@gmail.con", false],
  ])("input %s = %s", (input, success) => {
    const v = getValidator(emailSchema)
    const res = v(input)
    expect(res.success).toBe(success)
  })
})

describe("date validators", () => {
  const schema: Schema = {
    type: "string",
    format: "date",
    "x-minDate": "2020-01-01",
    "x-maxDate": "2020-02-01",
  }

  test.each([
    ["2020-01-15", true],
    ["2020-01-01", true],
    ["2020-02-01", true],
    ["2020-03-01", false],
    ["2019-12-31", false],
    ["0000-00-00", false],
    ["invalid", false],
  ])("input %s = %s", (input, success) => {
    const v = getValidator(schema)
    const res = v(input)
    expect(res.success).toBe(success)
  })
})

test("empty string is coerced to null", () => {
  const schema: Schema = {
    type: ["string", "null"],
  }

  const v = getValidator(schema)
  const res = v("")
  expect(res.success).toBe(true)
  if (res.success) {
    expect(res.value).toBeNull()
  }
})

describe("strings are trimmed", () => {
  const schema: Schema = {
    type: ["string"],
  }

  const v = getValidator(schema)

  test.each([
    ["  space   ", "space"],
    ["   ", ""],
  ])("input '%s' = '%s'", (input, expected) => {
    const res = v(input)
    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.value).toBe(expected)
    }
  })
})

test("empty trimmed strings coerce to null", () => {
  const schema: Schema = {
    type: ["string", "null"],
  }

  const v = getValidator(schema)
  const res = v("    ")
  expect(res.success).toBe(true)
  if (res.success) {
    expect(res.value).toBeNull()
  }
})

describe("number validators", () => {
  const schema: Schema = {
    type: "number",
    minimum: 1.0,
    maximum: 5.5,
  }

  const intSchema: Schema = {
    type: "integer",
    minimum: 1,
    maximum: 5,
  }

  test.each([
    ["", false],
    [1.0, true],
    [5.5, true],
    [5.6, false],
    [0.0, false],
  ])("input = %s, valid = %s", (input, expected) => {
    const v = getValidator(schema)
    const res = v(input)
    expect(res.success).toBe(expected)
  })

  test.each([
    ["", false],
    [1, true],
    [5, true],
    [0, false],
    [6, false],
    [2.5, false],
  ])("input = %s, valid = %s", (input, expected) => {
    const v = getValidator(intSchema)
    const res = v(input)
    expect(res.success).toBe(expected)
  })
})

describe("object validators", () => {
  const schema: Schema = {
    type: "object",
    properties: {
      a: {
        type: "string",
      },
      b: {
        type: ["string", "null"],
      },
      c: {
        type: "string",
      },
    },
    required: ["b", "c"],
  }

  test.each([
    [null, false],
    ["", false],
    ["bad", false],
    [[], false],
    [{}, false],
    [{ a: "a", b: "b", c: "1" }, true],
    [{ a: "a", b: null, c: "1" }, true],
    [{ b: "b", c: "1" }, true],
    [{ a: 1, b: "b", c: "1" }, false],
    [{ a: 1, c: "1" }, false],
  ])("input = %s, valid = %s", (input, expected) => {
    const v = getValidator(schema)
    const res = v(input)
    expect(res.success).toBe(expected)
  })
})

describe("array validators", () => {
  const schema: Schema = {
    type: "array",
    items: {
      type: ["string", "number"],
    },
    minItems: 1,
    maxItems: 2,
  }

  test.each([
    [null, false],
    ["", false],
    ["bad", false],
    [{}, false],
    [[], false],
    [["a", "b"], true],
    [["a", 1], true],
    [["a", 1, 2], false],
    [["a", true], false],
  ])("input = %s, valid = %s", (input, expected) => {
    const v = getValidator(schema)
    const res = v(input)
    expect(res.success).toBe(expected)
  })
})

describe("nested validation errors", () => {
  const schema: Schema = {
    type: "object",
    properties: {
      a: {
        type: "string",
      },
      b: {
        type: ["string", "null"],
        minLength: 2,
      },
      c: {
        type: "string",
      },
    },
    required: ["b", "c"],
  }

  const v = getValidator(schema)

  test("nests errors", () => {
    const res = v({ a: "a", b: "b" })
    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res).toStrictEqual({
        success: false,
        errors: [],
        children: {
          b: {
            errors: ["Must be at least 2 characters"],
          },
          c: {
            errors: ["Required"],
          },
        },
      })
    }
  })
})
