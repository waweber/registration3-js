import { adminEventRoute } from "#src/app/routes/admin/admin.js"
import { getDefaultUpdateURL } from "#src/utils.js"
import { getInterviewStateQueryOptions } from "@open-event-systems/registration-lib/interview"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  createRoute,
  lazyRouteComponent,
  notFound,
  redirect,
} from "@tanstack/react-router"
import {
  getRegistrationQueryOptions,
  getRegistrationSearchQueryOptions,
} from "@open-event-systems/registration-lib/registration"
import { getRegistrationPaymentsQueryOptions } from "@open-event-systems/registration-lib/payment"
import {
  getDocumentTypesQueryOptions,
  getRegistrationDocumentsQueryOptions,
} from "@open-event-systems/registration-lib/print"

export const adminRegistrationsRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations",
  async loader({ params, context }) {
    const { eventId } = params
    const { registrationAPI, queryClient } = context
    const opts = getRegistrationSearchQueryOptions(
      registrationAPI,
      eventId,
      "",
      {},
    )
    const res = await queryClient.ensureInfiniteQueryData(opts)
    return res
  },
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/RegistrationsRoute.js"),
    "RegistrationsRoute",
  ),
})

export const adminRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations/$registrationId",
  async loader({ params, context }) {
    const { eventId, registrationId } = params
    const { registrationAPI, paymentAPI, printAPI, queryClient } = context
    const regOpts = getRegistrationQueryOptions(
      registrationAPI,
      eventId,
      registrationId,
    )
    const paymentOpts = getRegistrationPaymentsQueryOptions(
      paymentAPI,
      eventId,
      registrationId,
    )
    const docTypesOpts = getDocumentTypesQueryOptions(printAPI, eventId)
    const docsOpts = getRegistrationDocumentsQueryOptions(
      printAPI,
      eventId,
      registrationId,
    )
    const [registration, payments, docTypes, docs] = await Promise.all([
      queryClient.ensureQueryData(regOpts),
      queryClient.ensureQueryData(paymentOpts),
      queryClient.ensureQueryData(docTypesOpts),
      queryClient.ensureQueryData(docsOpts),
    ])
    return { registration, payments, docTypes, docs }
  },
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
  async loader({ params, context, cause }) {
    const { eventId, registrationId } = params
    const {
      registrationAPI,
      interviewAPI,
      adminAPI,
      interviewStore,
      queryClient,
    } = context
    const opts = getRegistrationQueryOptions(
      registrationAPI,
      eventId,
      registrationId,
    )
    const res = await queryClient.fetchQuery(opts)

    const autoOptions = res.change_options?.filter((o) => o.auto) ?? []

    // auto-start an interview if there is only one
    if (cause == "enter" && autoOptions.length == 1) {
      const opt = autoOptions[0]
      const startResp = await adminAPI.startInterview(opt.url)
      const firstResp = await interviewAPI.update(startResp)
      const record = interviewStore.add(firstResp)
      const opts = getInterviewStateQueryOptions(
        interviewAPI,
        interviewStore,
        getDefaultUpdateURL(),
        record.response.state,
      )
      queryClient.setQueryData(opts.queryKey, record)
      throw redirect({
        to: adminCheckInChangeRegistrationRoute.to,
        params: {
          eventId,
          registrationId,
        },
        hash: `s=${record.response.state}`,
      })
    }

    return res
  },
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/CheckInRegistrationRoute.js"),
    "CheckInRegistrationRoute",
  ),
})

export const adminAddRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations/add",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/InterviewRoute.js"),
    "AddRegistrationRoute",
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

export const adminChangeRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "registrations/$registrationId/update",
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

export const adminCheckInChangeRegistrationRoute = createRoute({
  getParentRoute: () => adminEventRoute,
  path: "check-in/$registrationId/update",
  component: lazyRouteComponent(
    () => import("#src/features/admin/components/InterviewRoute.js"),
    "CheckInChangeRegistrationRoute",
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
