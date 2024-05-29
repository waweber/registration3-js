import { createContext, useContext } from "react"
import { PaymentAPI } from "./types.js"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"

export const PaymentAPIContext = createContext<PaymentAPI | null>(null)

export const usePaymentAPI = (): PaymentAPI => {
  const ctx = useContext(PaymentAPIContext)
  if (!ctx) {
    throw new Error("Payment API not provided")
  }
  return ctx
}

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
  }
}
