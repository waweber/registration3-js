export const TextFormatTypes = {
  email: "email",
  date: "date",
} as const

export type TextFormatType = keyof typeof TextFormatTypes

export type Schema = SchemaCommon &
  (
    | StringSchema
    | NumberSchema
    | IntegerSchema
    | ArraySchema
    | ObjectSchema
    | NullSchema
    | ConstSchema
    | OneOfSchema
  )

export interface StringSchema {
  type: "string" | readonly "string"[]
  default?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: TextFormatType
  "x-minimum"?: string
  "x-maximum"?: string
}

export interface NumberSchema {
  type: "number" | readonly "number"[]
  default?: number
  minimum?: number
  maximum?: number
}

export interface IntegerSchema {
  type: "integer" | readonly "integer"[]
  default?: number
  minimum?: number
  maximum?: number
}

export interface ArraySchema {
  type: "array" | readonly "array"[]
  default?: readonly unknown[]
  minItems?: number
  maxItems?: number
  items?: Schema
  uniqueItems?: boolean
}

export interface ObjectSchema {
  type: "object" | readonly "object"[]
  properties?: Record<string, Schema>
  required?: readonly string[]
}

export interface NullSchema {
  type: "null" | readonly "null"[]
}

export interface ConstSchema {
  const: unknown
}

export interface OneOfSchema {
  oneOf: readonly Schema[]
}

export type SchemaCommon = {
  title?: string
  description?: string
  "x-type"?: string
  "x-input-mode"?: string
  "x-autocomplete"?: string
  "x-component"?: string
}
