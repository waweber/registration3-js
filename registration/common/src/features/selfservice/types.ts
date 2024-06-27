import { InterviewResponse } from "@open-event-systems/interview-lib"
import { Cart } from "../cart/types.js"

export type Event = {
  id: string
  title: string
  open: boolean
}

export type InterviewOption = {
  id: string
  title: string
}

export type Registration = {
  id: string
  title?: string
  subtitle?: string
  description?: string
  header_color?: string
  header_image?: string
  change_options?: InterviewOption[]
}

export type RegistrationListResponse = {
  registrations: Registration[]
  add_options?: InterviewOption[]
}

export type SelfServiceAPI = {
  listEvents(): Promise<Event[]>
  listRegistrations(
    eventId: string,
    accessCode?: string | null,
  ): Promise<RegistrationListResponse>
  startInterview(
    eventId: string,
    cartId: string,
    interviewId: string,
    registrationId?: string | null,
    accessCode?: string | null,
  ): Promise<InterviewResponse>
  completeInterview(state: string): Promise<Cart>
  checkAccessCode(eventId: string, accessCode: string): Promise<boolean>
}
