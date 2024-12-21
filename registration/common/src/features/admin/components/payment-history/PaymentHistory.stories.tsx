import { PaymentHistory } from "#src/features/admin/components/payment-history/PaymentHistory.js"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof PaymentHistory> = {
  component: PaymentHistory,
}

export default meta

export const Default: StoryObj<typeof PaymentHistory> = {
  args: {
    results: [
      {
        id: "2",
        service_name: "Mock",
        date_created: "2020-01-01T12:05:00-05:00",
        date_closed: "2020-01-01T12:06:00-05:00",
        external_id: "123",
        receipt_id: "R2",
        status: "completed",
        payment_url: "#",
      },
      {
        id: "1",
        service_name: "Mock",
        date_created: "2020-01-01T12:00:00-05:00",
        external_id: "120",
        receipt_id: "R1",
        status: "pending",
      },
    ],
  },
}
