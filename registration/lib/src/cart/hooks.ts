import { CartAPIContext, CurrentCartStoreContext } from "#src/cart/providers.js"
import {
  getCurrentCartQueryOptions,
  getPricingResultQueryOptions,
} from "#src/cart/queries.js"
import {
  Cart,
  CartAPI,
  CartPricingResult,
  CurrentCartStore,
} from "#src/cart/types.js"
import { useRequiredContext } from "#src/utils.js"
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useCallback, useContext, useRef } from "react"

export const useStickyCurrentCart = (
  eventId: string,
): [Cart, (cart: Cart | null, sticky?: boolean) => void] => {
  const cartRef = useRef<Cart | null>(null)

  const [currentCart, setCart] = useCurrentCart(eventId)

  if (!cartRef.current) {
    cartRef.current = currentCart
  }

  const stickySet = useCallback(
    (cart: Cart | null, sticky?: boolean) => {
      setCart(cart)
      if (sticky) {
        cartRef.current = cart
      }
    },
    [setCart],
  )

  return [cartRef.current, stickySet]
}

export const useCurrentCart = (
  eventId: string,
): [Cart, (cart: Cart | null) => void] => {
  const cartAPI = useCartAPI()
  const cartStore = useCurrentCartStore()
  const queryClient = useQueryClient()
  const opts = getCurrentCartQueryOptions(
    cartAPI,
    cartStore,
    queryClient,
    eventId,
  )
  const res = useSuspenseQuery(opts)
  const mutate = useMutation({
    mutationKey: ["self-service", "carts", "current", { eventId }],
    async mutationFn(cartId: string | null) {
      if (cartId) {
        return { id: cartId }
      } else {
        return await cartAPI.readEmptyCart(eventId)
      }
    },
    onSuccess(data) {
      queryClient.setQueryData(opts.queryKey, data)
      cartStore.set(eventId, data.id)
    },
  })

  const setCurrentCart = useCallback(
    (cart: Cart | null) => {
      mutate.mutate(cart?.id ?? null)
    },
    [mutate.mutate],
  )

  return [res.data, setCurrentCart]
}

export const useRemoveFromCart = (
  cartId: string,
): UseMutationResult<Cart, Error, string> => {
  const cartAPI = useCartAPI()
  return useMutation({
    mutationKey: ["carts", cartId, "registrations"],
    async mutationFn(registrationId: string) {
      return await cartAPI.removeRegistrationFromCart(cartId, registrationId)
    },
  })
}

export const useCartPricingResult = (cartId: string): CartPricingResult => {
  const cartAPI = useCartAPI()
  const opts = getPricingResultQueryOptions(cartAPI, cartId)
  const query = useSuspenseQuery(opts)
  return query.data
}

export const useCartAPI = (): CartAPI => useRequiredContext(CartAPIContext)
export const useCurrentCartStore = (): CurrentCartStore =>
  useContext(CurrentCartStoreContext)
