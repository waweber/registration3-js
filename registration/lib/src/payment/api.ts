import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"
import { PaymentAPI } from "#src/payment/types.js"

export const makePaymentAPI = (wretch: Wretch): PaymentAPI => {
  return {
    async getPaymentMethods(cartId) {
      return await wretch.url(`/carts/${cartId}/payment-methods`).get().json()
    },
    async createPayment(cartId, method) {
      return await wretch
        .url(`/carts/${cartId}/create-payment`)
        .addon(queryStringAddon)
        .query({ method: method })
        .post()
        .json()
    },
    async updatePayment(paymentId, body) {
      return await wretch
        .url(`/payments/${paymentId}/update`)
        .json(body)
        .post()
        .json()
    },
    async cancelPayment(paymentId) {
      return await wretch.url(`/payments/${paymentId}/cancel`).put().json()
    },
    async listPayments(eventId, options) {
      const args: Record<string, string> = {
        event_id: eventId,
      }

      if (options?.registrationId) {
        args.registration_id = options.registrationId
      }

      if (options?.q) {
        args.q = options.q
      }

      if (options?.suspended) {
        args.suspended = "true"
      }

      return await wretch
        .url(`/payments`)
        .addon(queryStringAddon)
        .query(args)
        .get()
        .json()
    },
  }
}
