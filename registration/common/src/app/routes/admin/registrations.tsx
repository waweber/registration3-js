import { adminEventRoute } from "#src/app/routes/admin/admin.js"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const adminRegistrationsRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/RegistrationsRoute.js"),
    "RegistrationsRoute",
  ),
})

export const adminRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations/$registrationId",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/RegistrationRoute.js"),
    "RegistrationRoute",
  ),
})

export const checkInRegistrationsRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "check-in",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/CheckInRegistrationsRoute.js"),
    "CheckInRegistrationsRoute",
  ),
})

export const checkInRegistrationRoute = createRoute({
  getParentRoute: () => checkInRegistrationsRoute,
  path: "$registrationId",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/CheckInRegistrationsRoute.js"),
    "CheckInRegistrationsRoute",
  ),
})
