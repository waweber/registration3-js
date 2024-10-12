import { authRoute } from "#src/app/routes/auth.js"
import { createRoute } from "@tanstack/react-router"

export const adminRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "admin",
})

export const adminEventRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "$eventId",
  // TODO: load events
})
