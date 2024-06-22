import {
  Cart,
  CartPricingResult,
  catchNotFound,
} from "@open-event-systems/registration-common"
import { UseQueryOptions } from "@tanstack/react-query"
import { currentCartStore } from "./store.js"
import {
  InterviewAPI,
  InterviewResponseRecord,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { AppContextValue } from "../appContext.js"
import { SelfServiceAPI } from "../api/types.js"

const defaultUpdateURL = "http://localhost:8000/update-interview" // TODO

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
        defaultUpdateURL,
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
    update_url: updateUrl,
  })
  return store.add(resp)
}
