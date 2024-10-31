import { UseQueryOptions } from "@tanstack/react-query"
import {
  Event,
  Registration,
  RegistrationListResponse,
  SelfServiceAPI,
} from "./types.js"
import { Wretch, WretchResponse } from "wretch"
import { queryStringAddon } from "wretch/addons"

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
    cartId: string,
    accessCode?: string | null,
  ): UseQueryOptions<RegistrationListResponse> => ({
    queryKey: [
      "self-service",
      "events",
      eventId,
      "registrations",
      { cartId: cartId, accessCode: accessCode || null },
    ],
    async queryFn() {
      return await api.listRegistrations(eventId, cartId, accessCode)
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

export const makeSelfServiceAPI = (wretch: Wretch): SelfServiceAPI => {
  return {
    async listEvents() {
      return await wretch.url("/self-service/events").get().json()
    },
    async listRegistrations(eventId, cartId, accessCode) {
      const query: Record<string, string> = {
        cart_id: cartId,
      }
      if (accessCode) {
        query["access_code"] = accessCode
      }
      return await wretch
        .url(`/self-service/events/${eventId}/registrations`)
        .addon(queryStringAddon)
        .query(query)
        .get()
        .json()
    },
    async startInterview(url) {
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
    async checkAccessCode(eventId, accessCode) {
      const res = await wretch
        .url(`/events/${eventId}/access-codes/${accessCode}/check`)
        .get()
        .notFound(() => false)
        .res<WretchResponse | false>()
      return res !== false
    },
  }
}

const delay = (d: number) => new Promise((r) => window.setTimeout(r, d))

export const makeMockSelfServiceAPI = (): SelfServiceAPI => {
  const registrations: Registration[] = [
    {
      id: "mock-registration-1",
      title: "Copley Deer",
      subtitle: "Sponsor",
      description: "Sponsor level registration.",
    },
    {
      id: "mock-registration-2",
      title: "Attendee 2",
      subtitle: "Attendee",
      description: "Standard registration.",
      change_options: [
        {
          url: "upgrade",
          title: "Upgrade",
        },
      ],
    },
  ]

  return {
    async listEvents() {
      await delay(100)
      return [{ id: "example-event", title: "Example Event", open: true }]
    },
    async listRegistrations() {
      await delay(300)
      return {
        registrations: registrations,
        add_options: [
          { url: "add-full", title: "Full Weekend" },
          { url: "add-day", title: "Day Pass" },
        ],
      }
    },
    async startInterview(url) {
      await delay(200)
      return {
        state: `${url}-0`,
        completed: false,
        target: "",
      }
    },
    async completeInterview() {
      await delay(300)
      return {
        id: "empty",
      }
    },
    async checkAccessCode(_eventId, _accessCode) {
      return false
    },
  }
}
