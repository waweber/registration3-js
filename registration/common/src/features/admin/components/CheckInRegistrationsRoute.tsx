import {
  adminRegistrationRoute,
  adminRegistrationsRoute,
  checkInRegistrationRoute,
  checkInRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { Title } from "#src/components/index.js"
import { RecentRegistration } from "#src/features/admin/components/recent/RecentRegistration.js"
import { RegistrationSearch } from "#src/features/admin/components/search/RegistrationSearch.js"
import { Divider, Grid, Stack, Text } from "@mantine/core"
import {
  getRegistrationName,
  RegistrationSearchOptions,
  useRegistrationsByCheckInId,
  useRegistrationSearch,
} from "@open-event-systems/registration-lib/registration"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useState } from "react"

export const CheckInRegistrationsRoute = () => {
  const { eventId } = checkInRegistrationsRoute.useParams()
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<RegistrationSearchOptions>({})
  const [enabled, setEnabled] = useState(false)
  const results = useRegistrationSearch(eventId, query, options, enabled)
  const router = useRouter()
  const navigate = checkInRegistrationsRoute.useNavigate()
  const enterRef = useRef(false)

  const allData = useMemo(
    () => results.data?.pages.reduce((prev, cur) => [...prev, ...cur], []),
    [results.data],
  )

  useEffect(() => {
    if (allData?.length == 1 && enterRef.current) {
      navigate({
        to: checkInRegistrationRoute.to,
        params: {
          eventId: eventId,
          registrationId: allData[0].registration.id,
        },
      })
    }
    enterRef.current = false
  }, [allData])

  return (
    <Title title="Registrations">
      <Stack>
        <RegistrationSearch
          onSearch={(query, options) => {
            setQuery(query)
            setOptions(options)
            setEnabled(true)
          }}
          onEnter={(query, options) => {
            setQuery(query)
            setOptions(options)
            enterRef.current = true
          }}
          results={
            allData
              ? allData.map((r) => ({
                  id: r.registration.id,
                  name: getRegistrationName(r.registration),
                  email: r.registration.email,
                  number: r.registration.number,
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
        {results.data == null && !enabled ? (
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
