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
