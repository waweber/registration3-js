import { makeInterviewResponseStore } from "@open-event-systems/interview-lib"
import { createContext } from "react"
import { InterviewContextValue } from "../types.js"

export const InterviewContext = createContext<InterviewContextValue>({
  store: makeInterviewResponseStore(),
  recordId: null,
  latestRecordId: null,
  record: null,
  onSubmit: () => void 0,
  submitting: false,
  onClose: () => void 0,
  onNavigate: () => void 0,
})
