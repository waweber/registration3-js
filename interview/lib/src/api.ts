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
    const res = await fetchFunc(response.update_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    let newResp: InterviewResponse
    if (!res.ok) {
      newResp = await handleError(response, res)
    } else {
      newResp = await res.json()
    }
    return newResp
  }
}

const handleError = async (
  prev: InterviewResponse,
  resp: Response,
): Promise<IncompleteInterviewResponse> => {
  let title: string | undefined
  let message: string | undefined
  try {
    ;[title, message] = await parseError(resp)
  } catch (_) {
    // ignore
  }
  const defaults =
    defaultErrorMessages[String(resp.status)] ?? defaultErrorMessages[""]
  title = title || defaults[0]
  message = message || defaults[1]
  return {
    state: `${prev.state}-error`,
    completed: false,
    update_url: "",
    content: {
      type: "error",
      title: title,
      description: message,
    },
  }
}

const parseError = async (resp: Response) => {
  const bodyJson = await resp.json()
  let title: string | undefined
  let message: string | undefined
  if (typeof bodyJson == "object" && bodyJson) {
    if ("description" in bodyJson) {
      title = bodyJson.description
    }
    if ("message" in bodyJson) {
      message = bodyJson.message
    }
  }
  return [title, message]
}

export const defaultErrorMessages: {
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
