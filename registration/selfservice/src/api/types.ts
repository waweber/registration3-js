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
  headerImage?: string
  changeOptions?: InterviewOption[]
}>

export type RegistrationListResponse = Readonly<{
  registrations: Registration[]
  addOptions?: InterviewOption[]
}>

export type SelfServiceAPI = {
  listEvents(): Promise<Event[]>
  listRegistrations(eventId: string): Promise<RegistrationListResponse>
  startInterview(
    eventId: string,
    cartId: string,
    interviewId: string,
  ): Promise<InterviewResponse>
}
