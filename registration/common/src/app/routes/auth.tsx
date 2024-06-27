import { rootRoute } from "#src/app/routes/index"
import { createRoute, notFound } from "@tanstack/react-router"

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  async beforeLoad({ context, location }) {
    const { authStore } = context
    await authStore.ready
    if (!authStore.token) {
      authStore.returnURL = location.href
      // TODO: redirect to sign in
      throw notFound()
    }
  },
})
