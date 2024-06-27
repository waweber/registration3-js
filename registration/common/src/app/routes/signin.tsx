import { rootRoute } from "#src/app/routes/index"

import { createRoute, lazyRouteComponent } from "@tanstack/react-router"

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/Route"),
    "SignInRoute",
  ),
  notFoundComponent: lazyRouteComponent(
    () => import("#src/features/auth/components/Route"),
    "SignInRouteNotFound",
  ),
})

export const signInMenuRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/SignInMenu"),
    "SignInMenuRoute",
  ),
})

export const signInEmailRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "email",
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/email/EmailAuth"),
    "SignInEmailRoute",
  ),
})

export const webAuthnRegisterRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "webauthn-register",
  component: lazyRouteComponent(
    () => import("#src/features/auth/components/webauthn/WebAuthnRegistration"),
    "SignInWebAuthnRegisterRoute",
  ),
})
