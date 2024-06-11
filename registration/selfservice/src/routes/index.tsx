import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router"

import {
  AlertProvider,
  SelfServiceLayout,
  Title,
  UserMenu,
  useTitle,
} from "@open-event-systems/registration-common/components"
import { AccessCodePage, RegistrationsPage } from "./RegistrationsPage.js"
import { AddRegistrationPage, ChangeRegistrationPage } from "./InterviewPage.js"
import { CartPage } from "./CartPage.js"
import { observer } from "mobx-react-lite"
import {
  AuthAPI,
  AuthStore,
  NotFound,
  SignInEmailRoute,
  SignInMenuRoute,
  SignInRoute,
  saveToken,
  useAuth,
} from "@open-event-systems/registration-common"

export interface RouterContext {
  authAPI: AuthAPI
  authStore: AuthStore
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  notFoundComponent() {
    return <NotFound />
  },
})

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInRoute,
  notFoundComponent: SignInRoute.NotFound,
})

export const signInMenuRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "/",
  component: SignInMenuRoute,
})

export const signInEmailRoute = createRoute({
  getParentRoute: () => signInRoute,
  path: "email",
  component: SignInEmailRoute,
})

export const eventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId",
  async beforeLoad({ context, location }) {
    const { authStore } = context
    await authStore.ready
    if (!authStore.token) {
      authStore.returnURL = location.href
      throw redirect({ to: signInMenuRoute.to })
    }
    authStore.returnURL = null
  },
  component: observer(() => {
    const [title, subtitle] = useTitle()
    const auth = useAuth()
    const navigate = useNavigate()
    const loc = useLocation()
    return (
      <SelfServiceLayout
        title={title}
        subtitle={subtitle}
        homeHref="/"
        userMenu={
          <UserMenu
            userName={auth.token?.email}
            onSignIn={() => {
              auth.returnURL = loc.pathname
              navigate({
                to: signInMenuRoute.to,
              })
            }}
            onSignOut={() => {
              saveToken(null)
              window.location.reload()
            }}
            signInOptions={[{ id: "sign-in", label: "Sign In" }]}
          />
        }
      >
        <Title title="Registration">
          <AlertProvider>
            <Outlet />
          </AlertProvider>
        </Title>
      </SelfServiceLayout>
    )
  }),
})

export const registrationsRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "/",
  component: RegistrationsPage,
})

export const accessCodeRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "access-code/$accessCode",
  component: AccessCodePage,
})

export const addRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/add/$interviewId",
  component: AddRegistrationPage,
})

export const changeRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/change/$registrationId/$interviewId",
  component: ChangeRegistrationPage,
})

export const cartRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart",
  component: CartPage,
})

export const routeTree = rootRoute.addChildren([
  signInRoute.addChildren([signInMenuRoute, signInEmailRoute]),
  eventRoute.addChildren([
    registrationsRoute,
    addRegistrationRoute,
    changeRegistrationRoute,
    accessCodeRoute,
    cartRoute,
  ]),
])
