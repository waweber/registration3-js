import {
  addRegistrationRoute,
  changeRegistrationRoute,
} from "#src/app/routes/selfservice/cart.js"
import { accessCodeRoute } from "#src/app/routes/selfservice/registrations.js"
import { FullPageMenuLayout, Title } from "#src/components/index.js"
import AccessCodeOptions from "#src/features/selfservice/components/access-code/AccessCodeOptions.js"
import { useCurrentCart } from "@open-event-systems/registration-lib/cart"
import {
  getInterviewStateQueryOptions,
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"
import {
  useSelfServiceAPI,
  useSelfServiceRegistrations,
} from "@open-event-systems/registration-lib/selfservice"
import { useQueryClient } from "@tanstack/react-query"

export const AccessCodeRoute = () => {
  const { eventId, accessCode } = accessCodeRoute.useParams()
  const [currentCart] = useCurrentCart(eventId)
  const selfServiceAPI = useSelfServiceAPI()
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const registrations = useSelfServiceRegistrations(
    eventId,
    currentCart.id,
    accessCode,
  )
  const navigate = accessCodeRoute.useNavigate()
  const queryClient = useQueryClient()

  return (
    <FullPageMenuLayout>
      <Title title="Access Code" subtitle="View and manage registrations">
        <AccessCodeOptions
          options={registrations.add_options?.map((o) => ({
            id: o.url,
            title: o.title,
          }))}
          changeOptions={registrations.registrations.map((r) => ({
            registrationId: r.id,
            title: r.title || "Registration",
            options:
              r.change_options?.map((o) => ({
                id: o.url,
                title: o.title,
              })) ?? [],
          }))}
          onSelect={({ id: url }) => {
            selfServiceAPI
              .startInterview(url)
              .then((res) => interviewAPI.update(res))
              .then((res) => {
                const record = interviewStore.add(res)
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
                  to: changeRegistrationRoute.to,
                  params: {
                    eventId: eventId,
                  },
                  hash: `s=${res.state}`,
                })
              })
          }}
        />
      </Title>
    </FullPageMenuLayout>
  )
}

export const AccessCodeNotFoundRoute = () => {
  return (
    <FullPageMenuLayout>
      <Title title="Invalid Access Code">
        <AccessCodeOptions.NotFound />
      </Title>
    </FullPageMenuLayout>
  )
}

export default AccessCodeRoute
