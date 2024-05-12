import { InterviewResponseRecordStore } from "./store.js"
import { IncompleteInterviewResponse, InterviewResponse } from "./types.js"

type FetchFunc = (
  url: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

export class InterviewAPI {
  constructor(
    private store: InterviewResponseRecordStore,
    private fetch: FetchFunc = fetch,
  ) {}

  async start(response: InterviewResponse): Promise<InterviewResponse> {
    return await this.update(response)
  }

  private async update(
    response: InterviewResponse,
    userResponse?: Record<string, unknown>,
  ): Promise<InterviewResponse> {
    while (!response.completed && !response.content) {
      const next = await this.updateOnce(response, userResponse)
      userResponse = undefined
      response = next
    }
    return response
  }

  private async updateOnce(
    response: IncompleteInterviewResponse,
    userResponse?: Record<string, unknown>,
  ): Promise<InterviewResponse> {
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
    // TODO errors
    const newResp: InterviewResponse = await res.json()
    this.store.add(newResp, response.state)
    return newResp
  }
}
