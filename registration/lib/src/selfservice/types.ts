import {
  CompleteInterviewResponse,
  InterviewResponse,
} from "@open-event-systems/interview-lib"
import { Cart } from "../cart/types.js"

export type Event = {
  id: string
  title: string
  open: boolean
}

export type InterviewOption = {
  url: string
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
    cartId: string,
    accessCode?: string | null,
  ): Promise<RegistrationListResponse>
  startInterview(url: string): Promise<InterviewResponse>
  completeInterview(response: CompleteInterviewResponse): Promise<Cart | null>
  checkAccessCode(eventId: string, accessCode: string): Promise<boolean>
}
