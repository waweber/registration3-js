import { Schema } from "./schema-types.js"

export type InterviewResponse =
  | IncompleteInterviewResponse
  | CompletedInterviewResponse

export type IncompleteInterviewResponse = {
  state: string
  completed: false
  update_url: string
  content?: InterviewContent
}

export type CompletedInterviewResponse = {
  state: string
  target?: string
  completed: true
}

export type InterviewContent = AskResult | ExitResult

export type AskResult = {
  type: "question"
  schema: Schema
}

export type ExitResult = {
  type: "exit"
  title: string
  description?: string
}

export type InterviewResponseRecord = {
  response: InterviewResponse
  title?: string
  prev?: string
  responses?: Record<string, unknown>
}
