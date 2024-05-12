import { Schema } from "./schema/types.js"

export type InterviewResponse =
  | IncompleteInterviewResponse
  | CompletedInterviewResponse

export type IncompleteInterviewResponse = Readonly<{
  state: string
  completed: false
  update_url: string
  content?: InterviewContent
}>

export type CompletedInterviewResponse = Readonly<{
  state: string
  target?: string
  completed: true
}>

export type InterviewContent = AskResult | ExitResult

export type AskResult = Readonly<{
  type: "question"
  schema: Schema
}>

export type ExitResult = Readonly<{
  type: "exit"
  title: string
  description?: string
}>

export type InterviewResponseRecord = Readonly<{
  response: InterviewResponse
  title?: string
  prev?: string
  userResponse?: Record<string, unknown>
}>
