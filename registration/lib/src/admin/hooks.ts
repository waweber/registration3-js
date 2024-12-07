import { AdminAPIContext } from "#src/admin/providers.js"
import { AdminAPI } from "#src/admin/types.js"
import { useRequiredContext } from "#src/utils.js"
import { CompleteInterviewResponse } from "@open-event-systems/interview-lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAdminAPI = (): AdminAPI => useRequiredContext(AdminAPIContext)

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
