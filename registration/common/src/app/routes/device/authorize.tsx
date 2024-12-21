import { authRoute } from "#src/app/routes/auth.js"
import {
  createRoute,
  isNotFound,
  lazyRouteComponent,
} from "@tanstack/react-router"

export const deviceAuthAuthorizeRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/authorize",
  async loader({ context, location }) {
    const { authStore, authAPI, queryClient } = context
    const accessToken = authStore.token?.accessToken
    const code = location.hash

    if (code && accessToken) {
      try {
        const res = await authAPI.checkDeviceAuth(authStore, code)
        queryClient.setQueryData(["authorize", { user_code: code }], res)
      } catch (e) {
        if (isNotFound(e)) {
          queryClient.setQueryData(["authorize", { user_code: code }], null)
        } else {
          throw e
        }
      }
    }
  },
  staleTime: 5000,
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/DeviceAuthAuthorizeRoute.js"),
    "DeviceAuthAuthorizeRoute",
  ),
  pendingComponent: lazyRouteComponent(
    () => import("#src/features/auth/components/DeviceAuthAuthorizeRoute.js"),
    "DeviceAuthAuthorizePending",
  ),
})
