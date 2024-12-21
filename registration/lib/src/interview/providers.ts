import { createOptionalContext } from "#src/utils.js"
import {
  InterviewAPI,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"

export const InterviewAPIContext = createOptionalContext<InterviewAPI>()
export const InterviewStoreContext =
  createOptionalContext<InterviewResponseStore>()

export const InterviewAPIProvider = InterviewAPIContext.Provider
export const InterviewStoreProvider = InterviewStoreContext.Provider
