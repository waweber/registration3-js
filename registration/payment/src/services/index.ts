import { ComponentType } from "react"

const paymentComponents: Record<
  string,
  (() => Promise<{ Component: ComponentType }>) | undefined
> = {
  async mock() {
    const mock = await import("./mock/Mock.js")
    return { Component: mock.MockPaymentComponent }
  },
}

/**
 * Get the component for a payment service.
 */
export const getPaymentComponent = async (
  service: string,
): Promise<{ Component: ComponentType }> => {
  const loader = paymentComponents[service]
  if (!loader) {
    throw new Error(`Unsupported payment service: ${service}`)
  }
  return await loader()
}
