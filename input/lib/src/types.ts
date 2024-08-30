import { z } from "zod"

type JSONScalar = number | boolean | string | null
export type JSONType =
  | JSONScalar
  | JSONType[]
  | { [key: string]: JSONType | undefined }

export type SchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object"
  | "null"

export type SchemaBase = Readonly<{
  title?: string
  description?: string
  "x-type"?: string
  "x-inputMode"?: string
  "x-autoComplete"?: string
  "x-component"?: string
  "x-primary"?: boolean
  default?: JSONType
}>

export type TextFormatType = "date" | "email"

export type SchemaTypeProps<T extends SchemaType = SchemaType> = Readonly<{
  type?: T | readonly SchemaType[]
}>

export type StringSchemaProps = Readonly<{
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: TextFormatType
  "x-minDate"?: string
  "x-maxDate"?: string
}>

export type NumberSchemaProps = Readonly<{
  minimum?: number
  maximum?: number
}>

export type ArraySchemaProps = Readonly<{
  minItems?: number
  maxItems?: number
  items?: Schema
  uniqueItems?: boolean
}>

export type ObjectSchemaProps = Readonly<{
  properties?: { readonly [prop: string]: Schema }
  required?: readonly string[]
}>

export type ConstSchemaProps = Readonly<{
  const?: JSONType
}>

export type OneOfSchemaProps = Readonly<{
  oneOf?: readonly Schema[]
}>

export type Schema<T extends SchemaType = SchemaType> = {
  readonly [prop: string]: JSONType | undefined
} & SchemaTypeProps<T> &
  SchemaBase &
  StringSchemaProps &
  NumberSchemaProps &
  ArraySchemaProps &
  ObjectSchemaProps &
  ConstSchemaProps &
  OneOfSchemaProps

export type Validator = (
  values: unknown,
) => z.SafeParseReturnType<JSONType, JSONType>
