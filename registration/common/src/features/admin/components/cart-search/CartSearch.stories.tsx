import { CartSearch } from "#src/features/admin/components/cart-search/CartSearch.js"
import { Stack } from "@mantine/core"
import { PaymentSearchResult } from "@open-event-systems/registration-lib/payment"
import { Meta, StoryObj } from "@storybook/react"
import { useCallback, useState } from "react"
import "./CartSearch.scss"

const meta: Meta<typeof CartSearch> = {
  component: CartSearch,
}

export default meta

export const Default: StoryObj<typeof CartSearch> = {
  render() {
    const [results, setResults] = useState<PaymentSearchResult[]>([])
    const search = useCallback(
      (query: string) => {
        window.setTimeout(() => {
          setResults([
            {
              id: "1",
              external_id: "1",
              service_name: "suspend",
              status: "canceled",
              cart_id: "1",
              cart_data: {
                event_id: "example-event",
                registrations: [
                  {
                    id: "1",
                    old: {},
                    new: {
                      first_name: "Test",
                      last_name: "Person1",
                    },
                  },
                ],
              },
              receipt_id: null,
              date_created: "2020-01-01T12:00:00-05:00",
              date_closed: "2020-01-01T12:00:00-05:00",
            },
            {
              id: "2",
              external_id: "2",
              service_name: "suspend",
              status: "canceled",
              cart_id: "2",
              cart_data: {
                event_id: "example-event",
                registrations: [
                  {
                    id: "1",
                    old: {},
                    new: {
                      last_name: "Person1",
                      email: "test@example.net",
                    },
                  },
                  {
                    id: "1",
                    old: {},
                    new: {
                      last_name: "Person2",
                      email: "test@example.net",
                    },
                  },
                ],
              },
              receipt_id: null,
              date_created: "2020-01-02T12:12:00-05:00",
              date_closed: "2020-01-02T12:12:00-05:00",
            },
          ])
        }, 150)
      },
      [setResults],
    )
    return (
      <Stack w={500}>
        <CartSearch
          onSearch={search}
          results={results}
          getHref={() => ""}
          onClick={(e) => e.preventDefault()}
        />
      </Stack>
    )
  },
}
