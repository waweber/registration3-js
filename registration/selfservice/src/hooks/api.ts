import { Event, RegistrationListResponse } from "../api/types.js"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound } from "@tanstack/react-router"
import { useApp } from "../appContext.js"
import { getSelfServiceQueryOptions } from "../api/queries.js"

export const useEvents = (): Map<string, Event> => {
  const { selfServiceAPI: api } = useApp()
  const query = useSuspenseQuery({
    queryKey: ["self-service", "events"],
    async queryFn() {
      const events = await api.listEvents()
      return new Map(events.map((e) => [e.id, e]))
    },
    staleTime: Infinity,
  })

  return query.data
}

export const useEvent = (eventId: string): Event => {
  const events = useEvents()
  const event = events.get(eventId)
  if (!event) {
    throw notFound()
  }
  return event
}

export const useRegistrations = (
  eventId: string,
  accessCode?: string | null,
): RegistrationListResponse => {
  const { selfServiceAPI: api } = useApp()
  const queries = getSelfServiceQueryOptions(api)
  const query = useSuspenseQuery({
    ...queries.registrations(eventId, accessCode),
  })
  return query.data
}

export const useAccessCodeCheck = (
  eventId: string,
  accessCode: string,
): boolean => {
  const { selfServiceAPI: api } = useApp()
  const query = useSuspenseQuery({
    queryKey: ["events", eventId, "access-codes", accessCode, "check"],
    async queryFn() {
      return await api.checkAccessCode(eventId, accessCode)
    },
  })
  return query.data
}
