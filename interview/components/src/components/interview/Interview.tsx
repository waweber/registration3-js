import { InterviewResponse } from "@open-event-systems/interview-lib"
import { ReactNode } from "react"
import { InterviewComponentProps } from "../types.js"
import { Question } from "../question/Question.js"
import { Error } from "../error/Error.js"

export type InterviewProps = InterviewComponentProps & {
  response?: InterviewResponse
  onClose?: () => void
}

export const Interview = (props: InterviewProps) => {
  const { response, onClose, children } = props

  const content = !response || response.completed ? undefined : response.content

  let child: ReactNode

  if (!response || !content) {
  } else if (content.type == "exit") {
    child = (
      <Error
        title={content.title}
        message={content.description || "Your responses cannot be accepted."}
        onClose={onClose}
      >
        {children}
      </Error>
    )
  } else if (content.type == "error") {
    child = (
      <Error
        title={content.title}
        message={content.description}
        onClose={onClose}
      >
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

  return child
}
