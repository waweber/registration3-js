import { RegistrationBatchUpdateResult } from "#src/registration/types.js"
import {
  CompleteInterviewResponse,
  InterviewResponse,
} from "@open-event-systems/interview-lib"

export type Event = {
  id: string
  title: string
  open: boolean
  visible: boolean
}

export type OverviewResponse = {
  count: number
}

export type AdminAPI = {
  readOverview(
    eventId: string,
    checkedIn?: boolean,
    since?: Date,
  ): Promise<OverviewResponse>
  listEvents(): Promise<Event[]>
  startInterview(url: string): Promise<InterviewResponse>
  completeInterview(
    response: CompleteInterviewResponse,
  ): Promise<RegistrationBatchUpdateResult | null>
}
