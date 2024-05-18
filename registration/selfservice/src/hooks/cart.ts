import {
  CartAPI,
  CartPricingResult,
} from "@open-event-systems/registration-common"
import { useContext } from "react"
import { CartAPIContext } from "../providers/cart.js"
import { CurrentCartStore } from "../stores/cart.js"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useInterviewAPI } from "./interview.js"

export const useCartAPI = (): CartAPI => {
  const api = useContext(CartAPIContext)
  if (!api) {
    throw new Error("Cart API not provided")
  }
  return api
}

export const useCurrentCart = (eventId: string): CurrentCartStore => {
  const api = useCartAPI()
  const queryClient = useQueryClient()
  const res = useSuspenseQuery({
    queryKey: ["carts", "_current-cart", eventId],
    async queryFn() {
      return await CurrentCartStore.setup(eventId, api, queryClient)
    },
  })

  return res.data
}

export const useCart = (cartId: string): CartPricingResult => {
  const api = useCartAPI()
  const res = useSuspenseQuery({
    queryKey: ["carts", cartId, "pricing-result"],
    async queryFn() {
      return await api.readCartPricingResult(cartId)
    },
    staleTime: 600000,
  })
  return res.data
}

export const useCartInterview = (
  eventId: string,
  cartId: string,
  interviewId: string,
  stateId?: string,
) => {
  const api = useCartAPI()
  const [interviewAPI, interviewStore] = useInterviewAPI()

  const query = useSuspenseQuery({
    queryKey: [
      "self-service",
      "events",
      eventId,
      "cart",
      cartId,
      "interview",
      { interviewId, stateId },
    ],
    async queryFn() {
      if (!stateId) {
        const initial = await api.startInterview(eventId, cartId, interviewId)
        const initialResponse = await interviewAPI.update(initial)
        interviewStore.add(initialResponse)
        return initialResponse
      }
      return null
    },
  })

  return query.data
}
