import { useLocation, useNavigate, useRouter } from "@tanstack/react-router"
import { useCallback } from "react"
import { addRegistrationRoute, eventRoute } from "../routes/index.js"
import { useRegistrations } from "./api.js"
import { InterviewOption } from "../api/types.js"
import { useCurrentCart } from "./cart.js"

declare module "@tanstack/react-router" {
  interface HistoryState {
    showInterviewStateDialog?: boolean
  }
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
  const [cart] = useCurrentCart(eventId)
  const options = registrations.add_options ?? []

  return {
    options,
    opened: !!loc.state.showInterviewStateDialog,
    show: useCallback(() => {
      if (loc.state.showInterviewStateDialog || options.length == 0) {
        return
      }

      if (options.length == 1) {
        navigate({
          to: addRegistrationRoute.to,
          params: {
            eventId: eventId,
            interviewId: options[0].id,
          },
        })
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
