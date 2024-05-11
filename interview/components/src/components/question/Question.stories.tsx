import { Meta, StoryObj } from "@storybook/react"
import { Question } from "./Question.js"

const meta: Meta<typeof Question> = {
  component: Question,
}
export default meta

export const Default: StoryObj<typeof Question> = {
  args: {
    style: {
      height: 400,
      width: 300,
    },
  },
}
