import {
  CartConflictError,
  CartConflictResult,
  CartPricingResult,
} from "#src/cart/types.js"
import { isResponseError } from "#src/utils.js"

export class PaymentError extends Error {}

export const handleConflict = (
  e: unknown,
  pricingResult: CartPricingResult,
) => {
  if (!isResponseError(e) || e.status != 409) {
    throw e
  }

  const errorResp = e.json as CartConflictError

  return errorResp.results.map((r) =>
    formatErrorForRegistration(r, pricingResult),
  )
}

export const formatErrorForRegistration = (
  result: CartConflictResult,
  pricingResult: CartPricingResult,
) => {
  const reg = pricingResult.registrations.find((r) => r.id == result.change.id)
  const name = reg?.name ?? ""

  if (result.errors.includes("version")) {
    return `The registration for ${name} has changed. Please remove it and make your changes again.`
  } else {
    return `The registration for ${name} cannot be included in this cart.`
  }
}
