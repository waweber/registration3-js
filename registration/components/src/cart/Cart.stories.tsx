import { Container } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"
import { ElementType } from "react"
import { Cart } from "./Cart.js"
import { CartRegistration } from "./CartRegistration.js"
import { LineItem } from "./LineItem.js"
import { Modifier } from "./Modifier.js"

const meta: Meta<typeof Cart> = {
  component: Cart,
  parameters: {
    layout: "padded",
  },
}

export default meta

export const Default: StoryObj<ElementType<{ editable: boolean }>> = {
  args: {
    editable: false,
  },
  render({ editable }) {
    const onRemove = editable
      ? () => {
          /* */
        }
      : undefined
    return (
      <Container size="md">
        <Cart totalPrice={7000}>
          <CartRegistration name="Person 1" onRemove={onRemove}>
            <LineItem
              key="item1"
              name="Item 1"
              price={2000}
              description="Description of item 1."
              modifiers={[
                <Modifier key="mod1" name="Extra Addon" amount={1000} />,
                <Modifier
                  key="mod2"
                  name="Early Bird Discount"
                  amount={-500}
                />,
              ]}
            />
            <LineItem
              key="item2"
              name="Item 2"
              price={3000}
              description="Description of item 2."
            />
          </CartRegistration>
          <Cart.Divider />
          <CartRegistration name="Person 2" onRemove={onRemove}>
            <LineItem
              key="item3"
              name="Item 3"
              price={1500}
              description="Description of item 3."
            />
          </CartRegistration>
        </Cart>
      </Container>
    )
  },
}

export const Placeholder = () => (
  <Container size="md">
    <Cart.Placeholder />
  </Container>
)
