import {
  Cart as CartView,
  CartRegistration,
  CurrencyContext,
  LineItem,
  Modifier,
  Title,
  Options,
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
import {
  Anchor,
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from "@mantine/core"
import { IconPlus, IconShoppingCartCheck } from "@tabler/icons-react"
import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import {
  PaymentContext,
  PaymentResult,
  usePayment,
  usePaymentAPI,
  usePaymentMethods,
  usePaymentMethodsDialog,
} from "@open-event-systems/registration-payment"
import {
  Cart,
  CartConflictError,
  CartConflictResult,
  CartPricingResult,
  isResponseError,
} from "@open-event-systems/registration-common"

declare module "@tanstack/react-router" {
  interface HistoryState {
    cartPageDialog?: "paymentMethods" | "payment" | "error"
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
      <Suspense fallback={<CartView.Placeholder />}>
        <CartComponent eventId={eventId} />
      </Suspense>
    </Title>
  )
}

const CartComponent = ({ eventId }: { eventId: string }) => {
  const [currentCart, setCurrentCart] = useCurrentCart(eventId)

  // keep the current cart until unmounted
  const currentCartRef = useRef(currentCart)
  const currentCartId = currentCartRef.current.id

  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  const pricingResult = useCartPricingResult(currentCartId)

  const interviewOptions = useInterviewOptionsDialog(eventId, currentCartId)

  const showCheckout = pricingResult.registrations.length > 0

  return (
    <>
      {pricingResult.registrations.length > 0 ? (
        <CartPricingResultComponent
          eventId={eventId}
          cartId={currentCartId}
          setCurrentCart={(c) => {
            currentCartRef.current = c
            setCurrentCart(c)
          }}
        />
      ) : (
        <CartView.Empty />
      )}
      <Box flex={{ base: "auto", xs: "auto", sm: "initial" }} />
      <Grid justify="space-between">
        {interviewOptions.options.length > 0 && (
          <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
            <CartAddButton
              eventId={eventId}
              cartId={currentCartId}
              showCheckout={showCheckout}
            />
          </Grid.Col>
        )}
        {showCheckout && (
          <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
            <CartCheckoutButton
              cartId={currentCartId}
              setPaymentId={setPaymentId}
              setPaymentMethodId={setPaymentMethodId}
            />
          </Grid.Col>
        )}
      </Grid>
      <CartPageDialog
        cartId={currentCartId}
        eventId={eventId}
        paymentId={paymentId}
        paymentMethodId={paymentMethodId}
        setPaymentMethodId={setPaymentMethodId}
        setPaymentId={setPaymentId}
        setCurrentCart={setCurrentCart}
      />
    </>
  )
}

const CartPricingResultComponent = ({
  eventId,
  cartId,
  setCurrentCart,
}: {
  eventId: string
  cartId: string
  setCurrentCart: (cart: Cart) => void
}) => {
  const cartAPI = useCartAPI()
  const pricingResult = useCartPricingResult(cartId)

  const removeFromCart = useMutation({
    mutationKey: ["self-service", "events", eventId, "carts", cartId],
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
      setCurrentCart(data)
    },
  })

  return (
    <CurrencyContext.Provider value={pricingResult.currency}>
      <CartView totalPrice={pricingResult.total_price}>
        {pricingResult.registrations.map((reg) => (
          <CartRegistration
            key={reg.id}
            name={reg.name}
            onRemove={() => {
              removeFromCart.mutate({
                cartId: cartId,
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
      </CartView>
    </CurrencyContext.Provider>
  )
}

const CartAddButton = ({
  eventId,
  cartId,
  showCheckout,
}: {
  eventId: string
  cartId: string
  showCheckout?: boolean
}) => {
  const interviewOptions = useInterviewOptionsDialog(eventId, cartId)
  return (
    <Button
      fullWidth
      variant={showCheckout ? "outline" : "filled"}
      leftSection={<IconPlus />}
      onClick={() => interviewOptions.show()}
    >
      Add Registration
    </Button>
  )
}

const CartCheckoutButton = ({
  cartId,
  setPaymentId,
  setPaymentMethodId,
}: {
  cartId: string
  setPaymentId: (id: null) => void
  setPaymentMethodId: (paymentMethodId: string | null) => void
}) => {
  const navigate = useNavigate()
  const router = useRouter()
  const paymentMethods = usePaymentMethods(cartId)
  const paymentMethodsDialog = usePaymentMethodsDialog({
    cartId,
    onShow: useCallback(() => {
      navigate({
        state: {
          ...router.history.location.state,
          cartPageDialog: "paymentMethods",
        },
      })
      router
    }, []),
    onSelect: useCallback(
      (optionId: string) => {
        setPaymentMethodId(optionId)
        navigate({
          state: {
            ...router.history.location.state,
            cartPageDialog: "payment",
          },
          replace: paymentMethods.length != 1,
        })
      },
      [paymentMethods.length],
    ),
  })
  return (
    <Button
      fullWidth
      variant="filled"
      leftSection={<IconShoppingCartCheck />}
      onClick={() => {
        setPaymentId(null)
        paymentMethodsDialog.show()
      }}
    >
      Checkout
    </Button>
  )
}

const CartPageDialog = ({
  cartId,
  eventId,
  paymentId,
  paymentMethodId,
  setPaymentMethodId,
  setPaymentId,
  setCurrentCart,
}: {
  cartId: string
  eventId: string
  paymentId: string | null
  setPaymentId: (paymentId: string | null) => void
  paymentMethodId: string | null
  setPaymentMethodId: (paymentMethodId: string | null) => void
  setCurrentCart: (cart: Cart | null) => void
}) => {
  const loc = useLocation()
  const navigate = useNavigate()
  const router = useRouter()
  const paymentAPI = usePaymentAPI()
  const queryClient = useQueryClient()
  const pricingResult = useCartPricingResult(cartId)
  const [cartError, setCartError] = useState<string[] | null>(null)
  const canceledRef = useRef(false)

  const createPayment = useMutation({
    mutationKey: ["carts", cartId, "create-payment"],
    async mutationFn({ method }: { method: string }) {
      return await paymentAPI.createPayment(cartId, method)
    },
    onSuccess(res) {
      queryClient.setQueryData(["payments", res.id], res)
    },
  })

  const paymentMethods = usePaymentMethods(cartId)
  const paymentMethodsDialog = usePaymentMethodsDialog({
    cartId,
    onSelect: useCallback(
      (optionId: string) => {
        setPaymentMethodId(optionId)
        navigate({
          state: {
            ...router.history.location.state,
            cartPageDialog: "payment",
          },
          replace: paymentMethods.length != 1,
        })
      },
      [paymentMethods.length],
    ),
    onClose: useCallback(() => {
      router.history.go(-1)
    }, []),
  })

  const paymentQuery = useQuery<PaymentResult>({
    queryKey: ["payments", paymentId],
    enabled: false,
  })

  const payment = usePayment({
    paymentId,
    result: paymentQuery.data,
    onClose: useCallback(() => {
      if (paymentQuery.data?.status == "completed") {
        navigate({
          to: registrationsRoute.to,
          params: {
            eventId: eventId,
          },
        })
      } else {
        canceledRef.current = true
        router.history.go(-1)
      }
    }, [eventId, paymentQuery.data?.status]),
    onError: useCallback((e: unknown) => {
      if (isResponseError(e) && e.status == 409) {
        const errors = handleConflict(e, pricingResult)
        setCartError(errors)
        navigate({
          state: {
            ...router.history.location.state,
            cartPageDialog: "error",
          },
          replace: true,
        })
      }
    }, []),
  })

  const dialogTypeState = loc.state.cartPageDialog
  const dialogTypeRef = useRef(dialogTypeState)

  if (dialogTypeState) {
    dialogTypeRef.current = dialogTypeState
  }

  const dialogType = dialogTypeState ?? dialogTypeRef.current

  useEffect(() => {
    if (dialogTypeState == "payment" && paymentMethodId && !paymentId) {
      createPayment
        .mutateAsync({ method: paymentMethodId })
        .then((res) => {
          canceledRef.current = false
          setPaymentId(res.id)
        })
        .catch((e) => {
          if (isResponseError(e) && e.status == 409) {
            const errors = handleConflict(e, pricingResult)
            setCartError(errors)
            navigate({
              state: {
                ...router.history.location.state,
                cartPageDialog: "error",
              },
              replace: true,
            })
          }
        })
    }
  }, [dialogTypeState, paymentMethodId, paymentId, createPayment.mutateAsync])

  useEffect(() => {
    if (payment.result?.status == "completed") {
      setCurrentCart(null)
    }
  }, [payment.result?.status])

  useEffect(() => {
    if (
      !dialogTypeState &&
      payment.result?.status == "pending" &&
      !canceledRef.current
    ) {
      canceledRef.current = true
      payment
        .cancel()
        .catch(() => null)
        .then(() => {
          setPaymentId(null)
        })
    }
  }, [dialogTypeState, payment.result?.status])

  let title
  let content

  if (dialogType == "paymentMethods") {
    title = "Payment"
    content = (
      <Options
        options={paymentMethodsDialog.options}
        onSelect={(optionId) => paymentMethodsDialog.select(optionId)}
      />
    )
  } else if (dialogType == "payment") {
    title = "Payment"
    content = (
      <PaymentContext.Provider value={payment}>
        <payment.Component>
          {(renderProps) => (
            <>
              <Stack>
                {renderProps.content}
                {payment.error && (
                  <Text span c="red" size="sm">
                    {payment.error}
                  </Text>
                )}
                {renderProps.controls && (
                  <Group justify="flex-end">{renderProps.controls}</Group>
                )}
              </Stack>
              <LoadingOverlay visible={payment.submitting} />
            </>
          )}
        </payment.Component>
      </PaymentContext.Provider>
    )
  } else if (dialogType == "error") {
    title = "Error"
    content = (
      <Stack>
        <Text>
          There are errors with this cart:
          <ul>{cartError?.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </Text>
        <Button
          variant="outline"
          fullWidth
          onClick={() => paymentMethodsDialog.close()}
        >
          Close
        </Button>
      </Stack>
    )
  }

  return (
    <Modal
      title={title}
      centered
      opened={!!loc.state.cartPageDialog}
      onClose={() => {
        if (dialogType == "payment") {
          payment.close()
        } else {
          paymentMethodsDialog.close()
        }
      }}
    >
      {content}
    </Modal>
  )
}

const handleConflict = (e: unknown, pricingResult: CartPricingResult) => {
  if (!isResponseError(e) || e.status != 409) {
    throw e
  }

  const errorResp = e.json as CartConflictError

  return errorResp.results.map((r) =>
    formatErrorForRegistration(r, pricingResult),
  )
}

const formatErrorForRegistration = (
  result: CartConflictResult,
  pricingResult: CartPricingResult,
) => {
  const reg = pricingResult.registrations.find((r) => r.id == result.change.id)
  const name = reg?.name ?? ""

  if (result.errors.includes("version")) {
    return `The registration for ${name} has changed. Please remove it and make your changes again.`
  } else {
    return `The registration for ${name} cannot be included in this cart.`
  }
}
