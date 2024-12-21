import {
  InterviewAPI,
  InterviewResponseRecord,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { UseSuspenseQueryOptions } from "@tanstack/react-query"

export const getInterviewStateQueryOptions = (
  interviewAPI: InterviewAPI,
  interviewStore: InterviewResponseStore,
  defaultUpdateURL: string,
  stateId: string,
): UseSuspenseQueryOptions<InterviewResponseRecord> => {
  return {
    queryKey: ["interview", "state", stateId],
    async queryFn() {
      const curRecord = interviewStore.get(stateId)
      if (curRecord) {
        return curRecord
      }

      const resp = await interviewAPI.update({
        completed: false,
        target: defaultUpdateURL,
        state: stateId,
      })
      return interviewStore.add(resp)
    },
    staleTime: Infinity,
  }
}
