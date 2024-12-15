import {
  adminChangeRegistrationRoute,
  adminCheckInChangeRegistrationRoute,
  checkInRegistrationRoute,
} from "#src/app/routes/admin/registrations.js"
import { Title } from "#src/components/index.js"
import { Documents } from "#src/features/admin/components/documents/Documents.js"
import { PaymentHistory } from "#src/features/admin/components/payment-history/PaymentHistory.js"
import { RegistrationComponent } from "#src/features/admin/components/registration/Registration.js"
import { getDefaultUpdateURL } from "#src/utils.js"
import { Stack } from "@mantine/core"
import { useAdminAPI } from "@open-event-systems/registration-lib/admin"
import {
  getInterviewStateQueryOptions,
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"
import {
  getRegistrationName,
  useRegistration,
} from "@open-event-systems/registration-lib/registration"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"

export const CheckInRegistrationRoute = () => {
  const { eventId, registrationId } = checkInRegistrationRoute.useParams()
  const api = useAdminAPI()
  const navigate = useNavigate()
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const adminAPI = useAdminAPI()
  const queryClient = useQueryClient()

  const reg = useRegistration(eventId, registrationId)

  const action = useCallback(
    (actionId: string) => {
      api
        .startInterview(actionId)
        .then((response) => {
          return interviewAPI.update(response)
        })
        .then((response) => {
          const record = interviewStore.add(response)
          queryClient.setQueryData(
            getInterviewStateQueryOptions(
              interviewAPI,
              interviewStore,
              getDefaultUpdateURL(),
              record.response.state,
            ).queryKey,
            record,
          )

          navigate({
            to: adminCheckInChangeRegistrationRoute.to,
            params: {
              eventId,
              registrationId,
            },
            hash: `s=${record.response.state}`,
          })
        })
    },
    [
      api,
      interviewAPI,
      interviewStore,
      queryClient,
      navigate,
      eventId,
      registrationId,
      adminAPI,
    ],
  )

  return (
    <Title title={getRegistrationName(reg.registration)}>
      <Stack>
        <RegistrationComponent
          registration={reg.registration}
          actions={reg.change_options?.map((o) => ({
            id: o.url,
            label: o.title,
          }))}
          summary={reg.summary}
          onSelectAction={action}
        />
      </Stack>
    </Title>
  )
}
