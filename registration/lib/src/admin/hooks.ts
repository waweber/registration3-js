import { AdminAPIContext } from "#src/admin/providers.js"
import {
  getEventOverviewQueryOptions,
  getEventsQueryOptions,
} from "#src/admin/queries.js"
import { AdminAPI, Event, OverviewResponse } from "#src/admin/types.js"
import { useRequiredContext } from "#src/utils.js"
import { CompleteInterviewResponse } from "@open-event-systems/interview-lib"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

export const useAdminAPI = (): AdminAPI => useRequiredContext(AdminAPIContext)

export const useEvents = (): Map<string, Event> => {
  const api = useAdminAPI()
  const opts = getEventsQueryOptions(api)
  const res = useSuspenseQuery(opts)
  return res.data
}

export const useEventOverview = (
  eventId: string,
  checkedIn?: boolean,
  since?: Date,
): OverviewResponse => {
  const api = useAdminAPI()
  const opts = getEventOverviewQueryOptions(api, eventId, checkedIn, since)
  const res = useSuspenseQuery(opts)
  return res.data
}

export const useUpdateRegistrationFromInterview = (
  eventId: string,
  registrationId: string,
): ((response: CompleteInterviewResponse) => Promise<void>) => {
  const adminAPI = useAdminAPI()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["events", eventId, "registrations", registrationId],
    async mutationFn(response: CompleteInterviewResponse) {
      await adminAPI.completeInterview(response)
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["events", eventId, "registrations", registrationId],
      })
    },
  })
  return mutation.mutateAsync
}
