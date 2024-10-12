import {
  Registration,
  RegistrationAPI,
} from "#src/features/registration/types.js"
import { createOptionalContext, useRequiredContext } from "#src/utils.js"
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"

const DEBOUNCE_DELAY = 500

export const RegistrationAPIContext = createOptionalContext<RegistrationAPI>()

/**
 * Get a query for registration search results. Debounces search updates.
 */
export const useDebouncedRegistrationSearchResults = (
  eventId: string,
  search?: string,
  includeAll = false,
  options?: { disabled?: boolean },
): UseInfiniteQueryResult<InfiniteData<Registration[]>> => {
  const debounce = useRef<{
    timeout: number | null
    value: string | undefined
  }>({ timeout: null, value: search })
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  const update = useCallback(() => {
    setDebouncedSearch(debounce.current.value)
    debounce.current.timeout = null
  }, [])

  useEffect(() => {
    debounce.current.value = search
    if (debounce.current.timeout == null) {
      debounce.current.timeout = window.setTimeout(
        () => update(),
        DEBOUNCE_DELAY,
      )
    }
  }, [search])

  return useRegistrationSearchResults(
    eventId,
    debouncedSearch,
    includeAll,
    options,
  )
}

/**
 * Get a query for registration search results.
 */
export const useRegistrationSearchResults = (
  eventId: string,
  search?: string,
  includeAll = false,
  options?: { disabled?: boolean },
): UseInfiniteQueryResult<InfiniteData<Registration[]>> => {
  const api = useRequiredContext(RegistrationAPIContext)
  return useInfiniteQuery({
    enabled: !options?.disabled,
    queryKey: ["events", eventId, "registrations", { search, includeAll }],
    async queryFn({ pageParam }) {
      return await api.list(eventId, search, includeAll, pageParam || undefined)
    },
    initialPageParam: "",
    getNextPageParam(lastPage) {
      if (lastPage.length > 0) {
        return lastPage[lastPage.length - 1].date_created
      } else {
        return null
      }
    },
  })
}
