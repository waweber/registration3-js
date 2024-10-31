import { useLocation, useNavigate, useRouter } from "@tanstack/react-router"
import { useCallback } from "react"
import {
  UseOptionsDialogHook,
  UseOptionsDialogOptions,
  useOptionsDialog,
} from "#src/hooks/options.js"
import { addRegistrationRoute } from "#src/app/routes/selfservice/cart.js"
import {
  useSelfServiceAPI,
  useSelfServiceRegistrations,
} from "@open-event-systems/registration-lib/selfservice"
import {
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"

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
  accessCode?: string | null,
  opts?: Pick<UseOptionsDialogOptions, "disableAutoselect">,
): InterviewOptionsDialogHook => {
  const loc = useLocation()
  const navigate = useNavigate()
  const router = useRouter()
  const selfServiceAPI = useSelfServiceAPI()
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const registrations = useSelfServiceRegistrations(eventId, cartId, accessCode)
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
    (url: string) => {
      selfServiceAPI
        .startInterview(url)
        .then((res) => interviewAPI.update(res))
        .then((res) => {
          const record = interviewStore.add(res)
          navigate({
            to: addRegistrationRoute.to,
            hash: `s=${record.response.state}`,
            params: {
              eventId: eventId,
            },
          })
        })
    },
    [eventId],
  )

  const hook = useOptionsDialog({
    options: options.map((o) => ({ id: o.url, label: o.title, button: true })),
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
