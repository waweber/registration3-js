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
