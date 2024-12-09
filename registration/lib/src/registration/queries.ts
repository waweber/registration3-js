import { useRegistrationAPI } from "#src/registration/hooks.js"
import {
  RegistrationListResponse,
  RegistrationResponse,
  RegistrationSearchOptions,
} from "#src/registration/types.js"
import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query"

export const getRegistrationSearchQueryOptions = (
  eventId: string,
  query?: string,
  options?: RegistrationSearchOptions,
): UseInfiniteQueryOptions<
  RegistrationListResponse,
  Error,
  InfiniteData<RegistrationListResponse>,
  RegistrationListResponse,
  QueryKey,
  readonly [string, string] | null
> => {
  const registrationAPI = useRegistrationAPI()
  return {
    queryKey: [
      "events",
      eventId,
      "registrations",
      { query: query, ...options },
    ],
    async queryFn({ pageParam }) {
      const fullOpts = { ...options }
      if (pageParam) {
        fullOpts.before = pageParam
      }

      return await registrationAPI.listRegistrations(eventId, query, fullOpts)
    },
    initialPageParam: null,
    getNextPageParam: (prev) =>
      prev.registrations.length > 0
        ? [
            prev.registrations[prev.registrations.length - 1].registration
              .date_created,
            prev.registrations[prev.registrations.length - 1].registration.id,
          ]
        : null,
    placeholderData: (prev) => {
      return prev
    },
  }
}

export const getRegistrationQueryOptions = (
  eventId: string,
  registrationId: string,
): UseSuspenseQueryOptions<RegistrationResponse> => {
  const api = useRegistrationAPI()
  return {
    queryKey: ["events", eventId, "registrations", registrationId],
    async queryFn() {
      return await api.readRegistration(eventId, registrationId)
    },
  }
}
