import {
  InterviewAPIContext,
  InterviewStoreContext,
} from "#src/interview/providers.js"
import { getInterviewStateQueryOptions } from "#src/interview/queries.js"
import { useRequiredContext } from "#src/utils.js"
import {
  InterviewAPI,
  InterviewResponseRecord,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useInterviewState = (
  defaultUpdateURL: string,
  stateId: string,
): InterviewResponseRecord => {
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const opts = getInterviewStateQueryOptions(
    interviewAPI,
    interviewStore,
    defaultUpdateURL,
    stateId,
  )
  const res = useSuspenseQuery(opts)
  return res.data
}

export const useInterviewAPI = (): InterviewAPI =>
  useRequiredContext(InterviewAPIContext)
export const useInterviewStore = (): InterviewResponseStore =>
  useRequiredContext(InterviewStoreContext)
