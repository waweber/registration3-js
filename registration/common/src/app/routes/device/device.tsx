import { signInRoute } from "#src/app/routes/signin.js"
import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const deviceAuthRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "device",
  async loader({ context }) {
    const { authAPI, queryClient } = context

    const auth = await authAPI.startDeviceAuth()
    queryClient.setQueryData(
      ["auth", "token", { response_type: "device_code" }],
      auth,
    )
    return auth
  },
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/DeviceAuthDeviceRoute.js"),
    "DeviceAuthDeviceRoute",
  ),
})
