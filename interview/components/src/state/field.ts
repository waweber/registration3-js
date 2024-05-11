import {
  Schema,
  ValidationError,
  getValidator,
} from "@open-event-systems/interview-lib"
import { FieldState } from "./types.js"
import { observable, computed, action, IObservableValue } from "mobx"

/**
 * Create a {@link FieldState}.
 */
export const makeFieldState = <T>(
  schema: Schema,
  getValidationError?: () => ValidationError | null,
): FieldState<T> => {
  let root: IObservableValue<FieldState<unknown> | null> | null = null
  if (!getValidationError) {
    // create the root
    const validator = getValidator(schema)
    root = observable.box(null)
    const curError = computed(() => {
      const cur = root?.get()
      if (cur == null) {
        return null
      }

      const result = validator(cur.validationValue)
      if (result.success) {
        return null
      } else {
        return result
      }
    })

    getValidationError = () => curError.get()
  }

  const state = {
    schema: schema,
    value: null as T | null,
    get error() {
      if (this.validationError) {
        return this.validationError.errors[0]
      }
      return null
    },
    get validationValue() {
      if (typeof this.value == "object" && this.value != null) {
        const childObj: Record<string, unknown> = {}
        const valueObj = this.value as Record<string, FieldState<unknown>>
        for (const prop of Object.keys(this.value)) {
          childObj[prop] = valueObj[prop].validationValue
        }
        return childObj as T
      } else {
        return this.value
      }
    },
    get validationError() {
      return getValidationError()
    },
    touched: false,
    setValue(v: T | null) {
      this.value = v
    },
    setTouched() {
      this.touched = true
    },
    getChildValidationError(key: string | number) {
      const err = this.validationError
      if (!err) {
        return null
      }

      const children = err.children ?? {}
      let childObj

      if (Array.isArray(children) && typeof key == "number") {
        childObj = children[key]
      } else if (!Array.isArray(children) && typeof key == "string") {
        childObj = children[key]
      }

      return childObj ?? null
    },
  }
  const observableState = observable(state, {
    setValue: action,
    setTouched: action,
  })
  if (root) {
    root.set(observableState)
  }
  return observableState
}
