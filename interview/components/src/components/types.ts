import {
  InterviewResponseRecord,
  InterviewResponseStore,
  UserResponse,
} from "@open-event-systems/interview-lib"
import { ReactNode } from "react"

export type InterviewRenderProps = {
  Title: () => ReactNode
  Content: () => ReactNode
  Controls: () => ReactNode
}

export type InterviewComponentProps = {
  children: (renderProps: InterviewRenderProps) => ReactNode
}

export type InterviewComponent = <P>(
  props: P & InterviewComponentProps,
) => ReactNode

export type InterviewContextValue = Readonly<
  {
    store: InterviewResponseStore
    latestRecordId: string | null
    submitting: boolean
    onSubmit: (userResponse?: UserResponse) => void
    onClose: () => void
    onNavigate: (state: string) => void
  } & (
    | { recordId: null; record: null }
    | { recordId: string; record: InterviewResponseRecord | null }
  )
>
