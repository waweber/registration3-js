import { UseQueryOptions } from "@tanstack/react-query"
import { Event, RegistrationListResponse, SelfServiceAPI } from "./types.js"

export const getSelfServiceQueryOptions = (api: SelfServiceAPI) => ({
  events: {
    queryKey: ["self-service", "events"],
    async queryFn() {
      const events = await api.listEvents()
      return new Map(events.map((e) => [e.id, e]))
    },
    staleTime: Infinity,
  } as UseQueryOptions<Map<string, Event>>,
  registrations: (
    eventId: string,
    accessCode?: string | null,
  ): UseQueryOptions<RegistrationListResponse> => ({
    queryKey: [
      "self-service",
      "events",
      eventId,
      "registrations",
      { accessCode: accessCode || null },
    ],
    async queryFn() {
      return await api.listRegistrations(eventId, accessCode)
    },
  }),
  accessCodeCheck: (
    eventId: string,
    accessCode: string,
  ): UseQueryOptions<boolean> => ({
    queryKey: ["events", eventId, "access-codes", accessCode, "check"],
    async queryFn() {
      return await api.checkAccessCode(eventId, accessCode)
    },
  }),
})
