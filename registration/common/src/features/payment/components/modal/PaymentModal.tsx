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
  PaymentManagerProvider,
  PaymentMethod,
  usePayment,
  usePaymentManager,
  usePaymentManagerContext,
} from "@open-event-systems/registration-lib/payment"
import { Suspense, useEffect, useRef } from "react"

export type PaymentModalProps = {
  cartId: string
  methods: PaymentMethod[]
  paymentId?: string | null
  opened: boolean
  onSelectMethod?: (method: string) => void
  onComplete?: () => void
  onClose?: () => void
  cartError?: string | string[] | null
} & ModalProps

export const PaymentModal = (props: PaymentModalProps) => {
  const {
    cartId,
    methods,
    paymentId,
    opened,
    onSelectMethod,
    onComplete,
    onClose,
    cartError,
    ...other
  } = props

  const closedRef = useRef(false)
  const payment = usePayment(paymentId)
  const manager = usePaymentManager({
    payment,
    onComplete: onComplete,
    onClose: () => {
      onClose && onClose()
    },
  })

  let content

  if (cartError != null) {
    if (Array.isArray(cartError)) {
      content = (
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
      content = <span>{cartError}</span>
    }
  } else if (paymentId || methods.length == 1) {
    content = (
      <PaymentManagerProvider value={manager}>
        <PaymentModal.Payment />
      </PaymentManagerProvider>
    )
  } else {
    content = (
      <PaymentModal.Methods
        methods={methods}
        onSelect={(id) => onSelectMethod && onSelectMethod(id)}
      />
    )
  }

  useEffect(() => {
    if (!opened) {
      if (!closedRef.current) {
        manager.cancel()
      }
      closedRef.current = false
    }
  }, [opened, manager.cancel])

  return (
    <Modal
      title="Payment"
      opened={opened}
      onClose={() => {
        closedRef.current = true
        manager.close()
      }}
      centered
      {...other}
    >
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

const Methods = ({
  methods,
  onSelect,
}: {
  methods: PaymentMethod[]
  onSelect: (optionId: string) => void
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
