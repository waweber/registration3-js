import {
  InterviewResponseRecord,
  InterviewResponseStore,
  UserResponse,
} from "@open-event-systems/interview-lib"
import { ComponentType, ReactNode } from "react"

export type InterviewContentComponentProps = {
  title?: ReactNode
  children?: ReactNode
  controls?: ReactNode
}

export type InterviewComponentProps = {
  contentComponent: ComponentType<InterviewContentComponentProps>
}

export type InterviewComponent = <P>(
  props: P & InterviewComponentProps,
) => ReactNode

export type InterviewContextValue = Readonly<
  {
    store: InterviewResponseStore
    latestRecordId: string | null
    submitting: boolean
    onSubmit: (userResponse?: UserResponse) => void | Promise<void>
    onClose: () => void
    onNavigate: (state: string) => void
  } & (
    | { recordId: null; record: null }
    | { recordId: string; record: InterviewResponseRecord | null }
  )
>
