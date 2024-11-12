import { Options } from "#src/components/index.js"
import { PaymentPlaceholder } from "#src/features/payment/components/payment/Payment.js"
import { usePaymentComponent } from "#src/features/payment/services/index.js"
import {
  Group,
  LoadingOverlay,
  Modal,
  ModalProps,
  Stack,
  Text,
} from "@mantine/core"
import {
  PaymentMethod,
  usePaymentManagerContext,
} from "@open-event-systems/registration-lib/payment"
import { Suspense } from "react"

export type PaymentModalProps = {
  cartId: string
  methods: PaymentMethod[]
  onSelectMethod?: (method: string) => void
  cartError?: string | string[] | null
} & Omit<ModalProps, "onClose">

export const PaymentModal = (props: PaymentModalProps) => {
  const { cartId, methods, onSelectMethod, cartError, ...other } = props

  const manager = usePaymentManagerContext()

  let title = "Payment"
  let content

  if (cartError) {
    title = "Error"
    content = <PaymentModal.Error cartError={cartError} />
  } else if (manager.payment || methods.length == 1) {
    content = <PaymentModal.Payment />
  } else {
    content = (
      <PaymentModal.Methods
        methods={methods}
        onSelect={(id) => onSelectMethod && onSelectMethod(id)}
      />
    )
  }

  return (
    <Modal title={title} centered onClose={() => manager.close()} {...other}>
      <Suspense fallback={<PaymentModal.Placeholder />}>{content}</Suspense>
      <LoadingOverlay visible={manager.submitting} />
    </Modal>
  )
}

const Placeholder = () => {
  return (
    <PaymentPlaceholder>
      {(renderProps) => <>{renderProps.content}</>}
    </PaymentPlaceholder>
  )
}

PaymentModal.Placeholder = Placeholder

const Error = ({ cartError }: { cartError: string | string[] }) => {
  if (Array.isArray(cartError)) {
    return (
      <>
        <span>Checkout cannot be completed:</span>
        <ul>
          {cartError.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </>
    )
  } else {
    return <span>{cartError}</span>
  }
}

PaymentModal.Error = Error

const Methods = ({
  methods,
  onSelect,
}: {
  methods: PaymentMethod[]
  onSelect: (id: string) => void
}) => {
  return (
    <Options
      options={methods.map((m) => ({
        id: m.id,
        label: m.name,
        button: true,
      }))}
      onSelect={onSelect}
    />
  )
}

PaymentModal.Methods = Methods

const Payment = () => {
  const manager = usePaymentManagerContext()
  const Component = usePaymentComponent(manager.payment?.service)

  if (Component) {
    return (
      <Component>
        {(renderProps) => (
          <>
            <Stack>
              {renderProps.content}
              {manager.error && (
                <Text span c="red" size="sm">
                  {manager.error}
                </Text>
              )}
              {renderProps.controls && (
                <Group justify="flex-end">{renderProps.controls}</Group>
              )}
            </Stack>
          </>
        )}
      </Component>
    )
  } else {
    return <PaymentModal.Placeholder />
  }
}

PaymentModal.Payment = Payment
