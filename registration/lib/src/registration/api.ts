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

      if (options?.before) {
        args.before_date = options.before[0]
        args.before_id = options.before[1]
      }

      return await wretch
        .url(`/events/${eventId}/registrations`)
        .addon(queryStringAddon)
        .query(args)
        .get()
        .json()
    },
    async listRegistrationsByCheckInId(eventId) {
      return await wretch
        .url(`/events/${eventId}/registrations/by-check-in-id`)
        .get()
        .json()
    },
    async readRegistration(eventId, id) {
      return await wretch
        .url(`/events/${eventId}/registrations/${id}`)
        .get()
        .json()
    },
  }
}
