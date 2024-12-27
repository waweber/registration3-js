import { AdminAPI, Event, OverviewResponse } from "#src/admin/types.js"
import { UseSuspenseQueryOptions } from "@tanstack/react-query"

export const getEventOverviewQueryOptions = (
  adminAPI: AdminAPI,
  eventId: string,
  checkedIn?: boolean,
  since?: Date,
): UseSuspenseQueryOptions<OverviewResponse> => {
  return {
    queryKey: [
      "events",
      eventId,
      "overview",
      { checkedIn, since: since?.toISOString() || null },
    ],
    async queryFn() {
      return await adminAPI.readOverview(eventId, checkedIn, since)
    },
    staleTime: 60000,
  }
}

export const getEventsQueryOptions = (
  adminAPI: AdminAPI,
): UseSuspenseQueryOptions<Map<string, Event>> => {
  return {
    queryKey: ["events"],
    async queryFn() {
      const res = await adminAPI.listEvents()
      const map = new Map<string, Event>()
      for (const e of res) {
        map.set(e.id, e)
      }
      return map
    },
    staleTime: Infinity,
  }
}
