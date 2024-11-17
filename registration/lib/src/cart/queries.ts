import {
  Cart,
  CartAPI,
  CartPricingResult,
  CurrentCartStore,
} from "#src/cart/types.js"
import { catchNotFound } from "#src/utils.js"
import { QueryClient, UseSuspenseQueryOptions } from "@tanstack/react-query"

export const getCurrentCartQueryOptions = (
  cartAPI: CartAPI,
  currentCartStore: CurrentCartStore,
  queryClient: QueryClient,
  eventId: string,
): UseSuspenseQueryOptions<Cart> => {
  return {
    queryKey: ["self-service", "carts", "current", { eventId }],
    async queryFn() {
      const curId = currentCartStore.get(eventId)
      if (curId) {
        const cur = await catchNotFound(cartAPI.readCartPricingResult(curId))
        if (cur) {
          queryClient.setQueryData(["carts", curId, "pricing-result"], cur)
          return { id: curId }
        }
      }

      const empty = await cartAPI.readEmptyCart(eventId)
      currentCartStore.set(eventId, empty.id)
      return empty
    },
    staleTime: Infinity,
  }
}

export const getPricingResultQueryOptions = (
  cartAPI: CartAPI,
  cartId: string,
): UseSuspenseQueryOptions<CartPricingResult> => {
  return {
    queryKey: ["carts", cartId, "pricing-result"],
    async queryFn() {
      return await cartAPI.readCartPricingResult(cartId)
    },
    staleTime: 600000,
  }
}
