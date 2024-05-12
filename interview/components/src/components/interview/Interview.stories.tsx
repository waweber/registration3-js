import { Meta, StoryObj } from "@storybook/react"
import { Interview } from "./Interview.js"
import { InterviewResponse } from "@open-event-systems/interview-lib"
import { Content as ContentComponent } from "../content/Content.js"
import { LoadingOverlay } from "@mantine/core"

const meta: Meta<typeof Interview> = {
  component: Interview,
}

export default meta

export const Question: StoryObj<typeof Interview> = {
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

export const Exit: StoryObj<typeof Interview> = {
  render() {
    const response: InterviewResponse = {
      completed: false,
      update_url: "",
      state: "2",
      content: {
        type: "exit",
        title: "Not Applicable",
        description: "You are not eligible to complete this form.",
      },
    }
    return (
      <Interview response={response}>
        {({ Title, Content, Controls }) => (
          <ContentComponent
            title={<Title />}
            footer={<Controls />}
            style={{ width: 400, height: 400 }}
          >
            <Content />
          </ContentComponent>
        )}
      </Interview>
    )
  },
}

export const Error: StoryObj<typeof Interview> = {
  render() {
    const response: InterviewResponse = {
      completed: false,
      update_url: "",
      state: "1-error",
      content: {
        type: "error",
        title: "Error",
        description: "There was an error, please go back and try again.",
      },
    }
    return (
      <Interview response={response}>
        {({ Title, Content, Controls }) => (
          <ContentComponent
            title={<Title />}
            footer={<Controls />}
            style={{ width: 400, height: 400 }}
          >
            <Content />
          </ContentComponent>
        )}
      </Interview>
    )
  },
}
