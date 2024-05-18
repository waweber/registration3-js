import {
  IncompleteInterviewResponse,
  InterviewResponse,
  UserResponse,
  makeMockAPI,
} from "@open-event-systems/interview-lib"
import { NotFoundError } from "@open-event-systems/registration-common"

export const mockAPI = makeMockAPI((curResp, userResp) => {
  const func = mockStates[curResp.state]
  if (func) {
    return func(curResp as IncompleteInterviewResponse, userResp)
  } else {
    throw new NotFoundError()
  }
})

const mockStates: Record<
  string,
  (
    curResp: IncompleteInterviewResponse,
    userResp?: UserResponse,
  ) => InterviewResponse
> = {
  "add-0": (curResp, userResp) => ({
    state: "add-1",
    completed: false,
    update_url: curResp.update_url,
    content: {
      type: "question",
      schema: {
        type: "object",
        title: "Name",
        description: "What is your name?",
        properties: {
          field_0: {
            type: "string",
            minLength: 1,
            maxLength: 30,
            title: "Name",
          },
        },
        required: ["field_0"],
      },
    },
  }),
  "add-1": (curResp, userResp) => ({
    state: "add-2",
    completed: false,
    update_url: curResp.update_url,
    content: {
      type: "question",
      schema: {
        type: "object",
        title: "Email",
        description: "What is your email?",
        properties: {
          field_0: {
            type: "string",
            minLength: 1,
            maxLength: 30,
            title: "Email",
            format: "email",
          },
        },
        required: ["field_0"],
      },
    },
  }),
  "add-2": () => ({
    completed: true,
    state: "add-3",
  }),
}
