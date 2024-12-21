import { Schema } from "../types.js"
import { getSchemaValidator } from "./base.js"

const schema = {
  type: "number",
  minimum: 1,
  maximum: 10,
} satisfies Schema<"number">

const intSchema = {
  type: "integer",
  minimum: 1,
  maximum: 10,
} satisfies Schema<"integer">

describe("number validation", () => {
  test.each([
    [1, true],
    [5.5, true],
    [10, true],
    [10.1, false],
    [0.9999, false],
    ["1", false],
  ])("%s = %s", (input, valid) => {
    const validator = getSchemaValidator(schema)
    const res = validator(input)
    expect(res.success).toBe(valid)
  })
})

describe("integer validation", () => {
  test.each([
    [1, true],
    [5.5, false],
    [10, true],
    [11, false],
    [0, false],
    ["1", false],
  ])("%s = %s", (input, valid) => {
    const validator = getSchemaValidator(intSchema)
    const res = validator(input)
    expect(res.success).toBe(valid)
  })
})
