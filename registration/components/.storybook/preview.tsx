import type { Preview } from "@storybook/react"
import { DEFAULT_THEME, MantineProvider } from "@mantine/core"
import React from "react"

import "@mantine/core/styles.css"

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
      <MantineProvider theme={DEFAULT_THEME}>
        <Story />
      </MantineProvider>
    ),
  ],
}

export default preview
