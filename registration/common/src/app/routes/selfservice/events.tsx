import { authRoute } from "#src/app/routes/auth.js"
import { getSelfServiceQueryOptions } from "#src/features/selfservice/api.js"
import { createRoute } from "@tanstack/react-router"
import { lazy } from "react"

export const eventsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/",
  async loader({ context }) {
    const { queryClient, selfServiceAPI } = context
    const selfServiceQueries = getSelfServiceQueryOptions(selfServiceAPI)
    const events = await queryClient.fetchQuery(selfServiceQueries.events)
    return events
  },
  component: lazy(
    () => import("#src/features/selfservice/components/EventsRoute.js"),
  ),
})
