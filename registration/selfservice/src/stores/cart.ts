import {
  CartAPI,
  isNotFoundError,
} from "@open-event-systems/registration-common"
import { QueryClient } from "@tanstack/react-query"
import { makeAutoObservable } from "mobx"

const COOKIE_PREFIX = "oes-current-cart-"

export class CurrentCartStore {
  static async setup(
    eventId: string,
    cartAPI: CartAPI,
    queryClient: QueryClient,
  ): Promise<CurrentCartStore> {
    const curId = getIdFromCookie(eventId)
    const cur = await fetchCurrentOrEmpty(eventId, curId, cartAPI, queryClient)
    return new CurrentCartStore(eventId, cur.id)
  }

  constructor(
    private eventId: string,
    private _currentCartId: string,
  ) {
    makeAutoObservable(this)
  }

  get currentCartId(): string {
    return this._currentCartId
  }

  set currentCartId(cartId: string) {
    const cookieName = `${COOKIE_PREFIX}${this.eventId}`
    document.cookie = `${cookieName}=${cartId}; max-age=86400`
    this._currentCartId = cartId
  }
}

const getIdFromCookie = (eventId: string) => {
  const cookieName = `${COOKIE_PREFIX}${eventId}`
  const items = document.cookie.split("; ")
  const entry = items.find((it) => it.startsWith(`${cookieName}=`))
  if (!entry) {
    return null
  }
  return entry.substring(cookieName.length + 1)
}

const fetchCurrentOrEmpty = async (
  eventId: string,
  cartId: string | null | undefined,
  cartAPI: CartAPI,
  queryClient: QueryClient,
) => {
  if (cartId) {
    try {
      await queryClient.ensureQueryData({
        queryKey: ["carts", cartId, "pricing-result"],
        async queryFn() {
          return await cartAPI.readCartPricingResult(cartId)
        },
        staleTime: 600000,
      })
      return { id: cartId }
    } catch (e) {
      if (!isNotFoundError(e)) {
        throw e
      }
    }
  }

  return await fetchEmptyCart(eventId, cartAPI, queryClient)
}

const fetchEmptyCart = async (
  eventId: string,
  cartAPI: CartAPI,
  queryClient: QueryClient,
) => {
  return await queryClient.ensureQueryData({
    queryKey: ["carts", { id: "empty", eventId: eventId }],
    async queryFn() {
      return await cartAPI.readEmptyCart(eventId)
    },
    staleTime: 3600000,
  })
}
