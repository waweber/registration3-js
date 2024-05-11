import type { Preview } from "@storybook/react"
import { MantineProvider } from "@mantine/core"
import React from "react"

import "@mantine/core/styles.css"
import "../src/styles.scss"

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
}

export default preview
