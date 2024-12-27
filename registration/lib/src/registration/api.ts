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

      if (options?.cart_id) {
        args.cart_id = options.cart_id
      }

      return await wretch
        .url(`/events/${eventId}/registrations`)
        .addon(queryStringAddon)
        .query(args)
        .get()
        .json()
    },
    async readRegistration(eventId, id, cartId) {
      return await wretch
        .url(`/events/${eventId}/registrations/${id}`)
        .addon(queryStringAddon)
        .query({ cart_id: cartId })
        .get()
        .json()
    },
    async completeRegistration(eventId, id, cartId) {
      return await wretch
        .url(`/events/${eventId}/registrations/${id}/complete`)
        .addon(queryStringAddon)
        .query({ cart_id: cartId })
        .put()
        .json()
    },
    async cancelRegistration(eventId, id, cartId) {
      return await wretch
        .url(`/events/${eventId}/registrations/${id}/cancel`)
        .addon(queryStringAddon)
        .query({ cart_id: cartId })
        .put()
        .json()
    },
  }
}
