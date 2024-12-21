import {
  checkInRegistrationRoute,
  checkInRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { Title } from "#src/components/index.js"
import { RecentRegistration } from "#src/features/admin/components/recent/RecentRegistration.js"
import { RegistrationSearch } from "#src/features/admin/components/search/RegistrationSearch.js"
import { Divider, Grid, Stack, Text } from "@mantine/core"
import {
  getRegistrationName,
  getRegistrationSearchQueryOptions,
  RegistrationListResponseItem,
  RegistrationSearchOptions,
  useRegistrationAPI,
  useRegistrationsByCheckInId,
  useRegistrationSearch,
} from "@open-event-systems/registration-lib/registration"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export const CheckInRegistrationsRoute = () => {
  const { eventId } = checkInRegistrationsRoute.useParams()
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<RegistrationSearchOptions>({})
  const [enabled, setEnabled] = useState(false)
  const results = useRegistrationSearch(eventId, query, options, enabled)
  const router = useRouter()
  const navigate = checkInRegistrationsRoute.useNavigate()
  const registrationAPI = useRegistrationAPI()
  const queryClient = useQueryClient()

  const allResults = useMemo(
    () =>
      results.data?.pages
        .map((p) => p.registrations)
        .reduce((prev, cur) => [...prev, ...cur]),
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
      const exactMatches = getExactMatches(query, allData)
      if (exactMatches.length == 1) {
        navigate({
          to: checkInRegistrationRoute.to,
          params: {
            eventId: eventId,
            registrationId: exactMatches[0].registration.id,
          },
        })
      } else if (allData.length == 1) {
        navigate({
          to: checkInRegistrationRoute.to,
          params: {
            eventId: eventId,
            registrationId: allData[0].registration.id,
          },
        })
      }
      setQuery(query)
      setOptions(options)
      setEnabled(true)
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
            setEnabled(true)
          }}
          onEnter={onEnter}
          results={
            allResults && enabled
              ? allResults.map((r) => ({
                  id: r.registration.id,
                  status: r.registration.status,
                  name: getRegistrationName(r.registration),
                  email: r.registration.email,
                  number: r.registration.number,
                  options: r.registration.options,
                  nickname: r.registration.nickname,
                }))
              : undefined
          }
          getHref={(res) =>
            router.buildLocation({
              to: checkInRegistrationRoute.to,
              params: {
                eventId: eventId,
                registrationId: res.id,
              },
            }).href
          }
          onClick={(e, res) => {
            e.preventDefault()
            navigate({
              to: checkInRegistrationRoute.to,
              params: {
                eventId: eventId,
                registrationId: res.id,
              },
            })
          }}
        />
        {!enabled ? (
          <>
            <Divider />
            <Text c="dimmed">In Progress</Text>
            <Recents eventId={eventId} />
          </>
        ) : null}
      </Stack>
    </Title>
  )
}

const Recents = ({ eventId }: { eventId: string }) => {
  const byCheckInId = useRegistrationsByCheckInId(eventId)
  const router = useRouter()
  const navigate = checkInRegistrationsRoute.useNavigate()

  return (
    <Grid>
      {byCheckInId.map((r) => (
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }} key={r.registration.id}>
          <RecentRegistration
            checkInId={r.registration.check_in_id}
            name={getRegistrationName(r.registration)}
            number={r.registration.number}
            nickname={r.registration.nickname}
            description={r.summary}
            href={
              router.buildLocation({
                to: checkInRegistrationRoute.to,
                params: { eventId: eventId, registrationId: r.registration.id },
              }).href
            }
            onClick={(e) => {
              e.preventDefault()
              navigate({
                to: checkInRegistrationRoute.to,
                params: {
                  eventId,
                  registrationId: r.registration.id,
                },
              })
            }}
          />
        </Grid.Col>
      ))}
    </Grid>
  )
}

const getExactMatches = (
  query: string,
  results: RegistrationListResponseItem[],
) => {
  const q = query.toLowerCase()
  return results.filter(
    (r) =>
      (r.registration.check_in_id &&
        r.registration.check_in_id.toLowerCase() == q) ||
      (r.registration.number != null && String(r.registration.number) == q) ||
      (r.registration.other_ids &&
        q &&
        r.registration.other_ids.map((id) => id.toLowerCase()).includes(q)),
  )
}
