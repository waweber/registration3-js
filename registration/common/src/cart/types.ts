export type Cart = Readonly<{
  id: string
}>

export type CartPricingResult = Readonly<{
  currency: string
  total_price: number
  registrations: readonly PricingResultRegistration[]
}>

export type PricingResultRegistration = Readonly<{
  id: string
  total_price: number
  line_items: readonly LineItem[]
  name?: string
}>

export type LineItem = Readonly<{
  price: number
  total_price: number
  modifiers: readonly Modifier[]

  name?: string
  description?: string
}>

export type Modifier = Readonly<{
  amount: number
  name?: string
}>

export const cartConflictErrorCode = {
  version: "version",
  status: "status",
  event: "event",
}

export type CartConflictErrorCode = keyof typeof cartConflictErrorCode

export type CartConflictResult = Readonly<{
  change: { readonly id: string }
  errors: readonly CartConflictErrorCode[]
}>

export type CartConflictError = Readonly<{
  results: readonly CartConflictResult[]
}>
