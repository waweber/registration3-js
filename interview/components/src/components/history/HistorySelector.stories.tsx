import { Meta, StoryObj } from "@storybook/react"
import { HistorySelector } from "./HistorySelector.js"
import { useState } from "react"

const meta: Meta<typeof HistorySelector> = {
  component: HistorySelector,
}

export default meta

export const Default: StoryObj<typeof HistorySelector> = {
  render(args) {
    const [selectedId, setSelectedId] = useState("3")
    return (
      <HistorySelector
        items={[
          { id: "1", label: "Intro" },
          { id: "2", label: "Your Name" },
          { id: "3", label: "Contact" },
        ]}
        selectedId={selectedId}
        onChange={(id) => setSelectedId(id)}
        allowDeselect={false}
        {...args}
      />
    )
  },
}
