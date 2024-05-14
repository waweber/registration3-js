import { InterviewAPI, InterviewResponse, UserResponse } from "./types.js"

/**
 * Create a mock API.
 */
export const makeMockAPI = (
  getNextResponse: (
    curResponse: InterviewResponse,
    userResponse?: UserResponse,
  ) =>
    | Promise<InterviewResponse | null | undefined>
    | InterviewResponse
    | null
    | undefined,
): InterviewAPI => {
  return {
    async update(response, userResponse) {
      const nextResponse = await getNextResponse(response, userResponse)
      if (!nextResponse) {
        return {
          completed: false,
          update_url: "",
          state: `${response.state}-error`,
          content: {
            title: "Error",
            type: "error",
            description: "Response not found",
          },
        }
      }
      return nextResponse
    },
  }
}
