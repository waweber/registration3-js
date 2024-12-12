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

  notes?: string | null
}

export type RegistrationListResponse = {
  registrations: RegistrationListResponseItem[]
  add_options?: { url: string; title: string }[] | null
}

export type RegistrationListResponseItem = {
  registration: Registration
  summary?: string | null
}

export type RegistrationResponse = {
  registration: Registration
  summary?: string | null
  display_data?: (readonly [string, string])[] | null
  change_options?: { url: string; title: string }[] | null
}

export type RegistrationSearchOptions = {
  all?: boolean
  before?: readonly [string, string]
  check_in_id?: string | null
  summary?: boolean
}

export type RegistrationBatchUpdateResult = {
  results: Registration[]
}

export type RegistrationAPI = {
  listRegistrations(
    eventId: string,
    query?: string,
    options?: RegistrationSearchOptions,
  ): Promise<RegistrationListResponse>
  readRegistration(eventId: string, id: string): Promise<RegistrationResponse>
  completeRegistration(
    eventId: string,
    id: string,
  ): Promise<RegistrationResponse>
  cancelRegistration(eventId: string, id: string): Promise<RegistrationResponse>
}
