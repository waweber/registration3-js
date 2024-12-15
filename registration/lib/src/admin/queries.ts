import { AdminAPI, Event } from "#src/admin/types.js"
import { UseSuspenseQueryOptions } from "@tanstack/react-query"

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
