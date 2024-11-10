import { Box, Button, ButtonProps, Skeleton, Text } from "@mantine/core"
import { PaymentServiceComponentProps } from "#src/features/payment/index.js"
import { usePaymentManagerContext } from "@open-event-systems/registration-lib/payment"

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
  const { close } = usePaymentManagerContext()
  return (
    <Button onClick={() => close()} variant="outline" {...props}>
      Close
    </Button>
  )
}
