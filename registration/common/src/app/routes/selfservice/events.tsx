import { authRoute } from "#src/app/routes/auth.js"
import { getSelfServiceQueryOptions } from "#src/features/selfservice/api.js"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const eventsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/",
  async loader({ context }) {
    const { queryClient, selfServiceAPI } = context
    const selfServiceQueries = getSelfServiceQueryOptions(selfServiceAPI)
    const events = await queryClient.fetchQuery(selfServiceQueries.events)
    return events
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/EventsRoute.js"),
  ),
})
