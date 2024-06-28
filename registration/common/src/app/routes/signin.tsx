import { rootRoute } from "#src/app/routes/index.js"

import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/Route.js"),
    "SignInRoute",
  ),
  notFoundComponent: lazyRouteComponent(
    () => import("#src/features/auth/components/Route.js"),
    "SignInRouteNotFound",
  ),
})

export const signInMenuRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/SignInMenu.js"),
    "SignInMenuRoute",
  ),
})

export const signInEmailRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "email",
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/email/EmailAuth.js"),
    "SignInEmailRoute",
  ),
})

export const webAuthnRegisterRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "webauthn-register",
  component: lazyRouteComponent(
    () =>
      import("#src/features/auth/components/webauthn/WebAuthnRegistration.js"),
    "SignInWebAuthnRegisterRoute",
  ),
})
