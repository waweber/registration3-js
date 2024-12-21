import { Config } from "#src/types.js"
import { CartPricingResult } from "@open-event-systems/registration-lib/cart"

export type Receipt = {
  date_closed: string
  pricing_result: CartPricingResult
}

/**
 * Fetch a receipt from the server.
 * @param config - The config object.
 * @param receiptId - The receipt ID.
 * @returns A pricing result, or null if not found.
 */
export const fetchReceipt = async (
  config: Config,
  receiptId: string,
): Promise<Receipt | null> => {
  const url = `${config.apiURL}/receipts/${receiptId}`
  const res = await fetch(url)
  if (res.ok) {
    return await res.json()
  } else {
    return null
  }
}
