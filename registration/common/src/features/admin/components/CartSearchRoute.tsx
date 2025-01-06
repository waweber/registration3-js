import {
  adminCartRoute,
  adminCartSearchRoute,
} from "#src/app/routes/admin/cart.js"
import { Title } from "#src/components/index.js"
import { CartSearch } from "#src/features/admin/components/cart-search/CartSearch.js"
import { Stack } from "@mantine/core"
import { useCartSearch } from "@open-event-systems/registration-lib/payment"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { MouseEvent, useCallback, useState } from "react"

export const CartSearchRoute = () => {
  const { eventId } = adminCartSearchRoute.useParams()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const router = useRouter()
  const getHref = useCallback(
    (id: string) => {
      return router.buildLocation({
        to: adminCartRoute.to,
        params: {
          eventId,
        },
        hash: `c=${id}`,
      }).href
    },
    [navigate],
  )
  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      navigate({
        to: adminCartRoute.to,
        params: {
          eventId,
        },
        hash: `c=${id}`,
      })
    },
    [navigate],
  )
  const results = useCartSearch(eventId, search)

  return (
    <Title title="Cart">
      <Stack>
        <CartSearch
          onSearch={(q) => setSearch(q)}
          getHref={getHref}
          onClick={onClick}
          results={results}
        />
      </Stack>
    </Title>
  )
}
