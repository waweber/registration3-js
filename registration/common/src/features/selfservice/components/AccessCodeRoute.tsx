import {
  addRegistrationRoute,
  changeRegistrationRoute,
} from "#src/app/routes/selfservice/cart.js"
import {
  accessCodeRoute,
  eventRoute,
} from "#src/app/routes/selfservice/registrations.js"
import { FullPageMenuLayout, Title } from "#src/components/index.js"
import AccessCodeOptions from "#src/features/selfservice/components/access-code/AccessCodeOptions.js"

export const AccessCodeRoute = () => {
  const { eventId, accessCode } = accessCodeRoute.useParams()
  const selfService = accessCodeRoute.useLoaderData()
  const navigate = accessCodeRoute.useNavigate()

  return (
    <FullPageMenuLayout>
      <Title title="Access Code" subtitle="View and manage registrations">
        <AccessCodeOptions
          options={selfService.registrations.add_options?.map((o) => ({
            id: o.id,
            title: o.title,
          }))}
          changeOptions={selfService.registrations.registrations.map((r) => ({
            registrationId: r.id,
            title: r.title || "Registration",
            options:
              r.change_options?.map((o) => ({
                id: o.id,
                title: o.title,
              })) ?? [],
          }))}
          onSelect={({ id, registrationId }) => {
            if (registrationId) {
              navigate({
                to: changeRegistrationRoute.to,
                params: {
                  eventId: eventId,
                  interviewId: id,
                  registrationId: registrationId,
                },
                hash: `a=${accessCode}`,
              })
            } else {
              navigate({
                to: addRegistrationRoute.to,
                params: {
                  eventId: eventId,
                  interviewId: id,
                },
                hash: `a=${accessCode}`,
              })
            }
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
