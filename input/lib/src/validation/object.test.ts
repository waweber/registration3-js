import { Schema } from "../types.js"
import { getSchemaValidator } from "./base.js"

const schema = {
  type: "object",
  properties: {
    a: {
      type: "string",
    },
    b: {
      type: ["string", "null"],
    },
  },
  required: ["a"],
} satisfies Schema<"object">

describe("object validation", () => {
  test.each([
    [{ a: "1", b: "2" }, true],
    [{ a: "1", b: null }, true],
    [{ a: "1" }, true],
    [{ a: 0 }, false],
    [{}, false],
  ])("%p = %s", (value, valid) => {
    const validator = getSchemaValidator(schema)
    const res = validator(value)
    expect(res.success).toBe(valid)
  })
})
