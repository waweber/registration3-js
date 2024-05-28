import { Meta, StoryObj } from "@storybook/react"
import { Payment } from "./Payment.js"
import { useEffect, useState } from "react"
import { makeMockPaymentAPI } from "../../mock.js"
import { makeMockCartAPI } from "@open-event-systems/registration-common"
import { PaymentAPIContext, usePaymentAPI } from "../../api.js"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box } from "@mantine/core"
import { PaymentResult } from "../../types.js"

const meta: Meta<typeof Payment> = {
  component: Payment,
  decorators: [
    (Story) => {
      const [cartAPI] = useState(() => makeMockCartAPI())
      const [paymentAPI] = useState(() => makeMockPaymentAPI(cartAPI))
      const [queryClient] = useState(() => new QueryClient())
      return (
        <QueryClientProvider client={queryClient}>
          <PaymentAPIContext.Provider value={paymentAPI}>
            <Story />
          </PaymentAPIContext.Provider>
        </QueryClientProvider>
      )
    },
  ],
}

export default meta

export const Default: StoryObj<typeof Payment> = {
  render() {
    const paymentAPI = usePaymentAPI()
    const [payment, setPayment] = useState<PaymentResult | null>(null)
    useEffect(() => {
      paymentAPI.createPayment("1", "mock").then((r) => {
        setPayment(r)
      })
    }, [])
    return (
      <Box w={300}>
        <Payment
          paymentId="1"
          payment={payment}
          // payment={{
          //   id: "1",
          //   service: "mock",
          //   status: "pending",
          //   body: {
          //     total_price: 1234,
          //     total_price_string: "12.34",
          //     currency: "USD",
          //   },
          // }}
        />
      </Box>
    )
  },
}
