import { Schema } from "../types.js"
import { getInitialValue, getSchemaValidator } from "./base.js"

describe("base validators", () => {
  test("type checks", () => {
    const validator = getSchemaValidator({
      type: "string",
    })
    let res = validator("x")
    expect(res.success).toBe(true)

    res = validator(1)
    expect(res.success).toBe(false)

    res = validator(null)
    expect(res.success).toBe(false)
  })

  test("nullable checks", () => {
    const validator = getSchemaValidator({
      type: ["string", "null"],
    })

    const res = validator(null)
    expect(res.success).toBe(true)
  })

  test("const checks", () => {
    const validator = getSchemaValidator({ const: "test" })

    let res = validator("test")
    expect(res.success).toBe(true)

    res = validator("test2")
    expect(res.success).toBe(false)
  })

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
})

const initValSchema = {
  type: "object",
  properties: {
    a: {
      type: "string",
    },
    b: {
      type: ["string", "null"],
    },
    c: {
      type: "integer",
    },
    d: {
      type: "number",
    },
    e: {
      type: "array",
    },
    f: {
      type: "string",
    },
  },
  required: ["a", "b", "c", "d", "e"],
} satisfies Schema<"object">

const defaultValSchema = {
  type: "object",
  properties: {
    a: {
      type: "string",
      default: "a",
    },
    b: {
      type: ["string", "null"],
      default: "b",
    },
    c: {
      type: "integer",
      default: 3,
    },
    d: {
      type: "number",
      default: 4,
    },
    e: {
      type: "array",
      default: ["x", "y"],
    },
    f: {
      type: "string",
      default: "z",
    },
  },
  required: ["a", "b", "c", "d", "e"],
} satisfies Schema<"object">

describe("initial values", () => {
  test("initial values are created", () => {
    const initials = getInitialValue(initValSchema)
    expect(initials).toStrictEqual({
      a: "",
      b: null,
      c: 0,
      d: 0,
      e: [],
    })
  })

  test("default values are used", () => {
    const initials = getInitialValue(defaultValSchema)
    expect(initials).toStrictEqual({
      a: "a",
      b: "b",
      c: 3,
      d: 4,
      e: ["x", "y"],
      f: "z",
    })
  })
})
