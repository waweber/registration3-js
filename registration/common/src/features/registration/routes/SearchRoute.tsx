import { registrationSearchRoute } from "#src/app/routes/registration/search.js"
import {
  RegistrationSearchFilters,
  RegistrationSearchFilterValues,
} from "#src/features/registration/components/search/RegistrationSearchFilters.js"
import { RegistrationSearchResults } from "#src/features/registration/components/search/RegistrationSearchResults.js"
import { useDebouncedRegistrationSearchResults } from "#src/features/registration/queries.js"
import { Registration } from "#src/features/registration/types.js"
import { Stack } from "@mantine/core"
import { useReducer, useRef } from "react"

export const RegistrationSearchRoute = () => {
  const { eventId } = registrationSearchRoute.useParams()
  const initial = useRef(true)
  const prevResults = useRef<Registration[]>([])
  const [values, dispatch] = useReducer(reducer, {
    eventId,
    search: "",
    includeAll: false,
  })
  const results = useDebouncedRegistrationSearchResults(
    eventId,
    values.search,
    values.includeAll,
    {
      disabled: (!values.search || values.search.length < 2) && initial.current,
    },
  )

  const allResults = []
  for (const page of results.data?.pages ?? []) {
    allResults.push(...page)
  }

  if (results.isFetched) {
    initial.current = false
    prevResults.current = allResults
  }

  return (
    <Stack>
      <RegistrationSearchFilters value={values} onChange={dispatch} />
      {!initial.current &&
        (prevResults.current.length > 0 ? (
          <RegistrationSearchResults
            results={prevResults.current}
            showMore={results.hasNextPage}
            onMore={() => results.fetchNextPage()}
          />
        ) : (
          <RegistrationSearchResults.NoResults />
        ))}
    </Stack>
  )
}

const reducer = (
  state: RegistrationSearchFilterValues,
  action: Partial<RegistrationSearchFilterValues>,
): RegistrationSearchFilterValues => {
  return { ...state, ...action }
}
