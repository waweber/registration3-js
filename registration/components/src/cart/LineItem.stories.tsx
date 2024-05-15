import { Box } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"
import { LineItem } from "./LineItem.js"
import { Modifier } from "./Modifier.js"

const meta: Meta<typeof LineItem> = {
  component: LineItem,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <Box
        style={{
          maxWidth: 800,
          border: "#ccc dashed 1px",
          padding: 16,
          display: "grid",
          gridTemplateColumns:
            "[item-name-start item-description-start] 1fr [item-name-end item-description-end item-amount-start] auto [item-amount-end]",
          justifyItems: "end",
          alignItems: "baseline",
          columnGap: "16px",
        }}
      >
        <Story />
      </Box>
    ),
  ],
}

export default meta

export const Default: StoryObj<typeof LineItem> = {
  args: {
    name: "Example Item",
    description: "Example item description.",
    price: 5000,
    modifiers: [
      <Modifier key={1} name="Early Bird Discount" amount={-1000} />,
      <Modifier key={2} name="Shipping" amount={500} />,
    ],
  },
}
