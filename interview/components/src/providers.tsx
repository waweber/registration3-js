import {
  InterviewAPI,
  InterviewResponseStore,
  makeInterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { ReactNode, createContext, useState } from "react"

export const InterviewAPIContext = createContext<
  readonly [InterviewAPI, InterviewResponseStore] | null
>(null)

export const InterviewAPIProvider = ({
  children,
  api,
  store,
}: {
  children?: ReactNode
  api: InterviewAPI
  store?: InterviewResponseStore
}) => {
  const [defaultStore] = useState(() => makeInterviewResponseStore())

  return (
    <InterviewAPIContext.Provider value={[api, store ?? defaultStore]}>
      {children}
    </InterviewAPIContext.Provider>
  )
}
