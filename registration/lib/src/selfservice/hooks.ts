import { SelfServiceAPIContext } from "#src/selfservice/providers.js"
import {
  getSelfServiceEventsQueryOptions,
  getSelfServiceRegistrationsQueryOptions,
} from "#src/selfservice/queries.js"
import {
  Event,
  RegistrationListResponse,
  SelfServiceAPI,
} from "#src/selfservice/types.js"
import { useRequiredContext } from "#src/utils.js"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useSelfServiceEvents = (): Map<string, Event> => {
  const api = useSelfServiceAPI()
  const options = getSelfServiceEventsQueryOptions(api)
  const query = useSuspenseQuery(options)
  return query.data
}

export const useSelfServiceRegistrations = (
  eventId: string,
  cartId: string,
  accessCode?: string | null,
): RegistrationListResponse => {
  const api = useSelfServiceAPI()
  const options = getSelfServiceRegistrationsQueryOptions(
    api,
    eventId,
    cartId,
    accessCode,
  )
  const query = useSuspenseQuery(options)
  return query.data
}

export const useSelfServiceAPI = (): SelfServiceAPI =>
  useRequiredContext(SelfServiceAPIContext)
