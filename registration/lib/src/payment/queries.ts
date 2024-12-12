import {
  PaymentAPI,
  PaymentMethod,
  PaymentSearchResult,
} from "#src/payment/types.js"
import { UseSuspenseQueryOptions } from "@tanstack/react-query"

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
      return await paymentAPI.listPayments(eventId, registrationId)
    },
  }
}
