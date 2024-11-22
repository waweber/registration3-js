import { RegistrationAPIContext } from "#src/registration/providers.js"
import {
  getRegistrationsByCheckInIdQueryOptions,
  getRegistrationSearchQueryOptions,
} from "#src/registration/queries.js"
import {
  Registration,
  RegistrationAPI,
  RegistrationCheckInInfo,
  RegistrationSearchOptions,
} from "#src/registration/types.js"
import { useRequiredContext } from "#src/utils.js"
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query"

export const useRegistrationAPI = (): RegistrationAPI =>
  useRequiredContext(RegistrationAPIContext)

export const useRegistrationSearch = (
  eventId: string,
  query?: string,
  options?: RegistrationSearchOptions,
  enabled = false,
): UseInfiniteQueryResult<InfiniteData<Registration[]>> => {
  const queryOpts = getRegistrationSearchQueryOptions(eventId, query, options)
  return useInfiniteQuery({
    ...queryOpts,
    enabled: enabled,
  })
}

export const useRegistrationsByCheckInId = (
  eventId: string,
): RegistrationCheckInInfo[] => {
  const opts = getRegistrationsByCheckInIdQueryOptions(eventId)
  const query = useSuspenseQuery(opts)
  return query.data
}
