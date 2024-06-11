import type { Preview } from "@storybook/react"
import { DEFAULT_THEME, MantineProvider } from "@mantine/core"
import React from "react"

import "@mantine/core/styles.css"
import "../src/styles.scss"
import exampleLogo from "../resources/example-logo.svg"

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
      <MantineProvider
        theme={{
          ...DEFAULT_THEME,
          components: {
            Logo: {
              defaultProps: {
                src: exampleLogo,
              },
            },
          },
        }}
      >
        <Story />
      </MantineProvider>
    ),
  ],
}

export default preview
