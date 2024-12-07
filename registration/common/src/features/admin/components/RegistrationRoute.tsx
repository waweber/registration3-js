import {
  adminRegistrationRoute,
  adminRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { Title } from "#src/components/index.js"
import { AdminInterviewPanel } from "#src/features/admin/components/interview-panel/AdminInterviewPanel.js"
import { RegistrationComponent } from "#src/features/admin/components/registration/Registration.js"
import { getDefaultUpdateURL } from "#src/utils.js"
import { Grid } from "@mantine/core"
import {
  useAdminAPI,
  useUpdateRegistrationFromInterview,
} from "@open-event-systems/registration-lib/admin"
import {
  getInterviewStateQueryOptions,
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"
import {
  getRegistrationName,
  useCancelRegistration,
  useCompleteRegistration,
  useRegistration,
} from "@open-event-systems/registration-lib/registration"
import { useIsMutating, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"

export const RegistrationRoute = () => {
  const { eventId, registrationId } = adminRegistrationRoute.useParams()
  const api = useAdminAPI()
  const location = useLocation()
  const navigate = useNavigate()
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const adminAPI = useAdminAPI()
  const queryClient = useQueryClient()

  const reg = useRegistration(eventId, registrationId)
  const complete = useCompleteRegistration(eventId, registrationId)
  const cancel = useCancelRegistration(eventId, registrationId)
  const mutating = useIsMutating({
    mutationKey: ["events", eventId, "registrations", registrationId],
  })
  const interviewNavigate = useCallback(
    (state: string) => {
      navigate({
        hash: `s=${state}`,
      })
    },
    [navigate],
  )

  const hashParams = new URLSearchParams(location.hash)
  const recordId = hashParams.get("s")
  const record = recordId ? interviewStore.get(recordId) : null
  const updateReg = useUpdateRegistrationFromInterview(eventId, registrationId)

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
      <Grid>
        <Grid.Col span={{ xs: 12, md: 6 }}>
          <RegistrationComponent
            registration={reg.registration}
            actions={reg.change_options?.map((o) => ({
              id: o.url,
              label: o.title,
            }))}
            summary={reg.summary}
            onComplete={() => mutating == 0 && complete()}
            onCancel={() => mutating == 0 && cancel()}
            onSelectAction={action}
          />
        </Grid.Col>
        {record && (
          <Grid.Col span={{ xs: 12, md: 6 }}>
            <AdminInterviewPanel
              recordId={recordId}
              onNavigate={interviewNavigate}
              onClose={() =>
                navigate({
                  to: adminRegistrationsRoute.to,
                  params: {
                    eventId,
                  },
                })
              }
              onComplete={async (response) => {
                await updateReg(response)
                navigate({
                  to: adminRegistrationRoute.to,
                  params: {
                    eventId,
                    registrationId,
                  },
                })
              }}
            />
          </Grid.Col>
        )}
      </Grid>
    </Title>
  )
}
