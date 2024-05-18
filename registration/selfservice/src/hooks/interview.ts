import { useLocation, useNavigate, useRouter } from "@tanstack/react-router"
import { useCallback, useContext } from "react"
import { eventRoute } from "../routes/index.js"
import { useRegistrations } from "./api.js"
import { InterviewOption } from "../api/types.js"
import {
  InterviewAPI,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { InterviewAPIContext } from "../providers/interview.js"

declare module "@tanstack/react-router" {
  interface HistoryState {
    showInterviewStateDialog?: boolean
  }
}

export const useInterviewAPI = (): [InterviewAPI, InterviewResponseStore] => {
  const ctx = useContext(InterviewAPIContext)
  if (!ctx) {
    throw new Error("Interview context not provided")
  }
  return ctx
}

export type InterviewOptionsDialogHook = Readonly<{
  options: InterviewOption[]
  opened: boolean
  show: () => void
  close: () => void
}>

export const useInterviewOptionsDialog = (): InterviewOptionsDialogHook => {
  const { eventId } = eventRoute.useParams()
  const loc = useLocation()
  const navigate = useNavigate()
  const router = useRouter()
  const registrations = useRegistrations(eventId)
  const options = registrations.addOptions ?? []

  return {
    options,
    opened: !!loc.state.showInterviewStateDialog,
    show: useCallback(() => {
      if (loc.state.showInterviewStateDialog || options.length == 0) {
        return
      }

      if (options.length == 1) {
        // TODO: start interview
        console.log("TODO: would have started the interview right away")
      } else {
        navigate({
          state: {
            ...loc.state,
            showInterviewStateDialog: true,
          },
        })
      }
    }, [loc, registrations]),
    close: useCallback(() => {
      if (loc.state.showInterviewStateDialog) {
        router.history.go(-1)
      }
    }, [loc]),
  }
}
