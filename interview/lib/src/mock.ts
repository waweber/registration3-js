import {
  InterviewAPI,
  InterviewResponse,
  InterviewResponseRecord,
  UserResponse,
} from "./types.js"

/**
 * Create a mock API.
 */
export const makeMockAPI = (
  getNextRecord: (
    curResponse: InterviewResponse,
    userResponse?: UserResponse,
  ) => Promise<InterviewResponseRecord | null>,
): InterviewAPI => {
  return {
    async update(response, userResponse) {
      const nextRecord = await getNextRecord(response, userResponse)
      if (!nextRecord) {
        return {
          title: "Error",
          prev: response.state,
          response: {
            completed: false,
            update_url: "",
            state: `${response.state}-error`,
            content: {
              title: "Error",
              type: "error",
              description: "Response not found",
            },
          },
        }
      }
      return nextRecord
    },
  }
}
