import { adminCartSearchRoute } from "#src/app/routes/admin/cart.js"
import { Title } from "#src/components/index.js"
import { CartSearch } from "#src/features/admin/components/cart-search/CartSearch.js"
import { Stack } from "@mantine/core"
import { useCartSearch } from "@open-event-systems/registration-lib/payment"
import { useNavigate } from "@tanstack/react-router"
import { MouseEvent, useCallback, useState } from "react"

export const CartSearchRoute = () => {
  const { eventId } = adminCartSearchRoute.useParams()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const getHref = useCallback(
    (id: string) => {
      return "TODO"
    },
    [navigate],
  )
  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: string) => {},
    [],
  )
  const results = useCartSearch(eventId, search)

  return (
    <Title title="Cart">
      <Stack>
        <CartSearch onSearch={(q) => setSearch(q)} results={results} />
      </Stack>
    </Title>
  )
}
