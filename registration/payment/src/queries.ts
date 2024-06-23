import { UseQueryOptions } from "@tanstack/react-query"
import { PaymentAPI, PaymentMethod } from "./types.js"

export const getPaymentQueryOptions = (paymentAPI: PaymentAPI) => ({
  paymentMethods: (cartId: string): UseQueryOptions<PaymentMethod[]> => ({
    queryKey: ["carts", cartId, "payment-methods"],
    async queryFn() {
      return await paymentAPI.getPaymentMethods(cartId)
    },
    staleTime: 600000,
  }),
})
