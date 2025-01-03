import config from "#src/config.js"
import { Context, createContext, useContext } from "react"

export class NotFoundError extends Error {
  isNotFound = true as const
  constructor(message = "Not found") {
    super(message)
  }
}

/**
 * Check if an object is a "not found" error.
 */
export const isNotFound = (obj: unknown): obj is NotFoundError => {
  // TODO: include other types
  return isNotFoundError(obj) || (isResponseError(obj) && obj.status == 404)
}

export const isNotFoundError = (obj: unknown): obj is NotFoundError => {
  return (
    typeof obj == "object" &&
    obj != null &&
    "isNotFound" in obj &&
    obj.isNotFound == true
  )
}

export type ErrorResponseJson = {
  status?: number
  description?: string
  message?: string
  [key: string]: unknown
}

/**
 * Check if an object is an error response.
 */
export const isResponseError = (
  obj: unknown,
): obj is Error & { status: number; json?: ErrorResponseJson } => {
  return (
    typeof obj == "object" &&
    obj != null &&
    "name" in obj &&
    "message" in obj &&
    "status" in obj
  )
}

/**
 * Get an error message from an error.
 */
export const getErrorMessage = (e: unknown): string => {
  let message
  if (isResponseError(e)) {
    if (e.json && "message" in e.json) {
      message = e.json.message
    } else if (e.name) {
      message = e.name
    }
  }

  if (!message && typeof e == "object" && e && "message" in e) {
    message = e.message as string
  }

  return message || String(e)
}

/**
 * Wrap a promise to return null if it throws a not found error.
 */
export const catchNotFound = async <T>(
  promise: Promise<T>,
): Promise<T | null> => {
  try {
    return await promise
  } catch (e) {
    if (isNotFound(e)) {
      return null
    }
    throw e
  }
}

/**
 * createContext that allows omitting the value.
 */
export const createOptionalContext = <T>(
  value: T | null = null,
): Context<T | null> => {
  return createContext(value)
}

/**
 * useContext that throws an error if the context is null.
 */
export const useRequiredContext = <T>(ctx: Context<T | null>): T => {
  const val = useContext(ctx)
  if (val == null) {
    throw new Error("Required context not provided")
  }
  return val
}

export const getDefaultUpdateURL = () => {
  return `${config.apiURL}/update-interview`
}
