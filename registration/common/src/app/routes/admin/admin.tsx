import { authRoute } from "#src/app/routes/auth.js"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const adminRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/admin",
  async loader({ context }) {
    // TODO: events API
  },
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/AdminRoute.js"),
    "AdminRoute",
  ),
})

export const adminEventRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "events/$eventId",
  async loader({ context }) {
    // TODO: events API
  },
})

export const adminEventIndexRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "/",
  async loader({ context }) {
    // TODO: events API
  },
})
