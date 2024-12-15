import { authRoute } from "#src/app/routes/auth.js"
import { deviceAuthRoute } from "#src/app/routes/device/device.js"
import { SCOPE } from "#src/features/auth/scope.js"
import { getEventsQueryOptions } from "@open-event-systems/registration-lib/admin"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
  redirect,
} from "@tanstack/react-router"

export const adminRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/admin",
  async beforeLoad({ context, location }) {
    const { authStore } = context
    await authStore.ready
    if (
      !authStore.token ||
      !authStore.token.scope.split(" ").includes(SCOPE.admin)
    ) {
      authStore.returnURL = location.href
      throw redirect({
        to: deviceAuthRoute.to,
      })
    }
  },
  async loader({ context }) {
    const { adminAPI, queryClient } = context
    const opts = getEventsQueryOptions(adminAPI)
    const res = await queryClient.ensureQueryData(opts)
    return res
  },
})

export const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/EventsRoute.js"),
    "EventsRoute",
  ),
})

export const adminEventsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "events",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/EventsRoute.js"),
    "EventsRoute",
  ),
})
export const adminEventRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "events/$eventId",
  async loader({ context, params }) {
    const { eventId } = params
    const { adminAPI, queryClient } = context
    const opts = getEventsQueryOptions(adminAPI)
    const events = await queryClient.ensureQueryData(opts)
    const res = events.get(eventId)
    if (!res) {
      throw notFound()
    }
    return res
  },
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/AdminRoute.js"),
    "AdminRoute",
  ),
})

export const adminEventIndexRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "/",
  async loader({ context }) {
    // TODO: events API
  },
})
