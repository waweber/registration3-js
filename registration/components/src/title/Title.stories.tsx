import { Meta, StoryObj } from "@storybook/react"
import { Title, useTitle } from "./Title.js"
import { observer } from "mobx-react-lite"

import { Title as MantineTitle } from "@mantine/core"
import { ReactNode, useEffect, useState } from "react"

const meta: Meta<typeof Title> = {
  component: Title,
}

export default meta

export const Default: StoryObj<{ title?: string; subtitle?: string }> = {
  args: {
    title: "Title",
    subtitle: "Subtitle",
  },
  decorators: [
    (Story) => (
      <ShowTitle>
        <Story />
      </ShowTitle>
    ),
  ],
  render({ title, subtitle }) {
    return (
      <Title title="Base Title" subtitle="Base Subtitle">
        <Title title={title} subtitle={subtitle}>
          Content
        </Title>
      </Title>
    )
  },
}

const ShowTitle = observer(({ children }: { children?: ReactNode }) => {
  const [title, subtitle] = useTitle()
  return (
    <>
      <MantineTitle order={1}>{title}</MantineTitle>
      <MantineTitle order={3}>{subtitle}</MantineTitle>
      {children}
    </>
  )
})
