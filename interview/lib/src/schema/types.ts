export type TextFormatType = "date" | "email"

export type SchemaTypes =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object"
  | "null"

export type Schema = Readonly<{
  type?: SchemaTypes | readonly SchemaTypes[]
  title?: string
  description?: string
  "x-type"?: string
  "x-inputMode"?: string
  "x-autoComplete"?: string
  "x-component"?: string
  const?: unknown
  oneOf?: readonly Schema[]
  default?: unknown
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: TextFormatType
  "x-minDate"?: string
  "x-maxDate"?: string
  minimum?: number
  maximum?: number
  minItems?: number
  maxItems?: number
  items?: Schema
  uniqueItems?: boolean
  properties?: { readonly [prop: string]: Schema }
  required?: readonly string[]
  "x-primary"?: boolean
}>

export type ValidationError = Readonly<{
  errors: readonly string[]
  children?:
    | readonly ValidationError[]
    | { readonly [prop: string]: ValidationError }
}>

export type ValidationResult =
  | {
      success: true
      value: unknown
    }
  | ({ success: false } & ValidationError)

export type Validator = (value: unknown) => ValidationResult
