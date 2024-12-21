import {
  Event,
  RegistrationListResponse,
  SelfServiceAPI,
} from "#src/selfservice/types.js"
import { UseSuspenseQueryOptions } from "@tanstack/react-query"

export const getSelfServiceEventsQueryOptions = (
  selfServiceAPI: SelfServiceAPI,
): UseSuspenseQueryOptions<Map<string, Event>> => {
  return {
    queryKey: ["self-service", "events"],
    async queryFn() {
      const events = await selfServiceAPI.listEvents()
      return new Map(events.map((e) => [e.id, e]))
    },
    staleTime: Infinity,
  }
}

export const getSelfServiceRegistrationsQueryOptions = (
  selfServiceAPI: SelfServiceAPI,
  eventId: string,
  cartId: string,
  accessCode?: string | null,
): UseSuspenseQueryOptions<RegistrationListResponse> => {
  return {
    queryKey: [
      "self-service",
      "events",
      eventId,
      "registrations",
      { cartId, accessCode },
    ],
    async queryFn() {
      return await selfServiceAPI.listRegistrations(eventId, cartId, accessCode)
    },
  }
}

export const getSelfServiceAccessCodeCheckQueryOptions = (
  selfServiceAPI: SelfServiceAPI,
  eventId: string,
  accessCode: string,
): UseSuspenseQueryOptions<boolean> => {
  return {
    queryKey: ["events", eventId, "access-codes", accessCode, "check"],
    async queryFn() {
      return await selfServiceAPI.checkAccessCode(eventId, accessCode)
    },
  }
}
