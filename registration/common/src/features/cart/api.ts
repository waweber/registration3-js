import { UseQueryOptions } from "@tanstack/react-query"
import {
  InterviewAPI,
  InterviewResponseRecord,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"
import {
  Cart,
  CartAPI,
  CartPricingResult,
  currentCartStore,
} from "#src/features/cart/index.js"
import { NotFoundError, catchNotFound } from "#src/utils.js"
import { SelfServiceAPI } from "#src/features/selfservice/index.js"
import { AppContextValue } from "#src/app/context.js"
import config from "#src/config.js"

export const getCartQueryOptions = ({
  queryClient,
  cartAPI: api,
  interviewAPI,
  interviewStore,
  selfServiceAPI,
}: AppContextValue) => ({
  currentCart: (eventId: string): UseQueryOptions<Cart> => ({
    queryKey: ["self-service", "carts", "current", { eventId: eventId }],
    async queryFn() {
      const curId = currentCartStore.getCurrentCartId(eventId)
      if (curId) {
        const cur = await catchNotFound(api.readCartPricingResult(curId))
        if (cur) {
          queryClient.setQueryData(["carts", curId, "pricing-result"], cur)
          return { id: curId }
        }
      }

      const empty = await api.readEmptyCart(eventId)
      currentCartStore.setCurrentCartId(eventId, empty.id)
      return empty
    },
    staleTime: Infinity,
  }),
  cartPricingResult: (cartId: string): UseQueryOptions<CartPricingResult> => ({
    queryKey: ["carts", cartId, "pricing-result"],
    async queryFn() {
      return await api.readCartPricingResult(cartId)
    },
    staleTime: 600000,
  }),
  interviewRecord: (
    stateId: string,
  ): UseQueryOptions<InterviewResponseRecord> => ({
    queryKey: ["interview", "state", stateId],
    async queryFn() {
      const curRecord = interviewStore.get(stateId)
      if (curRecord) {
        return curRecord
      }

      return fetchInterviewResponse(
        interviewAPI,
        interviewStore,
        getDefaultUpdateURL(),
        stateId,
      )
    },
    initialData() {
      const curRecord = interviewStore.get(stateId)
      if (curRecord) {
        return curRecord
      }
    },
    staleTime: Infinity,
  }),
  initialInterviewRecord: (
    eventId: string,
    cartId: string,
    interviewId: string,
    registrationId?: string | null,
    accessCode?: string | null,
  ): UseQueryOptions<InterviewResponseRecord> => ({
    queryKey: [
      "self-service",
      "events",
      eventId,
      "carts",
      cartId,
      "interview",
      { interviewId, registrationId, accessCode },
    ],
    async queryFn() {
      return startInterview(
        selfServiceAPI,
        interviewAPI,
        interviewStore,
        eventId,
        cartId,
        interviewId,
        registrationId,
        accessCode,
      )
    },
  }),
})

const startInterview = async (
  selfServiceAPI: SelfServiceAPI,
  interviewAPI: InterviewAPI,
  store: InterviewResponseStore,
  eventId: string,
  cartId: string,
  interviewId: string,
  registrationId?: string | null,
  accessCode?: string | null,
) => {
  const initial = await selfServiceAPI.startInterview(
    eventId,
    cartId,
    interviewId,
    registrationId,
    accessCode,
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
    target: updateUrl,
  })
  return store.add(resp)
}

export const makeCartAPI = (wretch: Wretch): CartAPI => {
  return {
    async readCart(cartId) {
      return await wretch.url(`/carts/${cartId}`).get().json()
    },
    async readCartPricingResult(cartId) {
      return await wretch.url(`/carts/${cartId}/pricing-result`).get().json()
    },
    async readEmptyCart(eventId) {
      return await wretch
        .url(`/carts/empty`)
        .addon(queryStringAddon)
        .query({ event_id: eventId })
        .get()
        .json()
    },
    async removeRegistrationFromCart(cartId, registrationId) {
      return await wretch
        .url(`/carts/${cartId}/registrations/${registrationId}`)
        .delete()
        .json()
    },
  }
}

const delay = (n: number) => new Promise((r) => window.setTimeout(r, n))

export const makeMockCartAPI = (): CartAPI => {
  let counter = 10
  const carts: Record<string, CartPricingResult> = {
    empty: {
      currency: "USD",
      registrations: [],
      total_price: 0,
    },
    "1": {
      currency: "USD",
      registrations: [
        {
          id: "1",
          name: "Registration 1",
          line_items: [
            {
              name: "Attendee Registration",
              description: "Standard attendee registration.",
              price: 5500,
              modifiers: [{ name: "Early Bird Discount", amount: -500 }],
              total_price: 5000,
            },
          ],
          total_price: 5000,
        },
      ],
      total_price: 5000,
    },
  }

  return {
    async readEmptyCart() {
      await delay(100)
      return {
        id: "empty",
      }
    },
    async readCart(cartId) {
      await delay(100)
      if (!(cartId in carts)) {
        throw new NotFoundError()
      }
      return { id: cartId }
    },
    async readCartPricingResult(cartId) {
      await delay(300)
      if (!(cartId in carts)) {
        throw new NotFoundError()
      }
      return carts[cartId]
    },
    async removeRegistrationFromCart(cartId, registrationId) {
      await delay(300)
      if (!(cartId in carts)) {
        throw new NotFoundError()
      }
      const cart = carts[cartId]
      const newCart = {
        ...cart,
        registrations: cart.registrations.filter((r) => r.id != registrationId),
      }
      const newId = `${counter++}`
      carts[newId] = newCart
      return { id: newId }
    },
  }
}

const getDefaultUpdateURL = () => {
  return `${config.apiURL}/update-interview`
}
