import {
  adminAddRegistrationRoute,
  adminRegistrationRoute,
  adminRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { Title } from "#src/components/index.js"
import { RegistrationSearch } from "#src/features/admin/components/search/RegistrationSearch.js"
import { getDefaultUpdateURL } from "#src/utils.js"
import { Select, Stack } from "@mantine/core"
import { useAdminAPI } from "@open-event-systems/registration-lib/admin"
import {
  getInterviewStateQueryOptions,
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"
import {
  getRegistrationName,
  RegistrationSearchOptions,
  useRegistrationSearch,
} from "@open-event-systems/registration-lib/registration"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useState } from "react"

export const RegistrationsRoute = () => {
  const { eventId } = adminRegistrationsRoute.useParams()
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<RegistrationSearchOptions>({})
  const results = useRegistrationSearch(eventId, query, options, true)
  const router = useRouter()
  const navigate = adminRegistrationsRoute.useNavigate()
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const adminAPI = useAdminAPI()
  const queryClient = useQueryClient()
  const enterRef = useRef(false)

  const allResults = useMemo(
    () =>
      results.data?.pages
        .map((p) => p.registrations)
        .reduce((prev, cur) => [...prev, ...cur]),
    [results.data],
  )

  const addOptions = useMemo(
    () => results.data?.pages[results.data.pages.length - 1].add_options,
    [results.data],
  )

  useEffect(() => {
    if (allResults?.length == 1 && enterRef.current) {
      navigate({
        to: adminRegistrationRoute.to,
        params: {
          eventId: eventId,
          registrationId: allResults[0].registration.id,
        },
      })
    }
    enterRef.current = false
  }, [allResults])

  return (
    <Title title="Registrations">
      <Stack>
        <RegistrationSearch
          onSearch={(query, options) => {
            setQuery(query)
            setOptions(options)
          }}
          onEnter={(query, options) => {
            setQuery(query)
            setOptions(options)
            enterRef.current = true
          }}
          results={
            allResults
              ? allResults.map((r) => ({
                  id: r.registration.id,
                  name: getRegistrationName(r.registration),
                  email: r.registration.email,
                  number: r.registration.number,
                }))
              : undefined
          }
          getHref={(res) =>
            router.buildLocation({
              to: adminRegistrationRoute.to,
              params: {
                eventId: eventId,
                registrationId: res.id,
              },
            }).href
          }
          onClick={(e, res) => {
            e.preventDefault()
            navigate({
              to: adminRegistrationRoute.to,
              params: {
                eventId: eventId,
                registrationId: res.id,
              },
            })
          }}
        />
        {addOptions && addOptions.length > 0 && (
          <Select
            data={addOptions?.map((o) => ({
              label: o.title,
              value: o.url,
            }))}
            value=""
            placeholder="Add Registration"
            onChange={(v) => {
              if (v) {
                adminAPI
                  .startInterview(v)
                  .then((res) => {
                    return interviewAPI.update(res)
                  })
                  .then((res) => {
                    const record = interviewStore.add(res)
                    queryClient.setQueryData(
                      getInterviewStateQueryOptions(
                        interviewAPI,
                        interviewStore,
                        getDefaultUpdateURL(),
                        record.response.state,
                      ).queryKey,
                      record,
                    )
                    navigate({
                      to: adminAddRegistrationRoute.to,
                      params: {
                        eventId: eventId,
                      },
                      hash: `s=${record.response.state}`,
                    })
                  })
              }
            }}
          />
        )}
      </Stack>
    </Title>
  )
}
