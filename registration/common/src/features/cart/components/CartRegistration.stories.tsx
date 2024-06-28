import {
  CartRegistration,
  LineItem,
  Modifier,
} from "#src/features/cart/components/index.js"
import { Box } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof CartRegistration> = {
  component: CartRegistration,
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
            "[icon-start] auto [icon-end item-name-start registration-name-start item-description-start] minmax(1rem, 1fr) [item-name-end item-description-end item-amount-start] auto [registration-name-end item-amount-end]",
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

export const Default: StoryObj<typeof CartRegistration> = {
  args: {
    name: "Example Registration",
    onRemove: undefined,
    children: [
      <LineItem
        key={1}
        name="Basic Registration"
        description="Basic registration which includes basic stuff."
        price={5000}
        modifiers={[
          <Modifier key={1} name="Early Bird Discount" amount={-500} />,
        ]}
      />,
      <LineItem
        key={2}
        name="VIP Upgrade"
        description="Add VIP status"
        price={2500}
      />,
    ],
  },
}

export const WithRemove: StoryObj<typeof CartRegistration> = {
  args: {
    name: "Example Registration",
    children: [
      <LineItem
        key={1}
        name="Basic Registration"
        description="Basic registration which includes basic stuff."
        price={5000}
        modifiers={[
          <Modifier key={1} name="Early Bird Discount" amount={-500} />,
        ]}
      />,
      <LineItem
        key={2}
        name="VIP Upgrade"
        description="Add VIP status"
        price={2500}
      />,
    ],
    onRemove: () => void 0,
  },
}
