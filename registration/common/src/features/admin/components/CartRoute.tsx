import {
  adminEventIndexRoute,
  adminEventRoute,
} from "#src/app/routes/admin/admin.js"
import { adminCartRoute } from "#src/app/routes/admin/cart.js"
import { Cart as CartView } from "#src/features/cart/components/Cart.js"
import { usePaymentMethodsDialog } from "#src/features/payment/hooks.js"
import {
  Cart,
  useCartPricingResult,
  useRemoveFromCart,
  useStickyCurrentCart,
} from "@open-event-systems/registration-lib/cart"
import {
  handleConflict,
  PaymentManagerProvider,
  useCreatePayment,
  usePayment,
  usePaymentManager,
} from "@open-event-systems/registration-lib/payment"
import { useStickyData } from "@open-event-systems/registration-lib/utils"
import { useLocation, useRouter } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useState } from "react"
import { CurrencyContext, Spacer, Title } from "#src/components/index.js"
import { Button, Grid, Select, Stack } from "@mantine/core"
import { PaymentModal } from "#src/features/payment/components/index.js"
import {
  CartRegistration,
  LineItem,
  Modifier,
} from "#src/features/cart/index.js"
import { IconShoppingCartCheck } from "@tabler/icons-react"
import { useRegistrationSearch } from "@open-event-systems/registration-lib/registration"
import { useAdminAPI } from "@open-event-systems/registration-lib/admin"
import {
  getInterviewStateQueryOptions,
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"
import { useQueryClient } from "@tanstack/react-query"
import { getDefaultUpdateURL } from "#src/utils.js"
import { adminAddRegistrationRoute } from "#src/app/routes/admin/registrations.js"

export const CartRoute = () => {
  const { eventId } = adminEventRoute.useParams()

  return (
    <Title title="Cart">
      <Stack>
        <CartComponent eventId={eventId} />
      </Stack>
    </Title>
  )
}

const CartComponent = ({ eventId }: { eventId: string }) => {
  const [currentCart, setCurrentCart] = useStickyCurrentCart(eventId)

  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [stickyPaymentId, disposePaymentId] = useStickyData(paymentId)
  const [cartError, setCartError] = useState<string | string[] | null>(null)

  const pricingResult = useCartPricingResult(currentCart.id)
  const results = useRegistrationSearch(
    eventId,
    "",
    { cart_id: currentCart.id },
    true,
  )

  const addOptions = useMemo(
    () => results.data?.pages[results.data.pages.length - 1].add_options,
    [results.data],
  )

  const payment = usePayment(stickyPaymentId)
  const navigate = adminCartRoute.useNavigate()
  const router = useRouter()
  const loc = useLocation()
  const completeRef = useRef(false)
  const cancelRef = useRef(false)
  const adminAPI = useAdminAPI()
  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const queryClient = useQueryClient()

  const createPayment = useCreatePayment(currentCart.id)

  const paymentMethods = usePaymentMethodsDialog({
    cartId: currentCart.id,
    onShow() {
      disposePaymentId()
      navigate({
        state: {
          cartModal: true,
        },
      })
    },
    onSelect(optionId) {
      disposePaymentId()
      if (!loc.state.cartModal) {
        navigate({
          state: {
            cartModal: true,
          },
        })
      }
      createPayment(optionId)
        .then((res) => {
          setPaymentId(res.id)
        })
        .catch((err) => {
          const errInfo = handleConflict(err, pricingResult)
          setCartError(errInfo)
        })
        .catch(() => {
          setCartError("An error occurred")
        })
    },
  })

  const manager = usePaymentManager({
    payment: payment,
    onUpdate(res) {
      if (res.status == "completed") {
        setCurrentCart(null)
        completeRef.current = true
      }
    },
    onClose(manager) {
      if (manager.payment?.status != "completed") {
        if (manager.payment?.status == "pending") {
          cancelRef.current = true
          manager.cancel()
        }
        router.history.go(-1)
      } else {
        navigate({
          to: adminEventIndexRoute.to,
          params: {
            eventId,
          },
        })
      }
    },
  })

  useEffect(() => {
    if (!loc.state.cartModal && completeRef.current) {
      setCurrentCart(null, true)
    }
  }, [loc.state.cartModal])

  useEffect(() => {
    if (!loc.state.cartModal) {
      if (!cancelRef.current && payment?.status == "pending") {
        manager.cancel()
        cancelRef.current = true
      }
    }
  }, [loc.state.cartModal, payment?.status, manager.cancel])

  useEffect(() => {
    if (payment?.status == "pending") {
      cancelRef.current = false
    }
  }, [payment?.status])

  const showCheckout = pricingResult.registrations.length > 0

  return (
    <>
      {pricingResult.registrations.length > 0 ? (
        <CartPricingResultComponent
          cartId={currentCart.id}
          setCurrentCart={(c) => {
            setCurrentCart(c, true)
          }}
        />
      ) : (
        <CartView.Empty />
      )}
      <Spacer flex={{ base: "auto", xs: "auto", sm: "initial" }} />
      <Grid justify="space-between">
        {addOptions && addOptions.length > 0 && (
          <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
            <Select
              data={addOptions?.map((o) => ({
                label: o.title,
                value: o.url,
              }))}
              value=""
              placeholder="Add Registration"
              onChange={(v) => {
                if (v) {
                  adminAPI
                    .startInterview(v)
                    .then((res) => {
                      return interviewAPI.update(res)
                    })
                    .then((res) => {
                      const record = interviewStore.add(res)
                      queryClient.setQueryData(
                        getInterviewStateQueryOptions(
                          interviewAPI,
                          interviewStore,
                          getDefaultUpdateURL(),
                          record.response.state,
                        ).queryKey,
                        record,
                      )
                      navigate({
                        to: adminAddRegistrationRoute.to,
                        params: {
                          eventId: eventId,
                        },
                        hash: `s=${record.response.state}`,
                      })
                    })
                }
              }}
            />
          </Grid.Col>
        )}
        {showCheckout && (
          <Grid.Col span={{ base: 12, xs: 12, sm: "content" }}>
            <CartCheckoutButton onShow={paymentMethods.show} />
          </Grid.Col>
        )}
      </Grid>
      <PaymentManagerProvider value={manager}>
        <PaymentModal
          cartId={currentCart.id}
          methods={paymentMethods.methods}
          opened={!!loc.state.cartModal}
          onSelectMethod={(method) => {
            paymentMethods.select(method)
          }}
          cartError={cartError}
        />
      </PaymentManagerProvider>
    </>
  )
}

const CartPricingResultComponent = ({
  cartId,
  setCurrentCart,
}: {
  cartId: string
  setCurrentCart: (cart: Cart) => void
}) => {
  const pricingResult = useCartPricingResult(cartId)
  const removeFromCart = useRemoveFromCart(cartId)

  return (
    <CurrencyContext.Provider value={pricingResult.currency}>
      <CartView totalPrice={pricingResult.total_price}>
        {pricingResult.registrations.map((reg) => (
          <CartRegistration
            key={reg.id}
            name={reg.name}
            onRemove={() => {
              removeFromCart.mutate(reg.id, {
                onSuccess(cart) {
                  setCurrentCart(cart)
                },
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

const CartCheckoutButton = ({ onShow }: { onShow: () => void }) => {
  return (
    <Button
      fullWidth
      variant="filled"
      leftSection={<IconShoppingCartCheck />}
      onClick={onShow}
    >
      Checkout
    </Button>
  )
}
