import { PaymentError } from "#src/payment/error.js"
import {
  PaymentAPI,
  PaymentRequestBody,
  PaymentResult,
  PaymentServiceID,
} from "#src/payment/types.js"
import { makeMockWithDelay } from "#src/utils.js"

declare module "#src/payment/types.js" {
  export interface PaymentServiceMap {
    mock: "mock"
  }
  export interface PaymentRequestBodyMap {
    mock: {
      card_number: string
    }
  }
  export interface PaymentResultBodyMap {
    mock: {
      currency: string
      total_price: number
    }
  }
}

export const makeMockPaymentAPI = (): PaymentAPI => {
  let counter = 1
  const mock: PaymentAPI = {
    async getPaymentMethods(_cartId) {
      return [
        {
          id: "mock",
          name: "Mock Card",
        },
      ]
    },
    async createPayment(_cartId, _method) {
      return {
        id: `${counter++}`,
        service: "mock",
        status: "pending",
        body: {},
      } as PaymentResult<"mock">
    },
    async updatePayment<S extends PaymentServiceID = PaymentServiceID>(
      paymentId: string,
      body: PaymentRequestBody<S>,
    ) {
      const mockBody = body as PaymentRequestBody<"mock">
      if (
        typeof mockBody.card_number != "string" ||
        !/^[0-9-]+$/.test(mockBody.card_number) ||
        parseInt(mockBody.card_number) <= 0
      ) {
        throw new PaymentError("Invalid card")
      }
      return {
        id: paymentId,
        service: "mock",
        status: "completed",
        body: {},
      } as PaymentResult<S>
    },
    async cancelPayment<S extends PaymentServiceID = PaymentServiceID>(
      paymentId: string,
    ) {
      return {
        id: paymentId,
        service: "mock",
        status: "canceled",
        body: {
          currency: "USD",
          total_price: 1000,
        },
      } as PaymentResult<S>
    },
  }

  return makeMockWithDelay(mock)
}
