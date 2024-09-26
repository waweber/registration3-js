import { getSchemaValidator } from "./base.js"

test("const checks", () => {
  const validator = getSchemaValidator({ const: "test" })

  let res = validator("test")
  expect(res.success).toBe(true)

  res = validator("test2")
  expect(res.success).toBe(false)
})
