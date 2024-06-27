import type { Preview } from "@storybook/react"
import { MantineProvider } from "@mantine/core"
import React from "react"

import "@mantine/core/styles.css"
import "@open-event-systems/interview-components/styles.scss"
import "../src/styles.scss"

// @ts-ignore
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
