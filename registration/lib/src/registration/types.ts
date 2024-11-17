export const RegistrationStatus = {
  pending: "pending",
  created: "created",
  canceled: "canceled",
} as const

export type RegistrationStatus = keyof typeof RegistrationStatus

export type Registration = {
  id: string
  event_id: string
  status: RegistrationStatus
  version: number
  date_created: string
  date_updated?: string | null

  number?: number | null
  first_name?: string | null
  last_name?: string | null
  preferred_name?: string | null
  nickname?: string | null
  email?: string | null
}
