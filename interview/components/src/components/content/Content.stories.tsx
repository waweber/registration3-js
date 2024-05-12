import { Meta, StoryObj } from "@storybook/react"
import { Content } from "./Content.js"

const meta: Meta<typeof Content> = {
  component: Content,
}
export default meta

export const Default: StoryObj<typeof Content> = {
  args: {
    title: "Title",
    footer: "Footer",
    style: {
      height: 400,
      width: 300,
    },
  },
  render(args) {
    return <Content {...args}>Content</Content>
  },
}
