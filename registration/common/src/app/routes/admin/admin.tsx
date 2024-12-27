import { authRoute } from "#src/app/routes/auth.js"
import { deviceAuthRoute } from "#src/app/routes/device/device.js"
import { SCOPE } from "#src/features/auth/scope.js"
import {
  getEventOverviewQueryOptions,
  getEventsQueryOptions,
} from "@open-event-systems/registration-lib/admin"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
  redirect,
} from "@tanstack/react-router"
import { sub as dateSub } from "date-fns"

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
  async loader({ context, params }) {
    const now = getNow()
    const todayDate = getToday()
    const { adminAPI, queryClient } = context
    const { eventId } = params
    const lastFiveMins = getEventOverviewQueryOptions(
      adminAPI,
      eventId,
      true,
      dateSub(now, { minutes: 5 }),
    )
    const lastHalfHour = getEventOverviewQueryOptions(
      adminAPI,
      eventId,
      true,
      dateSub(now, { minutes: 30 }),
    )
    const lastTwoHours = getEventOverviewQueryOptions(
      adminAPI,
      eventId,
      true,
      dateSub(now, { hours: 2 }),
    )
    const today = getEventOverviewQueryOptions(
      adminAPI,
      eventId,
      true,
      todayDate,
    )
    const checkedIn = getEventOverviewQueryOptions(adminAPI, eventId, true)
    const total = getEventOverviewQueryOptions(adminAPI, eventId)

    await Promise.all([
      queryClient.ensureQueryData(lastFiveMins),
      queryClient.ensureQueryData(lastHalfHour),
      queryClient.ensureQueryData(lastTwoHours),
      queryClient.ensureQueryData(today),
      queryClient.ensureQueryData(checkedIn),
      queryClient.ensureQueryData(total),
    ])
  },
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/OverviewRoute.js"),
    "OverviewRoute",
  ),
})

const getNow = (): Date => {
  const now = new Date()
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    0,
    0,
  )
}

const getToday = (): Date => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
}
