import { authRoute } from "#src/app/routes/auth.js"
import { getSelfServiceEventsQueryOptions } from "@open-event-systems/registration-lib/selfservice"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const eventsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/",
  async loader({ context }) {
    const { queryClient, selfServiceAPI } = context
    const options = getSelfServiceEventsQueryOptions(selfServiceAPI)
    const events = await queryClient.fetchQuery(options)
    return events
  },
  component: lazyRouteComponent(
    () => import("#src/features/selfservice/components/EventsRoute.js"),
  ),
})
