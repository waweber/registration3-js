import { adminEventRoute } from "#src/app/routes/admin/admin.js"
import { getDefaultUpdateURL } from "#src/utils.js"
import { getInterviewStateQueryOptions } from "@open-event-systems/registration-lib/interview"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
} from "@tanstack/react-router"

export const adminRegistrationsRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/RegistrationsRoute.js"),
    "RegistrationsRoute",
  ),
})

export const adminRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations/$registrationId",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/RegistrationRoute.js"),
    "RegistrationRoute",
  ),
})

export const checkInRegistrationsRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "check-in",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/CheckInRegistrationsRoute.js"),
    "CheckInRegistrationsRoute",
  ),
})

export const checkInRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "check-in/$registrationId",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/CheckInRegistrationsRoute.js"),
    "CheckInRegistrationsRoute",
  ),
})

export const adminChangeRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations/$registrationId/change",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/InterviewRoute.js"),
    "ChangeRegistrationRoute",
  ),
  async loader({ context }): Promise<InterviewResponseRecord> {
    const { queryClient, interviewAPI, interviewStore } = context
    const hashParams = new URLSearchParams(location.hash.substring(1))
    const stateId = hashParams.get("s")

    if (stateId) {
      return await queryClient.fetchQuery(
        getInterviewStateQueryOptions(
          interviewAPI,
          interviewStore,
          getDefaultUpdateURL(),
          stateId,
        ),
      )
    } else {
      throw notFound()
    }
  },
})
