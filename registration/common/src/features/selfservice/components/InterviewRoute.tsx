import { Suspense, useCallback, useState } from "react"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  Interview,
  InterviewContentComponentProps,
  InterviewPanel,
  useInterviewAPI,
} from "@open-event-systems/interview-components"
import { Skeleton } from "@mantine/core"
import { useQueryClient } from "@tanstack/react-query"
import { selfServiceRegistrationsRoute } from "#src/app/routes/selfservice/registrations.js"
import { getCartQueryOptions } from "#src/features/cart/api.js"
import { Title } from "#src/components/index.js"
import { useStickyCurrentCart } from "#src/features/cart/hooks.js"
import { useApp } from "#src/hooks/app.js"
import {
  addRegistrationRoute,
  cartRoute,
  changeRegistrationRoute,
} from "#src/app/routes/selfservice/cart.js"

export const AddRegistrationRoute = () => {
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
}

export const ChangeRegistrationRoute = () => {
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
}

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
      to: selfServiceRegistrationsRoute.to,
      params: {
        eventId: eventId,
      },
    })
  }, [navigate, eventId])

  const onUpdate = useCallback(
    async (record: InterviewResponseRecord) => {
      if (record.response.completed) {
        const res = await selfService.completeInterview(record.response)
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

  const Component = useCallback(
    (props: InterviewContentComponentProps) => (
      <InterviewPanel getHistoryLink={getHistoryLink} {...props} />
    ),
    [getHistoryLink],
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
      contentComponent={Component}
    />
  )
}
