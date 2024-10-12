import { Schema, SchemaType } from "./types.js"

/**
 * Get whether the schema is of a given type.
 */
export const isType = <
  T extends SchemaType,
  S extends { type?: SchemaType | readonly SchemaType[] } = Schema,
>(
  schema: S,
  type: T,
): schema is S & { type: T | readonly SchemaType[] } => {
  return (
    (Array.isArray(schema.type) && schema.type.includes(type)) ||
    schema.type == type
  )
}
