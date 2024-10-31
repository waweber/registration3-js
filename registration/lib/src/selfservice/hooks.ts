import { SelfServiceAPIContext } from "#src/selfservice/providers.js"
import {
  getSelfServiceAccessCodeCheckQueryOptions,
  getSelfServiceEventsQueryOptions,
  getSelfServiceRegistrationsQueryOptions,
} from "#src/selfservice/queries.js"
import {
  Event,
  RegistrationListResponse,
  SelfServiceAPI,
} from "#src/selfservice/types.js"
import { NotFoundError, useRequiredContext } from "#src/utils.js"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useSelfServiceEvent = (eventId: string): Event => {
  const events = useSelfServiceEvents()
  const event = events.get(eventId)
  if (event != null) {
    return event
  } else {
    throw new NotFoundError()
  }
}

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

export const useAccessCodeCheck = (
  eventId: string,
  accessCode: string,
): boolean => {
  const api = useSelfServiceAPI()
  const options = getSelfServiceAccessCodeCheckQueryOptions(
    api,
    eventId,
    accessCode,
  )
  const query = useSuspenseQuery(options)
  return query.data
}

export const useSelfServiceAPI = (): SelfServiceAPI =>
  useRequiredContext(SelfServiceAPIContext)
