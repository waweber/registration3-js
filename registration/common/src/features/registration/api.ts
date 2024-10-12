import {
  Registration,
  RegistrationAPI,
} from "#src/features/registration/types.js"
import { Wretch } from "wretch"
import { queryStringAddon } from "wretch/addons"

export const createRegistrationAPI = (wretch: Wretch): RegistrationAPI => {
  return {
    async list(eventId, search, includeAll = false, before) {
      const args: Record<string, string> = {}

      if (search) {
        args.q = search
      }

      if (includeAll) {
        args.include_all = "true"
      }

      if (before) {
        args.before = before
      }

      return await wretch
        .url(`/events/${eventId}/registrations`)
        .addon(queryStringAddon)
        .query(args)
        .get()
        .json<Registration[]>()
    },
    async read(eventId, id) {
      const res = await wretch
        .url(`/events/${eventId}/registrations/${id}`)
        .get()
        .res()

      const etag = res.headers.get("ETag") ?? ""
      const body = await res.json()
      return [body, etag]
    },
    async update(registration, etag) {
      const res = await wretch
        .url(
          `/events/${registration.event_id}/registrations/${registration.id}`,
        )
        .headers({
          "If-Match": etag,
        })
        .json(registration)
        .put()
        .res()

      const newEtag = res.headers.get("ETag") ?? ""
      const body = await res.json()
      return [body, newEtag]
    },
    async complete(eventId, id) {
      const res = await wretch
        .url(`/events/${eventId}/registrations/${id}/complete`)
        .put()
        .res()

      const newEtag = res.headers.get("ETag") ?? ""
      const body = await res.json()
      return [body, newEtag]
    },
    async cancel(eventId, id) {
      const res = await wretch
        .url(`/events/${eventId}/registrations/${id}/cancel`)
        .put()
        .res()

      const newEtag = res.headers.get("ETag") ?? ""
      const body = await res.json()
      return [body, newEtag]
    },
  }
}
