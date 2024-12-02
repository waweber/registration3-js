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
  check_in_id?: string | null

  number?: number | null
  first_name?: string | null
  last_name?: string | null
  preferred_name?: string | null
  nickname?: string | null
  email?: string | null
}

export type RegistrationResponse = {
  registration: Registration
  summary?: string | null
}

export type RegistrationCheckInInfo = {
  registration: Registration
  check_in_status: string | null
}

export type RegistrationSearchOptions = {
  all?: boolean
  before?: readonly [string, string]
  check_in_id?: string | null
}

export type RegistrationAPI = {
  listRegistrations(
    eventId: string,
    query?: string,
    options?: RegistrationSearchOptions,
  ): Promise<RegistrationResponse[]>
  readRegistration(eventId: string, id: string): Promise<RegistrationResponse>
}
