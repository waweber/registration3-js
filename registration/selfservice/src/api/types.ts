import { Cart } from "@open-event-systems/registration-common"
import { InterviewResponse } from "../../../../interview/lib/src/types.js"

export type Event = Readonly<{
  id: string
  name: string
  open: boolean
}>

export type InterviewOption = Readonly<{
  id: string
  title: string
}>

export type Registration = Readonly<{
  id: string
  title?: string
  subtitle?: string
  description?: string
  header_image?: string
  change_options?: InterviewOption[]
}>

export type RegistrationListResponse = Readonly<{
  registrations: Registration[]
  add_options?: InterviewOption[]
}>

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
