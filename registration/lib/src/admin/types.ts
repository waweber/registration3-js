import {
  CompleteInterviewResponse,
  InterviewResponse,
} from "@open-event-systems/interview-lib"

export type AdminAPI = {
  startInterview(url: string): Promise<InterviewResponse>
  completeInterview(response: CompleteInterviewResponse): Promise<void>
}
