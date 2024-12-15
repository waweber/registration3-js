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
  getRegistrationSearchQueryOptions,
  RegistrationSearchOptions,
  useRegistrationAPI,
  useRegistrationSearch,
} from "@open-event-systems/registration-lib/registration"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"

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
  const registrationAPI = useRegistrationAPI()
  const queryClient = useQueryClient()

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

  const onEnter = useCallback(
    async (query: string, options: RegistrationSearchOptions) => {
      const opts = getRegistrationSearchQueryOptions(
        registrationAPI,
        eventId,
        query,
        options,
      )
      const data = await queryClient.ensureInfiniteQueryData(opts)
      const allData = data.pages
        .map((p) => p.registrations)
        .reduce((p, c) => [...c, ...p])
      if (allData.length == 1) {
        navigate({
          to: adminRegistrationRoute.to,
          params: {
            eventId: eventId,
            registrationId: allData[0].registration.id,
          },
        })
      }
      setQuery(query)
      setOptions(options)
    },
    [eventId, registrationAPI, queryClient, navigate],
  )

  return (
    <Title title="Registrations">
      <Stack>
        <RegistrationSearch
          onSearch={(query, options) => {
            setQuery(query)
            setOptions(options)
          }}
          onEnter={onEnter}
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
