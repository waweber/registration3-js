import {
  adminEventIndexRoute,
  adminEventRoute,
} from "#src/app/routes/admin/admin.js"
import {
  adminRegistrationsRoute,
  checkInRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { selfServiceRegistrationsRoute } from "#src/app/routes/selfservice/registrations.js"
import { AppShellLayout } from "#src/components/layout/app-shell/AppShellLayout.js"
import { SCOPE, Scope } from "#src/features/auth/scope.js"
import {
  IconCheckupList,
  IconLayoutDashboard,
  IconUsers,
} from "@tabler/icons-react"
import { ReactNode } from "react"

export type AdminNavEntry = Readonly<{
  hasPermission: (scope: Scope[]) => boolean
  link: (eventId: string, replace: boolean) => ReactNode
}>

/**
 * Get all {@link AdminNavEntry}
 */
export const getAdminNavEntries = (
  scope: Scope[],
  all = false,
): [string, AdminNavEntry][] => {
  return Object.entries(adminNavEntries).filter(
    ([k, e]) => all || e?.hasPermission(scope),
  )
}

const adminNavEntries: { readonly [key: string]: AdminNavEntry } = {
  index: {
    hasPermission: () => true,
    link: (eventId, replace) => (
      <AppShellLayout.NavLink
        key="overview"
        label="Overview"
        to={adminEventIndexRoute.to}
        params={{
          eventId: eventId,
        }}
        activeOptions={{
          exact: true,
        }}
        replace={replace}
        leftSection={<IconLayoutDashboard />}
      />
    ),
  },
  registrations: {
    hasPermission: (scope) => scope.includes(SCOPE.admin),
    link: (eventId, replace) => (
      <AppShellLayout.NavLink
        key="registrations"
        label="Registrations"
        to={adminRegistrationsRoute.to}
        params={{
          eventId: eventId,
        }}
        replace={replace}
        leftSection={<IconUsers />}
      />
    ),
  },
  checkIn: {
    hasPermission: (scope) => scope.includes(SCOPE.admin),
    link: (eventId, replace) => (
      <AppShellLayout.NavLink
        key="checkIn"
        label="Check In"
        to={checkInRegistrationsRoute.to}
        params={{
          eventId: eventId,
        }}
        replace={replace}
        leftSection={<IconCheckupList />}
      />
    ),
  },
}