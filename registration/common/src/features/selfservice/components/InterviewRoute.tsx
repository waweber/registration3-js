import { Suspense, useCallback, useState } from "react"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { InterviewResponseRecord } from "@open-event-systems/interview-lib"
import {
  Interview,
  InterviewContentComponentProps,
  InterviewPanel,
} from "@open-event-systems/interview-components"
import { Skeleton } from "@mantine/core"
import { useQueryClient } from "@tanstack/react-query"
import { selfServiceRegistrationsRoute } from "#src/app/routes/selfservice/registrations.js"
import { Title } from "#src/components/index.js"
import {
  addRegistrationRoute,
  cartRoute,
  changeRegistrationRoute,
} from "#src/app/routes/selfservice/cart.js"
import {
  getPricingResultQueryOptions,
  useCartAPI,
  useStickyCurrentCart,
} from "@open-event-systems/registration-lib/cart"
import { useSelfServiceAPI } from "@open-event-systems/registration-lib/selfservice"
import {
  getInterviewStateQueryOptions,
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"

export const AddRegistrationRoute = () => {
  const { eventId } = addRegistrationRoute.useParams()

  return (
    <Title title="New Registration" subtitle="Add a new registration">
      <Suspense fallback={<Skeleton h={300} />}>
        <InterviewPage
          key={eventId}
          eventId={eventId}
          record={addRegistrationRoute.useLoaderData()}
        />
      </Suspense>
    </Title>
  )
}

export const ChangeRegistrationRoute = () => {
  const { eventId } = changeRegistrationRoute.useParams()

  return (
    <Title title="Change Registration" subtitle="Change a registration">
      <Suspense fallback={<Skeleton h={300} />}>
        <InterviewPage
          key={eventId}
          eventId={eventId}
          record={changeRegistrationRoute.useLoaderData()}
        />
      </Suspense>
    </Title>
  )
}

const InterviewPage = ({
  eventId,
  record,
}: {
  eventId: string
  record: InterviewResponseRecord
}) => {
  const [currentCart, setCurrentCart] = useStickyCurrentCart(eventId)
  const navigate = useNavigate()
  const router = useRouter()
  const cartAPI = useCartAPI()
  const selfServiceAPI = useSelfServiceAPI()
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const queryClient = useQueryClient()

  const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

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
        const res = await selfServiceAPI.completeInterview(record.response)
        if (res == null) {
          navigate({
            to: selfServiceRegistrationsRoute.to,
            params: {
              eventId: eventId,
            },
          })
        } else {
          await queryClient.fetchQuery(
            getPricingResultQueryOptions(cartAPI, res.id),
          )
          navigate({
            to: cartRoute.to,
            params: {
              eventId: eventId,
            },
          })
          setCurrentCart(res)
        }
      } else {
        setLatestRecordId(record.response.state)
        queryClient.setQueryData(
          getInterviewStateQueryOptions(
            interviewAPI,
            interviewStore,
            "",
            record.response.state,
          ).queryKey,
          record,
        )
        navigate({
          hash: `s=${record.response.state}`,
        })
      }
    },
    [
      navigate,
      currentCart.id,
      eventId,
      selfServiceAPI,
      queryClient,
      interviewAPI,
      interviewStore,
    ],
  )

  const getHistoryLink = useCallback(
    (state: string) => {
      const loc = router.buildLocation({
        to: addRegistrationRoute.to,
        params: { eventId },
        hash: `s=${state}`,
      })
      return loc.href
    },
    [router, eventId, currentCart.id],
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
