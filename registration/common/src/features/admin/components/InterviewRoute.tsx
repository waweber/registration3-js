import { Suspense, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  CompleteInterviewResponse,
  InterviewResponseRecord,
} from "@open-event-systems/interview-lib"
import { Skeleton } from "@mantine/core"
import { Title } from "#src/components/index.js"
import {
  adminAddRegistrationRoute,
  adminChangeRegistrationRoute,
  adminCheckInChangeRegistrationRoute,
  adminRegistrationRoute,
  adminRegistrationsRoute,
  checkInRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { adminEventIndexRoute } from "#src/app/routes/admin/admin.js"
import { useAdminAPI } from "@open-event-systems/registration-lib/admin"
import { AdminInterviewPanel } from "#src/features/admin/components/interview-panel/AdminInterviewPanel.js"

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

export const ChangeRegistrationRoute = () => {
  const { eventId } = adminChangeRegistrationRoute.useParams()

  return (
    <Title title="Change Registration" subtitle="Change a registration">
      <Suspense fallback={<Skeleton h={300} />}>
        <InterviewPage
          key={eventId}
          eventId={eventId}
          record={adminChangeRegistrationRoute.useLoaderData()}
        />
      </Suspense>
    </Title>
  )
}

export const CheckInChangeRegistrationRoute = () => {
  const { eventId } = adminCheckInChangeRegistrationRoute.useParams()

  return (
    <Title title="Check In" subtitle="Check in a registration">
      <Suspense fallback={<Skeleton h={300} />}>
        <InterviewPage
          key={eventId}
          eventId={eventId}
          checkIn
          record={adminCheckInChangeRegistrationRoute.useLoaderData()}
        />
      </Suspense>
    </Title>
  )
}

const InterviewPage = ({
  eventId,
  record,
  checkIn,
}: {
  eventId: string
  record: InterviewResponseRecord
  checkIn?: boolean
}) => {
  const navigate = useNavigate()
  const adminAPI = useAdminAPI()
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
  const onComplete = useCallback(
    async (response: CompleteInterviewResponse) => {
      const res = await adminAPI.completeInterview(response)
      if (!res) {
        if (checkIn) {
          navigate({
            to: checkInRegistrationsRoute.to,
            params: {
              eventId,
            },
          })
        } else {
          navigate({
            to: adminRegistrationsRoute.to,
            params: {
              eventId,
            },
          })
        }
      } else {
        for (const reg of res.results) {
          if (checkIn) {
            navigate({
              to: checkInRegistrationsRoute.to,
              params: {
                eventId,
              },
            })
          } else {
            navigate({
              to: adminRegistrationRoute.to,
              params: {
                eventId,
                registrationId: reg.id,
              },
            })
          }
          break
        }
      }
    },
    [adminAPI, eventId, checkIn],
  )

  return (
    <AdminInterviewPanel
      recordId={record.response.state}
      onNavigate={onNavigate}
      onComplete={onComplete}
      onClose={onClose}
    />
  )
}
