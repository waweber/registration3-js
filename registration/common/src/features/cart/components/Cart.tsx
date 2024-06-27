import { Currency } from "#src/components"
import {
  Box,
  BoxProps,
  Divider,
  DividerProps,
  Group,
  Skeleton,
  Text,
  useProps,
} from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import clsx from "clsx"
import { ReactNode } from "react"

export type CartProps = {
  children?: ReactNode
  totalPrice: number
  classNames?: {
    root?: string
    totalText?: string
    total?: string
    divider?: string
    placeholder?: string
  }
} & BoxProps

export const Cart = (props: CartProps) => {
  const { className, classNames, children, totalPrice, ...other } = useProps(
    "Cart",
    {},
    props,
  )

  return (
    <Box className={clsx("Cart-root", className, classNames?.root)} {...other}>
      {children}
      <CartDivider className={clsx("Cart-divider", classNames?.divider)} />
      <Text span className={clsx("Cart-totalText", classNames?.totalText)}>
        Total
      </Text>
      <Text span className={clsx("Cart-total", classNames?.total)}>
        <Currency amount={totalPrice} />
      </Text>
    </Box>
  )
}

const CartDivider = (props: DividerProps) => {
  const { className, ...other } = props

  return <Divider className={clsx("CartDivider-root", className)} {...other} />
}

Cart.Divider = CartDivider

type CartPlaceholderProps = BoxProps

const CartPlaceholder = (props: CartPlaceholderProps) => {
  const { className, ...other } = props

  const skCls = "CartPlaceholder-skeleton"

  return (
    <Box className={clsx("CartPlaceholder-root", className)} p="xs" {...other}>
      <Skeleton className={skCls} h={36} w={36} />
      <Skeleton
        className={skCls}
        height={36}
        width={230}
        style={{ justifySelf: "start" }}
      />

      <Skeleton
        className={skCls}
        height={16}
        width={150}
        style={{ gridColumn: "-3 / -2" }}
      />
      <Skeleton
        className={skCls}
        height={16}
        style={{ gridColumn: "-2 / -1" }}
      />

      <Skeleton
        className={skCls}
        height={16}
        width={150}
        style={{ gridColumn: "-3 / -2" }}
      />
      <Skeleton
        className={skCls}
        height={16}
        style={{ gridColumn: "-2 / -1" }}
      />

      <Cart.Divider />

      <Skeleton className={skCls} h={36} w={36} />
      <Skeleton
        className={skCls}
        height={36}
        width={230}
        style={{ justifySelf: "start" }}
      />

      <Skeleton
        className={skCls}
        height={16}
        width={150}
        style={{ gridColumn: "-3 / -2" }}
      />
      <Skeleton
        className={skCls}
        height={16}
        style={{ gridColumn: "-2 / -1" }}
      />

      <Skeleton
        className={skCls}
        height={16}
        width={150}
        style={{ gridColumn: "-3 / -2" }}
      />
      <Skeleton
        className={skCls}
        height={16}
        style={{ gridColumn: "-2 / -1" }}
      />

      <Cart.Divider />

      <Skeleton className={skCls} h={36} w={36} />
      <Skeleton
        className={skCls}
        height={36}
        width={230}
        style={{ justifySelf: "start" }}
      />

      <Skeleton
        className={skCls}
        height={16}
        width={150}
        style={{ gridColumn: "-3 / -2" }}
      />
      <Skeleton
        className={skCls}
        height={16}
        style={{ gridColumn: "-2 / -1" }}
      />

      <Skeleton
        className={skCls}
        height={16}
        width={150}
        style={{ gridColumn: "-3 / -2" }}
      />
      <Skeleton
        className={skCls}
        height={16}
        style={{ gridColumn: "-2 / -1" }}
      />
    </Box>
  )
}

Cart.Placeholder = CartPlaceholder

const CartEmpty = () => (
  <Group align="center" m="xl" c="dimmed">
    <IconAlertCircle />
    <Text span>Your cart is empty.</Text>
  </Group>
)

Cart.Empty = CartEmpty
