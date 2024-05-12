import {
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
  recordId?: string
  latestRecordId?: string
  onClose?: () => void
  onNavigate?: (state: string) => void
}

export const Interview = (props: InterviewProps) => {
  const { store, recordId, latestRecordId, onClose, onNavigate, children } =
    props
  const record = recordId ? store.get(recordId) : null
  const response = record?.response

  const content = !response || response.completed ? undefined : response.content

  const [submitting, setSubmitting] = useState(false)
  const onSubmit = useCallback(
    (userResponse?: UserResponse) => {
      if (submitting) {
        return
      }

      setSubmitting(true)
      console.log(userResponse)
      window.setTimeout(() => setSubmitting(false), 1000)
    },
    [submitting],
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
      <Question key={response.state} schema={content.schema}>
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
