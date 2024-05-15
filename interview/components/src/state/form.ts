import {
  Schema,
  ValidationError,
  getValidator,
} from "@open-event-systems/interview-lib"
import { FormState, NestedValue, Path } from "./types.js"
import { makeAutoObservable, observable } from "mobx"

/**
 * Create a {@link FormState}.
 * @param schema - the schema
 * @param initialValue - the initial value
 */
export const makeFormState = (
  schema: Schema,
  initialValue?: NestedValue,
): FormState => {
  const validator = getValidator(schema)
  const state = {
    schema: schema,
    value: getInitialValue(schema, initialValue),
    touched: false,
    get validationResult() {
      return validator(this.value)
    },
    get validationError() {
      if (this.validationResult.success) {
        return null
      } else {
        return this.validationResult
      }
    },
    getValue(path) {
      return getPath(this.value, path)
    },
    setValue(path, value) {
      setPath(this, "value", path, value)
    },
    getTouched(path) {
      const res = getPath(this.touched, path)
      if (isObject(res)) {
        return Array.from(Object.keys(res)).some((k) =>
          this.getTouched([...path, k]),
        )
      } else if (Array.isArray(res)) {
        return res.some((_, i) => this.getTouched([...path, i]))
      } else {
        return res || false
      }
    },
    setTouched(path) {
      setPath(this, "touched", path, true)
    },
    getError(path) {
      const err = getError(this.validationError, path)
      return err ? err.errors[0] || null : null
    },
  } satisfies FormState

  return makeAutoObservable(state, {
    value: observable.deep,
    touched: observable.deep,
  })
}

const getInitialValue = (
  schema: Schema,
  initialValue?: NestedValue | undefined,
): NestedValue | undefined => {
  if (initialValue !== undefined) {
    return initialValue
  }

  if (schema.default !== undefined) {
    return schema.default as NestedValue
  }

  if (schema.properties) {
    const defaultObj: NestedValue = {}
    for (const key of Object.keys(schema.properties)) {
      const propDefault = getInitialValue(schema.properties[key])
      if (propDefault !== undefined) {
        defaultObj[key] = propDefault
      }
    }
    return defaultObj
  }
}

const getPath = <T>(
  root: NestedValue<T> | undefined,
  path: Path,
): NestedValue<T> | undefined => {
  let cur = root
  for (const p of path) {
    if (cur == null || typeof cur != "object") {
      return cur
    }

    cur = getItem(cur, p)
  }
  return cur
}

const getError = (
  root: ValidationError | null,
  path: Path,
): ValidationError | null => {
  let cur = root
  for (const p of path) {
    if (cur == null) {
      return null
    }

    if (isObject(cur.children) && typeof p == "string") {
      cur = cur.children[p]
    } else if (Array.isArray(cur.children) && typeof p == "number") {
      cur = cur.children[p]
    } else {
      cur = null
    }
  }
  return cur ?? null
}

const setPath = <T, K extends string>(
  root: Record<K, NestedValue<T>>,
  rootKey: K,
  path: Path,
  value: NestedValue<T>,
) => {
  let cur: NestedValue<T> = root

  const fullPath = [rootKey, ...path]
  const lastKey = fullPath[fullPath.length - 1]

  for (let i = 0; i < fullPath.length - 1; i++) {
    const curKey = fullPath[i]
    const nextKey = fullPath[i + 1]
    let child: NestedValue<T> | undefined = getItem(cur, curKey)
    if (child == null || (typeof child != "object" && !Array.isArray(child))) {
      if (typeof nextKey == "string") {
        child = observable({})
      } else {
        child = observable([])
      }
      setItem(cur, curKey, child)
    }
    cur = child
  }

  if (isObject(cur) && typeof lastKey == "string") {
    cur[lastKey] = value
  } else if (Array.isArray(cur) && typeof lastKey == "number") {
    cur[lastKey] = value
  }
}

const getItem = <T>(
  obj: NestedValue<T>,
  key: string | number,
): NestedValue<T> | undefined => {
  if (isObject(obj) && typeof key == "string") {
    return obj[key]
  } else if (Array.isArray(obj) && typeof key == "number") {
    return obj[key]
  }
}

const setItem = <T>(
  obj: NestedValue<T>,
  key: string | number,
  value: NestedValue<T>,
) => {
  if (isObject(obj) && typeof key == "string") {
    obj[key] = value
  } else if (Array.isArray(obj) && typeof key == "number") {
    obj[key] = value
  }
}

const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj == "object" && obj != null
}
