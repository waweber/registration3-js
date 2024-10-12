export const REGISTRATION_STATUS = {
  pending: "pending",
  created: "created",
  canceled: "canceled",
} as const

export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS]

type JSONScalar = string | number | boolean | null
type JSON = JSONScalar | JSON[] | { [key: string]: JSON | undefined }

export type Registration = {
  id: string
  event_id: string
  version: number
  status: RegistrationStatus
  date_created: string
  date_updated?: string | null
  first_name?: string | null
  last_name?: string | null
  preferred_name?: string | null
  nickname?: string | null
  email?: string | null
  number?: number | null
  [key: string]: JSON | undefined
}

export type RegistrationResult = readonly [Registration, string]

export type RegistrationAPI = {
  list(
    eventId: string,
    search?: string,
    includeAll?: boolean,
    before?: string,
  ): Promise<Registration[]>
  read(eventId: string, id: string): Promise<RegistrationResult>
  update(registration: Registration, etag: string): Promise<RegistrationResult>
  complete(eventId: string, id: string): Promise<RegistrationResult>
  cancel(eventId: string, id: string): Promise<RegistrationResult>
}
