import { getSchemaValidator } from "./base.js"

test("oneOf checks", () => {
  const validator = getSchemaValidator({
    oneOf: [{ const: "a" }, { const: "b" }, { type: "null" }],
  })

  let res = validator("b")
  expect(res.success).toBe(true)

  res = validator("c")
  expect(res.success).toBe(false)

  res = validator(null)
  expect(res.success).toBe(true)
})
