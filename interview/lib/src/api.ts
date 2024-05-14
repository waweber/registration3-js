import {
  IncompleteInterviewResponse,
  InterviewAPI,
  InterviewResponse,
  InterviewResponseRecord,
  InterviewResponseStore,
  UserResponse,
} from "./types.js"

type FetchFunc = (
  url: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

export const makeInterviewAPI = (
  store: InterviewResponseStore,
  fetchFunc: FetchFunc = fetch,
): InterviewAPI => {
  return new InterviewAPIImpl(store, fetchFunc)
}

class InterviewAPIImpl {
  constructor(
    private store: InterviewResponseStore,
    private fetch: FetchFunc = fetch,
  ) {}

  async update(
    response: InterviewResponse,
    userResponse?: UserResponse,
  ): Promise<InterviewResponseRecord> {
    let curRecord = this.store.get(response.state)
    if (!curRecord) {
      curRecord = this.store.add(response)
    }

    while (!curRecord.response.completed && !curRecord.response.completed) {
      const next = await this.updateOnce(curRecord.response, userResponse)
      userResponse = undefined
      curRecord = next
    }
    return curRecord
  }

  private async updateOnce(
    response: IncompleteInterviewResponse,
    userResponse?: UserResponse,
  ): Promise<InterviewResponseRecord> {
    const body = {
      state: response.state,
      responses: userResponse,
    }

    const res = await this.fetch(response.update_url, {
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
    const newRecord = this.store.add(newResp, response.state)
    return newRecord
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
  const defaults = defaultErrorMessages[String(resp.status)] ?? [
    undefined,
    undefined,
  ]
  title = title || defaults[0] || "Error"
  message =
    message || defaults[1] || "An error occurred. Please go back and try again."
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

const defaultErrorMessages: Record<string, [string, string] | undefined> = {
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
