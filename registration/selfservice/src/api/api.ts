import { Wretch, WretchResponse } from "wretch"
import { SelfServiceAPI } from "./types.js"
import { queryStringAddon } from "wretch/addons"

export const makeSelfServiceAPI = (wretch: Wretch): SelfServiceAPI => {
  return {
    async listEvents() {
      return await wretch.url("/self-service/events").get().json()
    },
    async listRegistrations(eventId, accessCode) {
      const query: Record<string, string> = {}
      if (accessCode) {
        query["access_code"] = accessCode
      }
      return await wretch
        .url(`/self-service/events/${eventId}/registrations`)
        .addon(queryStringAddon)
        .query(query)
        .get()
        .json()
    },
    async startInterview(
      eventId,
      cartId,
      interviewId,
      registrationId,
      accessCode,
    ) {
      const query: Record<string, string> = {
        cart_id: cartId,
      }

      if (registrationId) {
        query["registration_id"] = registrationId
      }

      if (accessCode) {
        query["access_code"] = accessCode
      }

      return await wretch
        .url(`/self-service/events/${eventId}/interviews/${interviewId}`)
        .addon(queryStringAddon)
        .query(query)
        .get()
        .json()
    },
    async completeInterview(state) {
      return await wretch
        .url(`/self-service/add-to-cart`)
        .json({ state: state })
        .post()
        .json()
    },
    async checkAccessCode(eventId, accessCode) {
      const res = await wretch
        .url(`/events/${eventId}/access-codes/${accessCode}/check`)
        .get()
        .notFound(() => false)
        .res<WretchResponse | false>()
      return res !== false
    },
  }
}
