import {
  Cart,
  CartAPI,
  CartPricingResult,
  catchNotFound,
} from "@open-event-systems/registration-common"
import { useCallback, useContext } from "react"
import { CartAPIContext } from "../providers/cart.js"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useInterviewAPI } from "@open-event-systems/interview-components"
import {
  InterviewAPI,
  InterviewResponseRecord,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { SelfServiceAPI } from "../api/types.js"
import { useSelfServiceAPI } from "./api.js"

const COOKIE_PREFIX = "oes-current-cart-"

export const useCartAPI = (): CartAPI => {
  const api = useContext(CartAPIContext)
  if (!api) {
    throw new Error("Cart API not provided")
  }
  return api
}

export const useCurrentCart = (
  eventId: string,
): [Cart, (cartId: string | null) => void] => {
  const api = useCartAPI()
  const queryClient = useQueryClient()

  const query = useSuspenseQuery({
    queryKey: ["self-service", "carts", "current", { eventId: eventId }],
    async queryFn() {
      let curId = getCurrentCartIdFromCookie(eventId)
      if (curId) {
        const cur = await catchNotFound(api.readCartPricingResult(curId))
        if (cur) {
          queryClient.setQueryData(["carts", curId, "pricing-result"], cur)
          return { id: curId }
        }
      }

      const empty = await api.readEmptyCart(eventId)
      setCurrentCartCookie(eventId, empty.id)
      return empty
    },
    staleTime: Infinity,
  })

  const setCart = useMutation({
    mutationKey: ["self-service", "carts", "current", { eventId: eventId }],
    async mutationFn({ cartId }: { cartId: string | null }) {
      if (cartId) {
        setCurrentCartCookie(eventId, cartId)
        return { id: cartId }
      } else {
        const empty = await queryClient.ensureQueryData({
          queryKey: ["carts", "empty", { eventId: eventId }],
          async queryFn() {
            return await api.readEmptyCart(eventId)
          },
          staleTime: Infinity,
        })
        setCurrentCartCookie(eventId, cartId)
        return empty
      }
    },
    onSuccess(data) {
      queryClient.setQueryData(
        ["self-service", "carts", "current", { eventId: eventId }],
        data,
      )
    },
  })

  const setCartId = useCallback(
    (cartId: string | null) => {
      setCart.mutate({ cartId })
    },
    [eventId],
  )

  return [query.data, setCartId]
}

export const useCartPricingResult = (cartId: string): CartPricingResult => {
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

export const useCartInterviewRecord = (
  eventId: string,
  cartId: string,
  interviewId: string,
  updateUrl: string,
  registrationId?: string | null,
  stateId?: string | null,
): InterviewResponseRecord => {
  const api = useSelfServiceAPI()
  const [interviewAPI, interviewStore] = useInterviewAPI()

  const query = useSuspenseQuery({
    queryKey: [
      "self-service",
      "events",
      eventId,
      "carts",
      cartId,
      "interview",
      { interviewId, registrationId, stateId },
    ],
    queryFn() {
      if (stateId) {
        let record = interviewStore.get(stateId)
        if (record) {
          return record
        }

        return fetchInterviewResponse(
          interviewAPI,
          interviewStore,
          updateUrl,
          stateId,
        )
      }

      return startInterview(
        api,
        interviewAPI,
        interviewStore,
        eventId,
        cartId,
        interviewId,
        registrationId,
      )
    },
  })

  return query.data
}

const startInterview = async (
  selfServiceAPI: SelfServiceAPI,
  interviewAPI: InterviewAPI,
  store: InterviewResponseStore,
  eventId: string,
  cartId: string,
  interviewId: string,
  registrationId?: string | null,
) => {
  const initial = await selfServiceAPI.startInterview(
    eventId,
    cartId,
    interviewId,
    registrationId,
  )
  const initialResp = await interviewAPI.update(initial)
  return store.add(initialResp)
}

const fetchInterviewResponse = async (
  api: InterviewAPI,
  store: InterviewResponseStore,
  updateUrl: string,
  state: string,
) => {
  const resp = await api.update({
    completed: false,
    state: state,
    update_url: updateUrl,
  })
  return store.add(resp)
}

const getCurrentCartIdFromCookie = (eventId: string) => {
  const cookieName = `${COOKIE_PREFIX}${eventId}`
  const items = document.cookie.split("; ")
  const entry = items.find((it) => it.startsWith(`${cookieName}=`))
  if (!entry) {
    return null
  }
  return entry.substring(cookieName.length + 1)
}

const setCurrentCartCookie = (eventId: string, cartId: string | null) => {
  const cookieName = `${COOKIE_PREFIX}${eventId}`
  if (cartId) {
    document.cookie = `${cookieName}=${cartId}; path=/; SameSite=strict; max-age=86400`
  } else {
    document.cookie = `${cookieName}=; path=/; SameSite=strict; max-age=0`
  }
}
