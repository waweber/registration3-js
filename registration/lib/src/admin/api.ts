import { AdminAPI } from "#src/admin/types.js"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"

export const makeAdminAPI = (wretch: Wretch): AdminAPI => {
  return {
    async readOverview(eventId, checkedIn, since) {
      const opts: Record<string, string> = {}

      if (checkedIn) {
        opts.checked_in = "true"
      }

      if (since) {
        opts.since = since.toISOString()
      }

      return await wretch
        .url(`/events/${eventId}/overview`)
        .addon(queryStringAddon)
        .query(opts)
        .get()
        .json()
    },
    async listEvents() {
      return await wretch.url("/events").get().json()
    },
    async startInterview(url: string) {
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
  }
}
