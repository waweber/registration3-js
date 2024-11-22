import { adminEventRoute, adminRoute } from "#src/app/routes/admin/admin.js"
import { selfServiceRegistrationsRoute } from "#src/app/routes/selfservice/registrations.js"
import { Title, useTitle } from "#src/components/index.js"
import { AppShellLayout } from "#src/components/layout/app-shell/AppShellLayout.js"
import { getAdminNavEntries } from "#src/features/admin/components/adminEntries.js"
import { SCOPE, Scope } from "#src/features/auth/scope.js"
import { useAuth } from "#src/hooks/auth.js"
import { NavLink } from "@mantine/core"
import {
  createLink,
  Outlet,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { observer } from "mobx-react-lite"
import { ReactNode, useMemo } from "react"

declare module "@tanstack/react-router" {
  interface HistoryState {
    appShellMenuOpened?: boolean
  }
}

export const AdminRoute = observer(() => {
  const { eventId } = adminEventRoute.useParams()
  const loc = useLocation()
  const navigate = useNavigate()
  const router = useRouter()
  const opened = !!loc.state.appShellMenuOpened
  const auth = useAuth()
  const scope = (auth.token?.scope.split(" ") || []) as Scope[]
  const entries = useMemo(
    () =>
      getAdminNavEntries(scope, true).map(([k, e]) => e.link(eventId, opened)),
    [scope, opened],
  )
  const [title] = useTitle()

  return (
    <AppShellLayout
      menuOpened={opened}
      onOpen={() => {
        navigate({
          state: {
            ...loc.state,
            appShellMenuOpened: true,
          },
        })
      }}
      onClose={() => {
        router.history.go(-1)
      }}
      title={title}
      links={entries}
    >
      <Outlet />
    </AppShellLayout>
  )
})

AdminRoute.displayName = "AdminRoute"
