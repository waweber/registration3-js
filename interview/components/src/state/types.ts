import {
  Schema,
  ValidationError,
  ValidationResult,
} from "@open-event-systems/interview-lib"

export type FieldState<T> = {
  readonly schema: Schema
  readonly value: T | null | undefined
  readonly validationValue: T | null | undefined
  readonly touched: boolean
  readonly error: string | null
  setValue(v: T | null): void
  setTouched(): void
  getChildValidationError(key: string | number): ValidationError | null
}
