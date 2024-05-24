import {
  Cart,
  CartRegistration,
  CurrencyContext,
  LineItem,
  Modifier,
  Title,
} from "@open-event-systems/registration-common/components"
import { useEvent } from "../hooks/api.js"
import {
  useCartAPI,
  useCartPricingResult,
  useCurrentCart,
} from "../hooks/cart.js"
import { cartRoute, registrationsRoute } from "./index.js"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Suspense } from "react"
import { useInterviewOptionsDialog } from "../hooks/interview.js"
import { Anchor, Box, Button, Grid } from "@mantine/core"
import { IconPlus, IconShoppingCartCheck } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"

export const CartPage = () => {
  const { eventId } = cartRoute.useParams()

  useEvent(eventId)

  return (
    <Title title="Cart" subtitle="Your current shopping cart">
      <Anchor component={Link} to={registrationsRoute.to}>
        &laquo; View registrations
      </Anchor>
      <Suspense fallback={<Cart.Placeholder />}>
        <CartComponent eventId={eventId} />
      </Suspense>
    </Title>
  )
}

const CartComponent = ({ eventId }: { eventId: string }) => {
  const [currentCart, setCurrentCart] = useCurrentCart(eventId)
  const pricingResult = useCartPricingResult(currentCart.id)
  const interviewOptions = useInterviewOptionsDialog()
  const currentPricingResult = useCartPricingResult(currentCart.id)

  const showCheckout = currentPricingResult.registrations.length > 0

  const cartAPI = useCartAPI()
  const removeFromCart = useMutation({
    mutationKey: ["self-service", "events", eventId, "carts", currentCart.id],
    async mutationFn({
      cartId,
      registrationId,
    }: {
      cartId: string
      registrationId: string
    }) {
      return await cartAPI.removeRegistrationFromCart(cartId, registrationId)
    },
    onSuccess(data) {
      setCurrentCart(data.id)
    },
  })

  return (
    <CurrencyContext.Provider value={pricingResult.currency}>
      <Cart totalPrice={pricingResult.total_price}>
        {pricingResult.registrations.map((reg) => (
          <CartRegistration
            key={reg.id}
            name={reg.name}
            onRemove={() => {
              removeFromCart.mutate({
                cartId: currentCart.id,
                registrationId: reg.id,
              })
            }}
          >
            {reg.line_items.map((li, i) => (
              <LineItem
                key={i}
                name={li.name ?? ""}
                description={li.description}
                price={li.price}
                modifiers={li.modifiers.map((m, j) => (
                  <Modifier key={j} name={m.name ?? ""} amount={m.amount} />
                ))}
              />
            ))}
          </CartRegistration>
        ))}
      </Cart>
      <Box flex={{ base: "auto", xs: "auto", sm: "initial" }} />
      {interviewOptions.options.length > 0 && (
        <Grid justify="space-between">
          <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
            <Button
              fullWidth
              variant={showCheckout ? "outline" : "filled"}
              leftSection={<IconPlus />}
              onClick={interviewOptions.show}
            >
              Add Registration
            </Button>
          </Grid.Col>
          {showCheckout && (
            <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
              <Button
                fullWidth
                variant="filled"
                leftSection={<IconShoppingCartCheck />}
              >
                Checkout
              </Button>
            </Grid.Col>
          )}
        </Grid>
      )}
    </CurrencyContext.Provider>
  )
}
