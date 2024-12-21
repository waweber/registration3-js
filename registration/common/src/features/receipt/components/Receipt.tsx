import { ComponentPropsWithoutRef, Fragment, ReactNode } from "react"
import clsx from "clsx"
import { format } from "date-fns"
import { ReceiptRegistration } from "#src/features/receipt/components/Registration.js"
import { ReceiptLineItem } from "#src/features/receipt/components/LineItem.js"
import { ReceiptModifier } from "#src/features/receipt/components/Modifier.js"
import { Currency, CurrencyContext } from "#src/components/index.js"
import { CartPricingResult } from "@open-event-systems/registration-lib/cart"

export type ReceiptProps = {
  receiptId: string
  date?: Date | null
  pricingResult: CartPricingResult
  receiptUrl?: string
} & ComponentPropsWithoutRef<"table">

export const Receipt = (props: ReceiptProps) => {
  const { receiptId, date, pricingResult, receiptUrl, ...other } = props

  return (
    <Receipt.Root
      receiptId={receiptId}
      date={date ? format(date, "yyyy-MM-dd, h:mm aaa") : undefined}
      totalPrice={pricingResult.total_price}
      {...other}
    >
      <CurrencyContext.Provider value={pricingResult.currency}>
        {pricingResult.registrations.map((reg, i) => (
          <Fragment key={reg.id}>
            <ReceiptRegistration
              id={reg.id}
              name={reg.name ?? undefined}
              receiptUrl={
                receiptUrl ? getReceiptUrl(receiptUrl, reg.id) : void 0
              }
            >
              {reg.line_items.map((li, i) => (
                <ReceiptLineItem
                  key={i}
                  name={li.name || ""}
                  price={li.price}
                  description={li.description}
                >
                  {li.modifiers.map((m, i) => (
                    <ReceiptModifier
                      key={i}
                      name={m.name || ""}
                      amount={m.amount}
                    />
                  ))}
                </ReceiptLineItem>
              ))}
            </ReceiptRegistration>
            <Receipt.Divider />
          </Fragment>
        ))}
      </CurrencyContext.Provider>
    </Receipt.Root>
  )
}

export type ReceiptRootProps = {
  receiptId: string
  date?: string
  totalPrice: number
  children?: ReactNode
} & ComponentPropsWithoutRef<"table">

const ReceiptRoot = (props: ReceiptRootProps) => {
  const { receiptId, date, totalPrice, className, children, ...other } = props

  return (
    <table className={clsx("Receipt-root", className)} {...other}>
      <thead className="Receipt-header">
        <tr className="Receipt-headerRow">
          <th scope="col" colSpan={3} className="Receipt-title">
            Receipt <span className="Receipt-id">{receiptId}</span>
          </th>
        </tr>
        {date && (
          <tr className="Receipt-headerRow">
            <th scope="col" colSpan={3} className="Receipt-date">
              {date}
            </th>
          </tr>
        )}
      </thead>
      {children}
      <tfoot className="Receipt-footer">
        <tr className="Receipt-footerRow">
          <td colSpan={2} className="Receipt-totalName">
            Total
          </td>
          <td className="Receipt-totalAmount">
            <Currency amount={totalPrice} />
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

export type ReceiptDividerProps = Omit<
  ComponentPropsWithoutRef<"tbody">,
  "children"
>

const ReceiptDivider = (props: ReceiptDividerProps) => {
  const { className, ...other } = props

  return (
    <tbody className={clsx("Receipt-divider", className)} {...other}></tbody>
  )
}

Receipt.Root = ReceiptRoot
Receipt.Divider = ReceiptDivider

const getReceiptUrl = (url: string, id: string) => {
  const urlObj = new URL(url, window.location.href)
  urlObj.hash = `#${id}`
  return urlObj.toString()
}
