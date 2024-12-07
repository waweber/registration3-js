import {
  adminRegistrationRoute,
  adminRegistrationsRoute,
} from "#src/app/routes/admin/registrations.js"
import { Title } from "#src/components/index.js"
import { RegistrationSearch } from "#src/features/admin/components/search/RegistrationSearch.js"
import { Stack } from "@mantine/core"
import {
  getRegistrationName,
  RegistrationSearchOptions,
  useRegistrationSearch,
} from "@open-event-systems/registration-lib/registration"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useState } from "react"

export const RegistrationsRoute = () => {
  const { eventId } = adminRegistrationsRoute.useParams()
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<RegistrationSearchOptions>({})
  const [enabled, setEnabled] = useState(false)
  const results = useRegistrationSearch(eventId, query, options, enabled)
  const router = useRouter()
  const navigate = adminRegistrationsRoute.useNavigate()
  const enterRef = useRef(false)

  const allData = useMemo(
    () => results.data?.pages.reduce((prev, cur) => [...prev, ...cur], []),
    [results.data],
  )

  useEffect(() => {
    if (allData?.length == 1 && enterRef.current) {
      navigate({
        to: adminRegistrationRoute.to,
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
      </Stack>
    </Title>
  )
}