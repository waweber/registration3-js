import { Title } from "@open-event-systems/registration-common/components"
import { Suspense, useCallback, useState } from "react"
import { createRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  Interview,
  InterviewPanel,
  useInterviewAPI,
} from "@open-event-systems/interview-components"
import { Skeleton } from "@mantine/core"
import { useQueryClient } from "@tanstack/react-query"
import { useStickyCurrentCart } from "../cart/hooks.js"
import { useApp } from "../appContext.js"
import { getCartQueryOptions } from "../cart/queries.js"
import { eventRoute, registrationsRoute } from "./RegistrationsPage.js"
import { cartRoute } from "./CartPage.js"

export const addRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/add/$interviewId",
  async loader({ context, params, location }) {
    const { queryClient } = context
    const { eventId, interviewId } = params
    const hashParams = new URLSearchParams(location.hash)
    const accessCode = hashParams.get("a")
    const stateId = hashParams.get("s")

    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.fetchQuery(queries.interviewRecord(stateId))
    } else {
      const currentCart = await queryClient.fetchQuery(
        queries.currentCart(eventId),
      )
      const initialRecord = await queryClient.fetchQuery({
        ...queries.initialInterviewRecord(
          eventId,
          currentCart.id,
          interviewId,
          null,
          accessCode,
        ),
      })
      return initialRecord
    }
  },
  component() {
    const { eventId, interviewId } = addRegistrationRoute.useParams()

    return (
      <Title title="New Registration" subtitle="Add a new registration">
        <Suspense fallback={<Skeleton h={300} />}>
          <InterviewPage
            key={eventId}
            eventId={eventId}
            interviewId={interviewId}
            record={addRegistrationRoute.useLoaderData()}
          />
        </Suspense>
      </Title>
    )
  },
})

export const changeRegistrationRoute = createRoute({
  getParentRoute: () => eventRoute,
  path: "cart/change/$registrationId/$interviewId",
  async loader({ context, params, location }) {
    const { queryClient } = context
    const { eventId, interviewId, registrationId } = params
    const hashParams = new URLSearchParams(location.hash)
    const accessCode = hashParams.get("a")
    const stateId = hashParams.get("s")

    const queries = getCartQueryOptions(context)

    if (stateId) {
      return await queryClient.fetchQuery(queries.interviewRecord(stateId))
    } else {
      const currentCart = await queryClient.fetchQuery(
        queries.currentCart(eventId),
      )
      return await queryClient.fetchQuery(
        queries.initialInterviewRecord(
          eventId,
          currentCart.id,
          interviewId,
          registrationId,
          accessCode,
        ),
      )
    }
  },
  component() {
    const { eventId, interviewId, registrationId } =
      changeRegistrationRoute.useParams()

    return (
      <Title title="Change Registration" subtitle="Change a registration">
        <Suspense fallback={<Skeleton h={300} />}>
          <InterviewPage
            key={eventId}
            eventId={eventId}
            interviewId={interviewId}
            registrationId={registrationId}
            record={changeRegistrationRoute.useLoaderData()}
          />
        </Suspense>
      </Title>
    )
  },
})

const InterviewPage = ({
  eventId,
  interviewId,
  registrationId,
  record,
}: {
  eventId: string
  interviewId: string
  record: InterviewResponseRecord
  registrationId?: string
}) => {
  const [currentCart, setCurrentCart] = useStickyCurrentCart(eventId)

  const navigate = useNavigate()
  const router = useRouter()
  const appCtx = useApp()
  const { selfServiceAPI: selfService } = appCtx
  const queryClient = useQueryClient()

  const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

  const [interviewAPI, interviewStore] = useInterviewAPI()
  const cartQueryOptions = getCartQueryOptions(appCtx)

  const onNavigate = useCallback(
    (state: string) => {
      navigate({
        hash: `s=${state}`,
      })
    },
    [navigate],
  )
  const onClose = useCallback(() => {
    navigate({
      to: registrationsRoute.to,
      params: {
        eventId: eventId,
      },
    })
  }, [navigate, eventId])

  const onUpdate = useCallback(
    async (record: InterviewResponseRecord) => {
      if (record.response.completed) {
        const res = await selfService.completeInterview(record.response.state)
        navigate({
          to: cartRoute.to,
          params: {
            eventId: eventId,
          },
        })
        setCurrentCart(res)
      } else {
        setLatestRecordId(record.response.state)
        queryClient.setQueryData(
          cartQueryOptions.interviewRecord(record.response.state).queryKey,
          record,
        )
        navigate({
          hash: `s=${record.response.state}`,
        })
      }
    },
    [navigate, interviewId, registrationId, currentCart.id, eventId],
  )

  const getHistoryLink = useCallback(
    (state: string) => {
      const loc = router.buildLocation({
        to: addRegistrationRoute.to,
        params: { eventId, interviewId },
        hash: `s=${state}`,
      })
      return loc.href
    },
    [router, eventId, currentCart.id, interviewId],
  )

  return (
    <Interview
      api={interviewAPI}
      store={interviewStore}
      latestRecordId={latestRecordId ?? undefined}
      recordId={record.response.state}
      onNavigate={onNavigate}
      onUpdate={onUpdate}
      onClose={onClose}
    >
      {(renderProps) => (
        <InterviewPanel getHistoryLink={getHistoryLink} {...renderProps} />
      )}
    </Interview>
  )
}
