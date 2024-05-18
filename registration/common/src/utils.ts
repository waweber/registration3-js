export class NotFoundError extends Error {
  isNotFound = true as const
}

export const isNotFoundError = (obj: unknown): obj is NotFoundError => {
  return (
    typeof obj == "object" &&
    obj != null &&
    "isNotFound" in obj &&
    obj.isNotFound == true
  )
}
