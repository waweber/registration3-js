import {
  InterviewAPI,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { useContext } from "react"
import { InterviewAPIContext } from "./providers.js"

export const useInterviewAPI = (): readonly [
  InterviewAPI,
  InterviewResponseStore,
] => {
  const ctx = useContext(InterviewAPIContext)
  if (!ctx) {
    throw new Error("Interview API not provided")
  }
  return ctx
}
