import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useRef } from "react"
import { getCartQueryOptions } from "./api.js"
import { currentCartStore } from "./stores.js"
import { Cart, CartPricingResult } from "#src/features/cart"
import { useApp } from "#src/hooks/app"

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
  const appCtx = useApp()
  const { queryClient, cartAPI } = appCtx
  const queries = useMemo(() => getCartQueryOptions(appCtx), [appCtx])

  const currentCartOpts = useMemo(
    () => queries.currentCart(eventId),
    [queries, eventId],
  )
  const currentCartQuery = useSuspenseQuery(currentCartOpts)
  const mutateCurrentCart = useMutation({
    mutationKey: currentCartOpts.queryKey,
    async mutationFn(cartId: string | null) {
      if (cartId) {
        return { id: cartId }
      } else {
        return await cartAPI.readEmptyCart(eventId)
      }
    },
    onSuccess(data) {
      queryClient.setQueryData(currentCartOpts.queryKey, data)
      currentCartStore.setCurrentCartId(eventId, data.id)
    },
  })
  const setCurrentCart = useCallback(
    (cart: Cart | null) => {
      mutateCurrentCart.mutate(cart?.id || null)
    },
    [mutateCurrentCart.mutate],
  )

  return [currentCartQuery.data, setCurrentCart]
}

export const useCartPricingResult = (cartId: string): CartPricingResult => {
  const appCtx = useApp()
  const queries = useMemo(() => getCartQueryOptions(appCtx), [appCtx])
  const opts = useMemo(
    () => queries.cartPricingResult(cartId),
    [appCtx, cartId],
  )
  const query = useSuspenseQuery(opts)
  return query.data
}
