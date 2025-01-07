import { SelfServiceAPI } from "#src/selfservice/types.js"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"

export const makeSelfServiceAPI = (wretch: Wretch): SelfServiceAPI => {
  return {
    async listEvents() {
      return await wretch.url("/self-service/events").get().json()
    },
    async listRegistrations(eventId, cartId, accessCode) {
      return await wretch
        .url(`/self-service/events/${eventId}/registrations`)
        .addon(queryStringAddon)
        .query({ cart_id: cartId, access_code: accessCode })
        .get()
        .json()
    },
    async startInterview(url) {
      return await wretch.url(url, true).get().json()
    },
    async completeInterview(response) {
      const res = await wretch
        .url(response.target, true)
        .json({ state: response.state })
        .post()
        .res()
      if (res.status == 204) {
        return null
      } else {
        return await res.json()
      }
    },
    async checkAccessCode(eventId, accessCode) {
      const res = await wretch
        .url(`/events/${eventId}/access-codes/${accessCode}/check`)
        .get()
        .notFound(() => null)
        .res()
      return !!res && res.status == 204
    },
  }
}
