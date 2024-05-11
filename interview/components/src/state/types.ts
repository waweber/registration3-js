import { Schema, ValidationError } from "@open-event-systems/interview-lib"

export type ScalarFieldValue = string | number | boolean | null
export type NestedValue<T = ScalarFieldValue> =
  | T
  | NestedValue<T>[]
  | { [key: string]: NestedValue<T> }

export type Path = (string | number)[]

export type FormState = {
  readonly schema: Schema
  get value(): NestedValue | undefined
  get touched(): NestedValue<boolean>
  get validationError(): ValidationError | null

  getValue(path: Path): NestedValue | undefined
  setValue(path: Path, value: NestedValue): void

  getTouched(path: Path): boolean
  setTouched(path: Path): void

  getError(path: Path): string | null
}
