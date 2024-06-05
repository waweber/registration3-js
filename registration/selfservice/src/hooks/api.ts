import { createContext, useContext } from "react"
import { makeMockSelfServiceAPI } from "../api/mock.js"
import {
  Event,
  RegistrationListResponse,
  SelfServiceAPI,
} from "../api/types.js"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound } from "@tanstack/react-router"

export const SelfServiceAPIContext = createContext(makeMockSelfServiceAPI())

export const useSelfServiceAPI = (): SelfServiceAPI =>
  useContext(SelfServiceAPIContext)

export const useEvents = (): Map<string, Event> => {
  const api = useSelfServiceAPI()
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
  const api = useSelfServiceAPI()
  const query = useSuspenseQuery({
    queryKey: [
      "self-service",
      "events",
      eventId,
      "registrations",
      { accessCode },
    ],
    async queryFn() {
      const regs = await api.listRegistrations(eventId, accessCode)
      return regs
    },
  })
  return query.data
}

export const useAccessCodeCheck = (
  eventId: string,
  accessCode: string,
): boolean => {
  const api = useSelfServiceAPI()
  const query = useSuspenseQuery({
    queryKey: ["events", eventId, "access-codes", accessCode, "check"],
    async queryFn() {
      return await api.checkAccessCode(eventId, accessCode)
    },
  })
  return query.data
}
