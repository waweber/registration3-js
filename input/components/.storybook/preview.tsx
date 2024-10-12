import type { Preview } from "@storybook/react"
import React from "react"

import { MantineProvider } from "@mantine/core"

import "@mantine/core/styles.css"

const preview: Preview = {
  parameters: {
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
