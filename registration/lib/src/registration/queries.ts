import { useRegistrationAPI } from "#src/registration/hooks.js"
import {
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
  RegistrationResponse[],
  Error,
  InfiniteData<RegistrationResponse[]>,
  RegistrationResponse[],
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
      prev.length > 0
        ? [
            prev[prev.length - 1].registration.date_created,
            prev[prev.length - 1].registration.id,
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
