import { Box } from "@mantine/core"
import {
  InterviewResponse,
  makeInterviewResponseStore,
  makeMockAPI,
} from "@open-event-systems/interview-lib"
import {
  InterviewAPIProvider,
  InterviewStoreProvider,
} from "@open-event-systems/registration-lib/interview"
import { Meta, StoryObj } from "@storybook/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

import "@open-event-systems/interview-components/styles.scss"
import { AdminInterviewPanel } from "#src/features/admin/components/interview-panel/AdminInterviewPanel.js"

const meta: Meta<typeof AdminInterviewPanel> = {
  component: AdminInterviewPanel,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof AdminInterviewPanel> = {
  decorators: [
    (Story) => (
      <Box p="sm">
        <Story />
      </Box>
    ),
  ],
  render() {
    const [recordId, setRecordId] = useState("1")
    const navigate = (state: string) => {
      setRecordId(state)
    }

    const [queryClient] = useState(() => new QueryClient())
    const [interviewStore] = useState(() => makeInterviewResponseStore())
    const [interviewAPI] = useState(() => {
      const responses: Record<string, InterviewResponse | undefined> = {
        "1": {
          completed: false,
          state: "1",
          target: "",
          content: {
            type: "question",
            schema: {
              title: "Question",
              description: "Question description.",
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 2,
                  maxLength: 16,
                  title: "Name",
                },
              },
              required: ["name"],
            },
          },
        },
        "2": {
          completed: false,
          state: "2",
          target: "",
          content: {
            type: "exit",
            title: "Not Applicable",
            description: "Exiting.",
          },
        },
      }

      for (const key of Object.keys(responses)) {
        if (responses[key]) {
          interviewStore.add(responses[key])
        }
      }

      return makeMockAPI((cur) => {
        return responses[String(parseInt(cur.state) + 1)]
      })
    })

    return (
      <QueryClientProvider client={queryClient}>
        <InterviewStoreProvider value={interviewStore}>
          <InterviewAPIProvider value={interviewAPI}>
            <AdminInterviewPanel
              recordId={recordId}
              onNavigate={navigate}
              onClose={() => setRecordId("1")}
            />
          </InterviewAPIProvider>
        </InterviewStoreProvider>
      </QueryClientProvider>
    )
  },
}
