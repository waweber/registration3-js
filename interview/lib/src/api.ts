import {
  IncompleteInterviewResponse,
  InterviewAPI,
  InterviewResponse,
  UserResponse,
} from "./types.js"

type FetchFunc = (
  url: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

export const makeInterviewAPI = (
  fetchFunc: FetchFunc = fetch,
): InterviewAPI => {
  return new InterviewAPIImpl(fetchFunc)
}

class InterviewAPIImpl {
  private fetchFunc: FetchFunc | null
  constructor(fetchFunc?: FetchFunc) {
    this.fetchFunc = fetchFunc ?? null
  }

  async update(
    response: InterviewResponse,
    userResponse?: UserResponse,
  ): Promise<InterviewResponse> {
    if (response.completed) {
      return response
    }

    response = await this.updateOnce(response, userResponse)
    userResponse = undefined

    while (!response.completed && !response.content) {
      const next = await this.updateOnce(response)
      response = next
    }
    return response
  }

  private async updateOnce(
    response: IncompleteInterviewResponse,
    userResponse?: UserResponse,
  ): Promise<InterviewResponse> {
    const body = {
      state: response.state,
      responses: userResponse,
    }

    const fetchFunc = this.fetchFunc ?? window.fetch
    const res = await fetchFunc(response.target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    let newResp: InterviewResponse
    if (!res.ok) {
      newResp = getErrorResponse(response.state, res.status)
    } else {
      newResp = await res.json()
    }
    return newResp
  }
}

export const getErrorResponse = (
  prevState: string,
  status: number,
): IncompleteInterviewResponse => {
  const [title, message] =
    defaultErrorMessages[String(status)] ?? defaultErrorMessages[""]
  return {
    state: `${prevState}-error`,
    completed: false,
    target: "",
    content: {
      type: "error",
      title: title,
      description: message,
    },
  }
}

const defaultErrorMessages: {
  "": [string, string]
  [statusStr: string]: [string, string] | undefined
} = {
  "": ["Error", "An error occurred. Please go back and try again."],
  "404": [
    "Expired",
    "Your session may have timed out, or the form may have changed or is no longer available.",
  ],
  "409": [
    "Conflict",
    "Information was updated while completing the form. Please start over to use the updated information.",
  ],
  "422": ["Error", "Please go back and check your responses, then try again."],
}
