import { Meta, StoryObj } from "@storybook/react"
import { PaymentModal } from "./PaymentModal.js"
import { Suspense, useCallback, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Button, Stack } from "@mantine/core"
import {
  makeMockPaymentAPI,
  PaymentAPIProvider,
  PaymentManager,
  PaymentManagerProvider,
  useCreatePayment,
  usePayment,
  usePaymentManager,
} from "@open-event-systems/registration-lib/payment"
import { useStickyData } from "@open-event-systems/registration-lib/utils"
import { usePaymentMethodsDialog } from "#src/features/payment/hooks.js"

const meta: Meta<typeof PaymentModal> = {
  component: PaymentModal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const [queryClient] = useState(() => new QueryClient())
      const [paymentAPI] = useState(() => makeMockPaymentAPI())
      return (
        <QueryClientProvider client={queryClient}>
          <PaymentAPIProvider value={paymentAPI}>
            <Story />
          </PaymentAPIProvider>
        </QueryClientProvider>
      )
    },
  ],
}

export default meta

export const Default: StoryObj<typeof PaymentModal> = {
  decorators: [
    (Story) => (
      <Suspense fallback={<>Loading...</>}>
        <Story />
      </Suspense>
    ),
  ],
  render() {
    const [paymentId, setPaymentId] = useState<string | null>(null)
    const [show, setShow] = useState(false)

    const createPayment = useCreatePayment("cart")
    const [stickyPaymentId, disposePaymentId] = useStickyData(paymentId)
    const methods = usePaymentMethodsDialog({
      cartId: "cart",
      onShow() {
        setShow(true)
      },
      onSelect(optionId) {
        setShow(true)
        createPayment(optionId).then((res) => {
          setPaymentId(res.id)
        })
      },
    })

    const payment = usePayment(stickyPaymentId)

    const paymentManager = usePaymentManager({
      payment,
      onClose: useCallback(
        (paymentManager: PaymentManager) => {
          setShow(false)
          if (paymentManager.payment?.status == "pending") {
            paymentManager.cancel()
          }
        },
        [setShow],
      ),
    })

    return (
      <PaymentManagerProvider value={paymentManager}>
        <Stack p="xs">
          <Button
            maw={100}
            onClick={() => {
              methods.show()
              disposePaymentId()
              setPaymentId(null)
            }}
          >
            Show
          </Button>
          <PaymentModal
            cartId="cart"
            opened={show}
            methods={methods.methods}
            onSelectMethod={methods.select}
          />
        </Stack>
      </PaymentManagerProvider>
    )
  },
}
