import { Meta, StoryObj } from "@storybook/react"
import { Interview } from "./Interview.js"
import {
  InterviewResponse,
  InterviewResponseRecord,
  makeInterviewResponseStore,
  makeMockAPI,
} from "@open-event-systems/interview-lib"
import { InterviewPanel } from "./InterviewPanel.js"
import { useState } from "react"

const meta: Meta<typeof InterviewPanel> = {
  component: InterviewPanel,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Question: StoryObj<typeof InterviewPanel> = {
  render() {
    return <Example recordId="1" latestRecordId="1" />
  },
}

export const Exit: StoryObj<typeof InterviewPanel> = {
  render() {
    return <Example recordId="2" latestRecordId="2" />
  },
}

export const Error: StoryObj<typeof InterviewPanel> = {
  render() {
    return <Example recordId="1-error" latestRecordId="1-error" />
  },
}

const Example = (props: { recordId: string; latestRecordId: string }) => {
  const records: InterviewResponseRecord[] = [
    {
      title: "Example Question",
      response: {
        completed: false,
        update_url: "",
        state: "1",
        content: {
          type: "question",
          schema: {
            type: "object",
            title: "Example Question",
            description: "What is your name?",
            properties: {
              field_0: {
                type: "string",
                title: "Name",
                minLength: 1,
              },
              field_1: {
                type: "string",
                "x-type": "select",
                "x-component": "buttons",
                default: "1",
                oneOf: [
                  {
                    const: "1",
                    title: "Continue",
                    "x-primary": true,
                  },
                ],
              },
            },
            required: ["field_0", "field_1"],
          },
        },
      },
    },
    {
      title: "Error",
      prev: "1",
      response: {
        completed: false,
        update_url: "",
        state: "1-error",
        content: {
          type: "error",
          title: "Error",
          description: "There was an error, please go back and try again.",
        },
      },
    },
    {
      title: "Not Applicable",
      prev: "1",
      response: {
        completed: false,
        update_url: "",
        state: "2",
        content: {
          type: "exit",
          title: "Not Applicable",
          description: "You are not eligible to complete this form.",
        },
      },
    },
  ]
  const nextStateMap: Record<string, string> = {
    "1": "2",
  }
  const [store] = useState(() => makeInterviewResponseStore(records))
  const getNextResponse = async (resp: InterviewResponse) => {
    const nextState = nextStateMap[resp.state]
    return nextState ? store.get(nextState)?.response ?? null : null
  }
  const [mockApi] = useState(() => makeMockAPI(getNextResponse))
  const [recordId, setRecordId] = useState(props.recordId)
  const [latestRecordId, setLatestRecordId] = useState(props.latestRecordId)

  const navigate = (state: string) => {
    setRecordId(state)
  }

  return (
    <Interview
      store={store}
      api={mockApi}
      onUpdate={async (record) => {
        await new Promise((r) => window.setTimeout(r, 1000))
        setLatestRecordId(record.response.state)
        navigate(record.response.state)
      }}
      recordId={recordId}
      latestRecordId={latestRecordId}
      onNavigate={navigate}
    >
      {(renderProps) => (
        <InterviewPanel {...renderProps} p="xs" w="100vw" h="100vh" />
      )}
    </Interview>
  )
}
