import { Box, Button, ButtonProps, Skeleton, Text } from "@mantine/core"
import {
  PaymentServiceComponentProps,
  usePaymentContext,
} from "#src/features/payment/index.js"

export const PaymentPlaceholder = ({
  children,
}: PaymentServiceComponentProps) =>
  children({
    content: (
      <Box>
        <Skeleton h={36} />
        <Skeleton mt="0.625rem" h={36} />
      </Box>
    ),
  })

export const PaymentComplete = () => <Text span>Your payment is complete.</Text>

export const PaymentCloseButton = (props: ButtonProps) => {
  const { close } = usePaymentContext()
  return (
    <Button onClick={() => close()} variant="outline" {...props}>
      Close
    </Button>
  )
}
