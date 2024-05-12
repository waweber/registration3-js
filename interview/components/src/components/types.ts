import { ReactNode } from "react"

export type InterviewRenderProps = {
  Title: () => ReactNode
  Content: () => ReactNode
  Controls: () => ReactNode
  onSubmit: () => void
  submitting: boolean
}

export type InterviewComponentProps = {
  children: (renderProps: InterviewRenderProps) => ReactNode
}

export type InterviewComponent = <P>(
  props: P & InterviewComponentProps,
) => ReactNode
