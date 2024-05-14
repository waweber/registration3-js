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

export type InterviewContent = AskResult | ExitResult | ErrorResult

export type AskResult = Readonly<{
  type: "question"
  schema: Schema
}>

export type ExitResult = Readonly<{
  type: "exit"
  title: string
  description?: string
}>

/**
 * Not an actual result returned, it is inserted upon error.
 */
export type ErrorResult = Readonly<{
  type: "error"
  title: string
  description: string
}>

type JSONScalar = string | number | boolean | null
type JSON = JSONScalar | JSONScalar[] | { [key: string]: JSON }

export type UserResponse = Readonly<Record<string, JSON>>

export type InterviewResponseRecord = Readonly<{
  response: InterviewResponse
  title?: string
  prev?: string
  userResponse?: UserResponse
}>

/**
 * Stores {@link InterviewResponse} objects.
 */
export type InterviewResponseStore = {
  [Symbol.iterator](): Iterator<InterviewResponseRecord>

  /**
   * Get a record by id.
   */
  get(state: string): InterviewResponseRecord | null

  /**
   * Add a record.
   * @param response - the response
   * @param prev - the previous record id
   * @returns the added record
   */
  add(response: InterviewResponse, prev?: string): InterviewResponseRecord

  /**
   * Save the user responses for a record.
   * @param state - the state value
   * @param userResponse - the response value
   * @returns the updated record, or null if it does not exist
   */
  saveUserResponse(
    state: string,
    userResponse: UserResponse,
  ): InterviewResponseRecord | null
}

export type InterviewAPI = {
  /**
   * Update an interview.
   * @param response - the interview response object
   * @param userResponse - the user response
   * @returns a promise that will resolve with the next interview response record
   */
  update(
    response: InterviewResponse,
    userResponse?: UserResponse,
  ): Promise<InterviewResponseRecord>
}
