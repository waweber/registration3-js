import { Meta, StoryObj } from "@storybook/react"
import { PaymentModal } from "./PaymentModal.js"
import { useCallback, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Button, Stack } from "@mantine/core"
import {
  PaymentAPIContext,
  PaymentContext,
  PaymentResult,
  makeMockPaymentAPI,
  usePayment,
  usePaymentAPI,
} from "#src/features/payment/index.js"
import { makeMockCartAPI } from "@open-event-systems/registration-lib/cart"

const meta: Meta<typeof PaymentModal> = {
  component: PaymentModal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const [queryClient] = useState(() => new QueryClient())
      const [cartAPI] = useState(() => makeMockCartAPI())
      const [paymentAPI] = useState(() => makeMockPaymentAPI(cartAPI))
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

export const Default: StoryObj<typeof PaymentModal> = {
  render() {
    const paymentAPI = usePaymentAPI()
    const [paymentId, setPaymentId] = useState<string | null>(null)
    const [payment, setPayment] = useState<PaymentResult | null>(null)
    const [show, setShow] = useState(false)

    const paymentHook = usePayment({
      paymentId,
      result: payment,
      onClose: useCallback(() => {
        setShow(false)
      }, []),
    })
    const { Component } = paymentHook

    return (
      <Stack p="xs">
        <Button
          onClick={() => {
            setPaymentId("1")
            setPayment(null)
            setShow(true)
            paymentAPI.createPayment("1", "mock").then((p) => setPayment(p))
          }}
        >
          Show
        </Button>
        <PaymentContext.Provider value={paymentHook}>
          <Component>
            {(renderProps) => <PaymentModal {...renderProps} opened={show} />}
          </Component>
        </PaymentContext.Provider>
      </Stack>
    )
  },
}
