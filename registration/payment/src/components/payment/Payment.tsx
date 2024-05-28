import {
  ComponentType,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"
import { PaymentContextProvider, usePaymentContext } from "../../context.js"
import { PaymentResult } from "../../types.js"
import { getPaymentComponent } from "../../services/index.js"

import { LoadingOverlay, Skeleton, Text } from "@mantine/core"

export type PaymentProps = {
  paymentId?: string | null
  payment?: PaymentResult | null
}

export const Payment = ({ paymentId, payment }: PaymentProps) => {
  return (
    <PaymentContextProvider
      key={paymentId}
      paymentId={paymentId}
      payment={payment}
    >
      <PaymentComponent />
    </PaymentContextProvider>
  )
}

const PaymentComponent = () => {
  const { submitting, result } = usePaymentContext()
  const service = result?.service
  const [component, setComponent] = useState<{ Component: ComponentType }>(
    () => {
      return { Component: () => <PaymentPlaceholder /> }
    },
  )

  useEffect(() => {
    if (service) {
      getPaymentComponent(service).then((component) => setComponent(component))
    }
  }, [service])

  return (
    <>
      <component.Component />
      <LoadingOverlay visible={submitting} />
    </>
  )
}

const PaymentPlaceholder = () => {
  return (
    <>
      <Skeleton h={40} />
      <Skeleton mt={8} h={40} />
    </>
  )
}

const PaymentComplete = () => {
  return <Text component="p">Your payment is complete.</Text>
}

const PaymentCanceled = () => {
  return <Text component="p">Payment canceled.</Text>
}

Payment.Placeholder = PaymentPlaceholder
Payment.Complete = PaymentComplete
Payment.Canceled = PaymentCanceled
