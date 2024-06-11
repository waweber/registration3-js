import { Meta, StoryObj } from "@storybook/react"
import { FullscreenLoader } from "./FullscreenLoader.js"

const meta: Meta<typeof FullscreenLoader> = {
  component: FullscreenLoader,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<{ show?: boolean }> = {
  args: {
    show: true,
  },
  render({ show }) {
    return (
      <FullscreenLoader>
        Content
        {show && <FullscreenLoader.Show />}
        {show && <FullscreenLoader.Show />}
      </FullscreenLoader>
    )
  },
}
