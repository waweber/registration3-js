import {
  Cart,
  CartRegistration,
  CurrencyContext,
  LineItem,
  Modifier,
  OptionsDialog,
  Title,
} from "@open-event-systems/registration-common/components"
import { useEvent } from "../hooks/api.js"
import {
  useCartAPI,
  useCartPricingResult,
  useCurrentCart,
} from "../hooks/cart.js"
import { cartRoute, registrationsRoute } from "./index.js"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useInterviewOptionsDialog } from "../hooks/interview.js"
import { Anchor, Box, Button, Grid } from "@mantine/core"
import { IconPlus, IconShoppingCartCheck } from "@tabler/icons-react"
import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { PaymentModal } from "@open-event-systems/registration-payment/components"
import {
  PaymentContext,
  PaymentResult,
  usePayment,
  usePaymentAPI,
  usePaymentMethods,
  usePaymentMethodsDialog,
} from "@open-event-systems/registration-payment"

declare module "@tanstack/react-router" {
  interface HistoryState {
    showPayment?: boolean
    showPaymentMethods?: string
  }
}

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

  // keep the same cart until unmounted
  const currentCartRef = useRef<string>(currentCart.id)
  const currentCartId = currentCartRef.current

  const pricingResult = useCartPricingResult(currentCartId)
  const interviewOptions = useInterviewOptionsDialog()
  const currentPricingResult = useCartPricingResult(currentCartId)

  const showCheckout = currentPricingResult.registrations.length > 0

  const loc = useLocation()
  const showPayment = loc.state.showPayment

  const cartAPI = useCartAPI()
  const paymentAPI = usePaymentAPI()
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  const paymentMethods = usePaymentMethods(currentCartId)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  const paymentQuery = useQuery<PaymentResult>({
    queryKey: ["payments", paymentId],
    enabled: false,
  })
  const payment = paymentId ? paymentQuery.data : undefined

  const createPayment = useMutation({
    mutationKey: ["carts", currentCartId, "create-payment"],
    async mutationFn({ method }: { method: string }) {
      return await paymentAPI.createPayment(currentCartId, method)
    },
    onSuccess(res) {
      queryClient.setQueryData(["payments", res.id], res)
    },
  })

  const {
    show: showMethods,
    select: selectMethod,
    close: closeMethods,
    methods,
  } = usePaymentMethodsDialog({
    cartId: currentCartId,
    disableAutoselect: true,
    onShow: useCallback(() => {
      navigate({
        state: {
          ...loc.state,
          showPaymentMethods: currentCartId,
        },
      })
    }, [loc, currentCartId]),
    onClose: useCallback(() => {
      router.history.go(-1)
    }, []),
    onSelect: useCallback(
      (optionId: string) => {
        navigate({
          state: {
            ...loc.state,
            showPaymentMethods: undefined,
            showPayment: true,
          },
          replace: paymentMethods.length != 1,
        })

        createPayment.mutateAsync({ method: optionId }).then((res) => {
          setPaymentId(res.id)
        })
      },
      [loc, paymentMethods.length],
    ),
  })

  const paymentCtx = usePayment({
    paymentId,
    result: payment,
    onClose: useCallback(() => {
      if (payment?.status == "completed") {
        navigate({
          to: registrationsRoute.to,
          params: { eventId },
          replace: true,
        })
      } else {
        router.history.go(-1)
      }
    }, [payment?.status]),
  })

  useEffect(() => {
    if (!showPayment && paymentCtx.result?.status == "pending") {
      paymentCtx.cancel().catch(() => null)
    }
  }, [showPayment, paymentCtx.result])

  useEffect(() => {
    if (paymentCtx.result?.status == "completed") {
      setCurrentCart(null)
    }
  }, [currentCartId, paymentCtx.result])

  const removeFromCart = useMutation({
    mutationKey: ["self-service", "events", eventId, "carts", currentCartId],
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
      currentCartRef.current = data.id
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
                cartId: currentCartId,
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
                onClick={() => {
                  setPaymentId(null)
                  showMethods()
                }}
              >
                Checkout
              </Button>
            </Grid.Col>
          )}
        </Grid>
      )}
      <OptionsDialog
        title="Payment"
        opened={loc.state.showPaymentMethods == currentCartId}
        onClose={() => closeMethods()}
        onSelect={(id) => {
          selectMethod(id)
          closeMethods()
        }}
        options={methods.map((o) => ({
          id: o.id,
          label: o.name,
          button: true,
        }))}
      />
      <PaymentContext.Provider value={paymentCtx}>
        <paymentCtx.Component>
          {(renderProps) => (
            <PaymentModal opened={!!showPayment} {...renderProps} />
          )}
        </paymentCtx.Component>
      </PaymentContext.Provider>
    </CurrencyContext.Provider>
  )
}
