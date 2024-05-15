import { Meta, StoryObj } from "@storybook/react"
import { Markdown } from "./Markdown.js"

const meta: Meta<typeof Markdown> = {
  component: Markdown,
}

export default meta

export const Default: StoryObj<typeof Markdown> = {
  args: {
    children: "**Example Markdown**\n\nMarkdown _formatted_.",
  },
  render(args) {
    return <Markdown style={{ width: 300 }} {...args} />
  },
}
