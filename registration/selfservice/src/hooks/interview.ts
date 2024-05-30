import { useLocation, useNavigate, useRouter } from "@tanstack/react-router"
import { useCallback } from "react"
import { addRegistrationRoute } from "../routes/index.js"
import { useRegistrations } from "./api.js"
import {
  UseOptionsDialogHook,
  UseOptionsDialogOptions,
  useOptionsDialog,
} from "@open-event-systems/registration-common"

declare module "@tanstack/react-router" {
  interface HistoryState {
    showInterviewStateDialog?: boolean
  }
}

export type InterviewOptionsDialogHook = {
  options: UseOptionsDialogHook["options"]
  opened: boolean
} & UseOptionsDialogHook

export const useInterviewOptionsDialog = (
  eventId: string,
  cartId: string,
  opts?: Pick<UseOptionsDialogOptions, "disableAutoselect">,
): InterviewOptionsDialogHook => {
  const loc = useLocation()
  const navigate = useNavigate()
  const router = useRouter()
  const registrations = useRegistrations(eventId)
  const options = registrations.add_options ?? []

  const opened = loc.state.showInterviewStateDialog

  const onShow = useCallback(() => {
    navigate({
      state: {
        ...router.history.location.state,
        showInterviewStateDialog: true,
      },
    })
  }, [])

  const onClose = useCallback(() => {
    router.history.go(-1)
  }, [])

  const onSelect = useCallback(
    (id: string) => {
      navigate({
        to: addRegistrationRoute.to,
        params: {
          eventId: eventId,
          interviewId: id,
        },
      })
    },
    [eventId],
  )

  const hook = useOptionsDialog({
    options: options.map((o) => ({ id: o.id, label: o.title, button: true })),
    ...opts,
    onShow,
    onClose,
    onSelect,
  })

  return {
    ...hook,
    opened: !!opened,
  }
}
