import { useRegistrationAPI } from "#src/registration/hooks.js"
import {
  Registration,
  RegistrationCheckInInfo,
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
  Registration[],
  Error,
  InfiniteData<Registration[]>,
  Registration[],
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
        ? [prev[prev.length - 1].date_created, prev[prev.length - 1].id]
        : null,
    placeholderData: (prev) => {
      return prev
    },
  }
}

export const getRegistrationsByCheckInIdQueryOptions = (
  eventId: string,
): UseSuspenseQueryOptions<RegistrationCheckInInfo[]> => {
  const registrationAPI = useRegistrationAPI()
  return {
    queryKey: ["events", eventId, "registrations", "by-check-in-id"],
    async queryFn() {
      return registrationAPI.listRegistrationsByCheckInId(eventId)
    },
  }
}
