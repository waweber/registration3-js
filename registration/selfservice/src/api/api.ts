import { Wretch } from "wretch"
import { SelfServiceAPI } from "./types.js"
import { queryStringAddon } from "wretch/addons"

export const makeSelfServiceAPI = (wretch: Wretch): SelfServiceAPI => {
  return {
    async listEvents() {
      return await wretch.url("/self-service/events").get().json()
    },
    async listRegistrations(eventId) {
      return await wretch
        .url(`/self-service/events/${eventId}/registrations`)
        .get()
        .json()
    },
    async startInterview(eventId, cartId, interviewId) {
      return await wretch
        .url(`/self-service/events/${eventId}/interviews/${interviewId}`)
        .addon(queryStringAddon)
        .query({
          cart_id: cartId,
        })
        .get()
        .json()
    },
  }
}
