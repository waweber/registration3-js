import {
  Group,
  LoadingOverlay,
  Modal,
  ModalProps,
  Stack,
  Text,
  useProps,
} from "@mantine/core"
import clsx from "clsx"
import { PaymentServiceRenderProps } from "../../types.js"
import { usePaymentContext } from "../../hooks/payment.js"

export type PaymentModalProps = Omit<
  ModalProps,
  "children" | "content" | "onClose"
> &
  PaymentServiceRenderProps

export const PaymentModal = (props: PaymentModalProps) => {
  const { className, content, controls, ...other } = useProps(
    "PaymentModal",
    {},
    props,
  )
  const { error, submitting, close } = usePaymentContext()

  return (
    <Modal
      className={clsx("PaymentModal-root", className)}
      title="Payment"
      onClose={() => {
        if (submitting) {
          return
        }

        close()
      }}
      centered
      {...other}
    >
      <Stack>
        {content}
        {error && (
          <Text span c="red" size="sm">
            {error}
          </Text>
        )}
        {controls && <Group justify="flex-end">{controls}</Group>}
      </Stack>
      <LoadingOverlay visible={submitting} />
    </Modal>
  )
}
