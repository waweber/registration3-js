import { RegistrationAPI } from "#src/registration/types.js"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"

/**
 * Return a {@link RegistrationAPI}
 */
export const makeRegistrationAPI = (wretch: Wretch): RegistrationAPI => {
  return {
    async listRegistrations(eventId, query = "", options) {
      const args: Record<string, string> = {
        q: query,
      }

      if (options?.all) {
        args.all = "true"
      }

      if (options?.check_in_id != null) {
        args.check_in_id = options.check_in_id
      }

      if (options?.before) {
        args.before_date = options.before[0]
        args.before_id = options.before[1]
      }

      if (options?.summary) {
        args.summary = "true"
      }

      return await wretch
        .url(`/events/${eventId}/registrations`)
        .addon(queryStringAddon)
        .query(args)
        .get()
        .json()
    },
    async readRegistration(eventId, id) {
      return await wretch
        .url(`/events/${eventId}/registrations/${id}`)
        .get()
        .json()
    },
    async completeRegistration(eventId, id) {
      return await wretch
        .url(`/events/${eventId}/registrations/${id}/complete`)
        .put()
        .json()
    },
    async cancelRegistration(eventId, id) {
      return await wretch
        .url(`/events/${eventId}/registrations/${id}/cancel`)
        .put()
        .json()
    },
  }
}
