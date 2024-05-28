import { CartAPI, NotFoundError } from "@open-event-systems/registration-common"
import { PaymentAPI, PaymentResult } from "./types.js"
import { PaymentError } from "./error.js"

const delay = (n: number) => new Promise((r) => window.setTimeout(r, n))

export const makeMockPaymentAPI = (cartAPI: CartAPI): PaymentAPI => {
  let id = 1
  const payments = new Map<string, PaymentResult<"mock">>()
  return {
    async getPaymentMethods(cartId) {
      await delay(200)
      return [{ id: "mock", name: "Mock" }]
    },
    async createPayment(cartId, method): Promise<PaymentResult<"mock">> {
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
