import { Meta, StoryObj } from "@storybook/react"
import { FullPageMenuLayout } from "./FullPageMenuLayout.js"

const meta: Meta<typeof FullPageMenuLayout> = {
  component: FullPageMenuLayout,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof FullPageMenuLayout> = {
  render() {
    return (
      <FullPageMenuLayout>
        <FullPageMenuLayout.Content title="Title">
          Content
        </FullPageMenuLayout.Content>
      </FullPageMenuLayout>
    )
  },
}
