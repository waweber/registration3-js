import { RegistrationAPIContext } from "#src/registration/providers.js"
import { getRegistrationSearchQueryOptions } from "#src/registration/queries.js"
import {
  RegistrationAPI,
  RegistrationResponse,
  RegistrationSearchOptions,
} from "#src/registration/types.js"
import { useRequiredContext } from "#src/utils.js"
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query"

export const useRegistrationAPI = (): RegistrationAPI =>
  useRequiredContext(RegistrationAPIContext)

export const useRegistrationSearch = (
  eventId: string,
  query?: string,
  options?: RegistrationSearchOptions,
  enabled = false,
): UseInfiniteQueryResult<InfiniteData<RegistrationResponse[]>> => {
  const queryOpts = getRegistrationSearchQueryOptions(eventId, query, options)
  return useInfiniteQuery({
    ...queryOpts,
    enabled: enabled,
  })
}

export const useRegistrationsByCheckInId = (
  eventId: string,
): RegistrationResponse[] => {
  const opts = getRegistrationSearchQueryOptions(eventId, undefined, {
    check_in_id: "",
  })
  const query = useInfiniteQuery(opts)
  return query.data?.pages[0] ?? []
}
