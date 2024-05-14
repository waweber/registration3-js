import {
  CompletedInterviewResponse,
  IncompleteInterviewResponse,
  InterviewAPI,
  InterviewResponseRecord,
  InterviewResponseStore,
  UserResponse,
} from "@open-event-systems/interview-lib"
import { ReactNode, useCallback, useState } from "react"
import { InterviewComponentProps } from "../types.js"
import { Question } from "../question/Question.js"
import { Error } from "../error/Error.js"
import { InterviewContext } from "./Context.js"

export type InterviewProps = InterviewComponentProps & {
  store: InterviewResponseStore
  api: InterviewAPI
  recordId?: string
  latestRecordId?: string
  onClose?: () => void
  onNavigate?: (state: string) => void
  onUpdate?: (record: InterviewResponseRecord) => Promise<void> | void
}

export const Interview = (props: InterviewProps) => {
  const {
    store,
    api,
    recordId,
    latestRecordId,
    onClose,
    onNavigate,
    onUpdate,
    children,
  } = props
  const record = recordId ? store.get(recordId) : null
  const response = record?.response

  const content = !response || response.completed ? undefined : response.content

  const [submitting, setSubmitting] = useState(false)

  const onSubmit = useCallback(
    (userResponse?: UserResponse) => {
      if (!response || submitting) {
        return
      }

      setSubmitting(true)
      try {
        if (userResponse != null) {
          store.saveUserResponse(response.state, userResponse)
        }

        api
          .update(response, userResponse)
          .then((res) => {
            const record = store.add(res, response.state)
            return onUpdate && onUpdate(record)
          })
          .then(() => {
            setSubmitting(false)
          })
          .catch(() => {
            setSubmitting(false)
          })
      } catch (_) {
        setSubmitting(false)
      }
    },
    [response, onNavigate, onUpdate, submitting, store, api],
  )

  let child: ReactNode

  if (!response || !content) {
  } else if (content.type == "exit") {
    child = (
      <Error
        title={content.title}
        message={content.description || "Your responses cannot be accepted."}
      >
        {children}
      </Error>
    )
  } else if (content.type == "error") {
    child = (
      <Error title={content.title} message={content.description}>
        {children}
      </Error>
    )
  } else if (content.type == "question") {
    child = (
      <Question
        key={response.state}
        schema={content.schema}
        initialData={record.userResponse}
      >
        {children}
      </Question>
    )
  }

  const contextRecordInfo = recordId
    ? { recordId, record }
    : { recordId: null, record: null }
  const context = {
    ...contextRecordInfo,
    store,
    latestRecordId: latestRecordId ?? null,
    submitting,
    onSubmit,
    onClose: onClose ?? (() => void 0),
    onNavigate: onNavigate ?? (() => void 0),
  }

  return (
    <InterviewContext.Provider value={context}>
      {child}
    </InterviewContext.Provider>
  )
}
