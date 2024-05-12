import { Meta, StoryObj } from "@storybook/react"
import { Interview } from "./Interview.js"
import { InterviewResponse } from "@open-event-systems/interview-lib"
import { Content as ContentComponent } from "../content/Content.js"
import { LoadingOverlay } from "@mantine/core"

const meta: Meta<typeof Interview> = {
  component: Interview,
}

export default meta

export const Default: StoryObj<typeof Interview> = {
  render() {
    const response: InterviewResponse = {
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
          },
          required: ["field_0"],
        },
      },
    }
    return (
      <Interview response={response}>
        {({ Title, Content, Controls, onSubmit, submitting }) => (
          <ContentComponent
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            title={<Title />}
            footer={<Controls />}
            style={{ width: 400, height: 400 }}
          >
            <Content />
            <LoadingOverlay visible={submitting} />
          </ContentComponent>
        )}
      </Interview>
    )
  },
}
