import { Meta, StoryObj } from "@storybook/react"
import { Documents } from "./Documents.js"
import { useState } from "react"
import {
  makeMockPrintAPI,
  PrintAPIProvider,
} from "@open-event-systems/registration-lib/print"

const meta: Meta<typeof Documents> = {
  component: Documents,
}

export default meta

export const Default: StoryObj<typeof Documents> = {
  decorators: [
    (Story) => {
      const [api] = useState(() => makeMockPrintAPI())
      return (
        <PrintAPIProvider value={api}>
          <Story />
        </PrintAPIProvider>
      )
    },
  ],
  render() {
    return (
      <Documents
        documentTypes={{
          badge: "Badge",
        }}
        documents={{
          badge: "badge.pdf",
        }}
      />
    )
  },
}
