import { PaymentAPI, PaymentMethod } from "#src/payment/types.js"
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
