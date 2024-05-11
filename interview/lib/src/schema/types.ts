export type TextFormatType = "date" | "email"

export type SchemaTypes =
  | "string"
  | "number"
  | "integer"
  | "array"
  | "object"
  | "null"

export type Schema = {
  type?: SchemaTypes | SchemaTypes[]
  title?: string
  description?: string
  "x-type"?: string
  "x-inputMode"?: string
  "x-autoComplete"?: string
  "x-component"?: string
  const?: unknown
  oneOf?: Schema[]
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
  properties?: Record<string, Schema>
  required?: string[]
}

export type ValidationError = {
  errors: string[]
  children?: ValidationError[] | Record<string, ValidationError>
}

export type ValidationResult =
  | {
      success: true
      value: unknown
    }
  | ({ success: false } & ValidationError)

export type Validator = (value: unknown) => ValidationResult
