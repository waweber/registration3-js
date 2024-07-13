import { Currency } from "#src/components/index.js"
import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export type ReceiptModifierProps = {
  name: string
  amount: number
} & Omit<ComponentPropsWithoutRef<"tr">, "children">

export const ReceiptModifier = (props: ReceiptModifierProps) => {
  const { name, amount, className, ...other } = props

  return (
    <tr className={clsx("ReceiptModifier-root", className)} {...other}>
      <td colSpan={2} className="ReceiptModifier-name">
        {name}
      </td>
      <td className="ReceiptModifier-amount">
        <Currency amount={amount} />
      </td>
    </tr>
  )
}
