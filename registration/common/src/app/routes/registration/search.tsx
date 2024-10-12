import { adminEventRoute } from "#src/app/routes/admin.js"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const registrationSearchRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations",
  component: lazyRouteComponent(
    () => import("#src/features/registration/routes/SearchRoute.js"),
    "RegistrationSearchRoute",
  ),
})
