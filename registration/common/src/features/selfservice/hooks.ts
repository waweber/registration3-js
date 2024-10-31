import { Event, RegistrationListResponse, SelfServiceAPI } from "./types.js"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  notFound,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { getSelfServiceQueryOptions } from "./api.js"
import { useCallback } from "react"
import { useApp } from "#src/hooks/app.js"
import { createOptionalContext, useRequiredContext } from "#src/utils.js"
import {
  UseOptionsDialogHook,
  UseOptionsDialogOptions,
  useOptionsDialog,
} from "#src/hooks/options.js"
import { addRegistrationRoute } from "#src/app/routes/selfservice/cart.js"

export const SelfServiceAPIContext = createOptionalContext<SelfServiceAPI>()

export const useSelfService = (): SelfServiceAPI =>
  useRequiredContext(SelfServiceAPIContext)

export const useEvents = (): Map<string, Event> => {
  const api = useSelfService()
  const query = useSuspenseQuery({
    queryKey: ["self-service", "events"],
    async queryFn() {
      const events = await api.listEvents()
      return new Map(events.map((e) => [e.id, e]))
    },
    staleTime: Infinity,
  })

  return query.data
}

export const useEvent = (eventId: string): Event => {
  const events = useEvents()
  const event = events.get(eventId)
  if (!event) {
    throw notFound()
  }
  return event
}

export const useRegistrations = (
  eventId: string,
  cartId: string,
  accessCode?: string | null,
): RegistrationListResponse => {
  const { selfServiceAPI: api } = useApp()
  const queries = getSelfServiceQueryOptions(api)
  const query = useSuspenseQuery({
    ...queries.registrations(eventId, cartId, accessCode),
  })
  return query.data
}

export const useAccessCodeCheck = (
  eventId: string,
  accessCode: string,
): boolean => {
  const { selfServiceAPI: api } = useApp()
  const query = useSuspenseQuery({
    queryKey: ["events", eventId, "access-codes", accessCode, "check"],
    async queryFn() {
      return await api.checkAccessCode(eventId, accessCode)
    },
  })
  return query.data
}

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
  const registrations = useRegistrations(eventId, cartId, accessCode)
  const selfServiceAPI = useSelfService()
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
      selfServiceAPI.startInterview(url).then((res) => {
        navigate({
          to: addRegistrationRoute.to,
          hash: `s=${res.state}`,
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
