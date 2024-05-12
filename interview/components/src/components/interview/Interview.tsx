import {
  InterviewContent,
  InterviewResponse,
} from "@open-event-systems/interview-lib"
import { ReactNode } from "react"
import {
  InterviewComponent,
  InterviewComponentProps,
  InterviewRenderProps,
} from "../types.js"
import { Question } from "../question/Question.js"

export type InterviewProps = InterviewComponentProps & {
  response?: InterviewResponse
}

export const Interview = (props: InterviewProps) => {
  const { response, children } = props

  const content = !response || response.completed ? undefined : response.content

  let child: ReactNode

  if (!response || !content) {
  } else if (content.type == "question") {
    child = (
      <Question key={response.state} schema={content.schema}>
        {children}
      </Question>
    )
  }

  return child
}
