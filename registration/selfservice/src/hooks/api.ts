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

export const useRegistrations = (eventId: string): RegistrationListResponse => {
  const api = useSelfServiceAPI()
  const query = useSuspenseQuery({
    queryKey: ["self-service", "events", eventId, "registrations"],
    async queryFn() {
      const regs = await api.listRegistrations()
      return regs
    },
    refetchInterval: 3000,
    staleTime: 3000,
  })
  return query.data
}
