import { Meta, StoryObj } from "@storybook/react"
import { SimpleMessageLayout } from "./SimpleMessageLayout.js"

const meta: Meta<typeof SimpleMessageLayout> = {
  component: SimpleMessageLayout,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof SimpleMessageLayout> = {
  render() {
    return (
      <SimpleMessageLayout title="Message">
        A simple message.
      </SimpleMessageLayout>
    )
  },
}
