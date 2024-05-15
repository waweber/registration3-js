import { Meta, StoryObj } from "@storybook/react"
import { HistoryPanel } from "./HistoryPanel.js"
import { useState } from "react"
import { Button, Stack } from "@mantine/core"

const meta: Meta<typeof HistoryPanel> = {
  component: HistoryPanel,
}

export default meta

export const Default: StoryObj<typeof HistoryPanel> = {
  render(args) {
    return (
      <HistoryPanel {...args} style={{ height: 500, width: 200 }}>
        <HistoryPanel.Item
          label="Intro"
          href="#"
          onClick={(e) => e.preventDefault()}
        />
        <HistoryPanel.Item
          label="Your Name"
          href="#"
          onClick={(e) => e.preventDefault()}
        />
        <HistoryPanel.Item
          label="Contact"
          href="#"
          onClick={(e) => e.preventDefault()}
          active
        />
      </HistoryPanel>
    )
  },
}

export const Scroll: StoryObj<typeof HistoryPanel> = {
  render(args) {
    const [activeId, setActiveId] = useState(9)

    const [size, setSize] = useState(10)

    const items = Array.from(new Array(size).keys()).map((i) => (
      <HistoryPanel.Item
        key={i}
        href="#"
        label={`Item ${i + 1}`}
        onClick={(e) => {
          e.preventDefault()
          setActiveId(i)
        }}
        active={i == activeId}
      />
    ))

    return (
      <Stack>
        <HistoryPanel {...args} style={{ height: 300, width: 200 }}>
          {items}
        </HistoryPanel>
        <Button
          onClick={() => {
            setSize(size + 1)
            setActiveId(size)
          }}
        >
          Add
        </Button>
      </Stack>
    )
  },
}
