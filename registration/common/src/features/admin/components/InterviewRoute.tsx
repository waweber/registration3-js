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
import {
  adminAddRegistrationRoute,
  adminRegistrationRoute,
  adminRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { adminEventIndexRoute } from "#src/app/routes/admin/admin.js"
import { useAdminAPI } from "@open-event-systems/registration-lib/admin"

export const AddRegistrationRoute = () => {
  const { eventId } = adminAddRegistrationRoute.useParams()

  return (
    <Title title="New Registration" subtitle="Add a new registration">
      <Suspense fallback={<Skeleton h={300} />}>
        <InterviewPage
          key={eventId}
          eventId={eventId}
          record={adminAddRegistrationRoute.useLoaderData()}
        />
      </Suspense>
    </Title>
  )
}

// export const ChangeRegistrationRoute = () => {
//   const { eventId } = adminChangeRegistrationRoute.useParams()
//   const t = adminChangeRegistrationRoute.useLoaderData()

//   return (
//     <Title title="Change Registration" subtitle="Change a registration">
//       <Suspense fallback={<Skeleton h={300} />}>
//         <InterviewPage
//           key={eventId}
//           eventId={eventId}
//           record={adminChangeRegistrationRoute.useLoaderData()}
//         />
//       </Suspense>
//     </Title>
//   )
// }

const InterviewPage = ({
  eventId,
  record,
}: {
  eventId: string
  record: InterviewResponseRecord
}) => {
  const navigate = useNavigate()
  const router = useRouter()
  const adminAPI = useAdminAPI()
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
      to: adminEventIndexRoute.to,
      params: {
        eventId: eventId,
      },
    })
  }, [navigate, eventId])

  const onUpdate = useCallback(
    async (record: InterviewResponseRecord) => {
      if (record.response.completed) {
        const res = await adminAPI.completeInterview(record.response)
        if (res == null) {
          navigate({
            to: adminRegistrationsRoute.to,
            params: {
              eventId,
            },
          })
        } else {
          for (const r of res.results) {
            navigate({
              to: adminRegistrationRoute.to,
              params: {
                eventId,
                registrationId: r.id,
              },
            })
            break
          }
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
    [navigate, eventId, adminAPI, queryClient, interviewAPI, interviewStore],
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
    [router, eventId],
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
