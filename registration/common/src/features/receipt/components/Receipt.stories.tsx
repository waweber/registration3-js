import { Box } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"
import { parseISO } from "date-fns"

import "./Receipt.scss"
import { Receipt } from "#src/features/receipt/components/Receipt.js"

const meta: Meta<typeof Receipt> = {
  component: Receipt,
}

export default meta

export const Default: StoryObj<typeof Receipt> = {
  decorators: [
    (Story) => (
      <Box maw={500}>
        <Story />
      </Box>
    ),
  ],
  args: {
    receiptId: "ABCD1234AAAA",
    date: parseISO("2020-05-15T15:00:00-04:00"),
    receiptUrl: window.location.href,
    pricingResult: {
      currency: "USD",
      registrations: [
        {
          id: "r1",
          name: "Person 1",
          line_items: [
            {
              name: "Standard",
              description: "Standard registration.",
              price: 5000,
              modifiers: [{ name: "Early Bird Discount", amount: -500 }],
              total_price: 4500,
            },
            {
              name: "VIP Upgrade",
              description: "Extra stuff",
              price: 2500,
              modifiers: [{ name: "Early Bird Discount", amount: -500 }],
              total_price: 2000,
            },
          ],
          total_price: 6500,
        },
        {
          id: "r2",
          name: "Person 2",
          line_items: [
            {
              name: "Standard",
              description: "Standard registration.",
              price: 5000,
              modifiers: [{ name: "Early Bird Discount", amount: -500 }],
              total_price: 4500,
            },
          ],
          total_price: 4500,
        },
      ],
      total_price: 11000,
    },
  },
  render(args) {
    return <Receipt {...args} />
  },
}
