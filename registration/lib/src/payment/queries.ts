import {
  PaymentAPI,
  PaymentMethod,
  PaymentSearchResult,
} from "#src/payment/types.js"
import { UseQueryOptions, UseSuspenseQueryOptions } from "@tanstack/react-query"

export const getPaymentMethodsQueryOptions = (
  paymentAPI: PaymentAPI,
  cartId: string,
): UseSuspenseQueryOptions<PaymentMethod[]> => {
  return {
    queryKey: ["carts", cartId, "payment-methods"],
    async queryFn() {
      return await paymentAPI.getPaymentMethods(cartId)
    },
    staleTime: 600000,
  }
}

export const getRegistrationPaymentsQueryOptions = (
  paymentAPI: PaymentAPI,
  eventId: string,
  registrationId: string,
): UseSuspenseQueryOptions<PaymentSearchResult[]> => {
  return {
    queryKey: ["payments", { eventId, registrationId }],
    async queryFn() {
      return await paymentAPI.listPayments(eventId, { registrationId })
    },
  }
}

export const getCartSearchQuery = (
  paymentAPI: PaymentAPI,
  eventId: string,
  query: string,
): UseQueryOptions<PaymentSearchResult[]> => {
  return {
    queryKey: ["payments", { eventId, suspended: true, query }],
    async queryFn() {
      if (!query) {
        return []
      }
      return await paymentAPI.listPayments(eventId, {
        suspended: true,
        q: query,
      })
    },
  }
}
