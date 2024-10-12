import { Schema } from "../types.js"
import { getSchemaValidator } from "./base.js"

const schema = {
  type: "array",
  minItems: 1,
  maxItems: 2,
  uniqueItems: true,
} satisfies Schema<"array">

describe("array validation", () => {
  test.each([
    [["a"], true],
    [["a", "b"], true],
    [[], false],
    [["a", "b", "c"], false],
    ["ab", false],
    [["a", "a"], false],
  ])("%s = %s", (input, valid) => {
    const validator = getSchemaValidator(schema)
    const res = validator(input)
    expect(res.success).toBe(valid)
  })
})
