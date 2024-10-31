import { CartAPI } from "#src/cart/types.js"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"

export const makeCartAPI = (wretch: Wretch): CartAPI => {
  return {
    async readCart(cartId) {
      return await wretch.url(`/carts/${cartId}`).get().json()
    },
    async readCartPricingResult(cartId) {
      return await wretch.url(`/carts/${cartId}/pricing-result`).get().json()
    },
    async readEmptyCart(eventId) {
      return await wretch
        .url(`/carts/empty`)
        .addon(queryStringAddon)
        .query({ event_id: eventId })
        .get()
        .json()
    },
    async removeRegistrationFromCart(cartId, registrationId) {
      return await wretch
        .url(`/carts/${cartId}/registrations/${registrationId}`)
        .delete()
        .json()
    },
  }
}
