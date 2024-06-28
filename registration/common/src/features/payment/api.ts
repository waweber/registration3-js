import { createContext, useContext } from "react"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"
import { CartAPI } from "#src/features/cart/index.js"
import { NotFoundError } from "#src/utils.js"
import {
  PaymentAPI,
  PaymentError,
  PaymentMethod,
  PaymentResult,
} from "#src/features/payment/index.js"

import { UseQueryOptions } from "@tanstack/react-query"

export const getPaymentQueryOptions = (paymentAPI: PaymentAPI) => ({
  paymentMethods: (cartId: string): UseQueryOptions<PaymentMethod[]> => ({
    queryKey: ["carts", cartId, "payment-methods"],
    async queryFn() {
      return await paymentAPI.getPaymentMethods(cartId)
    },
    staleTime: 600000,
  }),
})

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

const delay = (n: number) => new Promise((r) => window.setTimeout(r, n))

export const makeMockPaymentAPI = (cartAPI: CartAPI): PaymentAPI => {
  let id = 1
  const payments = new Map<string, PaymentResult<"mock">>()
  return {
    async getPaymentMethods() {
      await delay(200)
      return [{ id: "mock", name: "Mock" }]
    },
    async createPayment(cartId): Promise<PaymentResult<"mock">> {
      const pricingResult = await cartAPI.readCartPricingResult(cartId)
      const total = (pricingResult.total_price / 100).toFixed(2)
      await delay(300)
      const curId = `${id++}`
      const payment: PaymentResult<"mock"> = {
        id: curId,
        service: "mock",
        status: "pending",
        body: {
          currency: pricingResult.currency,
          total_price: pricingResult.total_price,
          total_price_string: total,
        },
      }
      payments.set(payment.id, payment)
      return payment
    },
    async updatePayment(paymentId, body): Promise<PaymentResult<"mock">> {
      await delay(400)
      const payment = payments.get(paymentId)
      if (!payment) {
        throw new NotFoundError()
      }

      if (
        typeof body.card_number != "string" ||
        !/^[0-9-]+$/.test(body.card_number)
      ) {
        throw new PaymentError("Invalid card")
      }

      if (payment.status == "pending") {
        payment.status = "completed"
      }
      return payment
    },
    async cancelPayment(paymentId) {
      const payment = payments.get(paymentId)
      if (!payment) {
        throw new NotFoundError()
      }
      if (payment.status == "pending") {
        payment.status = "canceled"
      }
      return payment
    },
  }
}
