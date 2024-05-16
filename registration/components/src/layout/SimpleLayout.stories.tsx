import { Meta, StoryObj } from "@storybook/react"

import { Text } from "@mantine/core"

import { SimpleLayout } from "./SimpleLayout.js"
import { Title } from "../title/Title.js"

import exampleLogo from "../../resources/example-logo.svg"

const meta: Meta<typeof SimpleLayout> = {
  component: SimpleLayout,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof SimpleLayout> = {
  render() {
    return (
      <SimpleLayout
        AppShellLayoutProps={{
          TitleAreaProps: { LogoProps: { src: exampleLogo } },
        }}
      >
        <Title title="Example Page" subtitle="An example page">
          <Text component="p">Example content.</Text>
        </Title>
      </SimpleLayout>
    )
  },
}
