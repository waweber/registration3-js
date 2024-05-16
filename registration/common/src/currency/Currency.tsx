import { createContext, useContext } from "react"
import { currencyDecimals } from "./currency-info.js"

export const CurrencyContext = createContext<string>("USD")

export type CurrencyProps = {
  code?: string
  amount?: number
}

/**
 * Displays integer currency values formatted as fractional values.
 */
export const Currency = ({ code, amount }: CurrencyProps) => {
  const ctx = useContext(CurrencyContext)
  code = (code ?? ctx).toUpperCase()

  if (amount == null) {
    return null
  }

  const [asDecimal, digits] = toDecimal(amount, code)
  return format(asDecimal, code, digits)
}

const toDecimal = (amount: number, code: string): [number, number] => {
  const digits = currencyDecimals[code] ?? 2
  const scale = Math.pow(10, -digits)
  return [amount * scale, digits]
}

const format = (amount: number, code: string, fracDigits: number): string => {
  const funcs: ((
    amount: number,
    code: string,
    fracDigits: number,
    display?: string,
  ) => string)[] = [
    (a, c, d) => formatIntl(a, c, d, "symbol"),
    (a, c, d) => formatIntl(a, c, d),
    formatFallback,
  ]

  for (const func of funcs) {
    try {
      return func(amount, code, fracDigits)
    } catch (_) {
      continue
    }
  }
  return amount.toFixed(2)
}

const formatIntl = (
  amount: number,
  code: string,
  fracDigits: number,
  display?: string,
): string => {
  const opts: Intl.NumberFormatOptions & { currencyDisplay?: string } = {
    style: "currency",
    minimumFractionDigits: fracDigits,
    maximumFractionDigits: fracDigits,
    currency: code,
  }

  if (display) {
    opts.currencyDisplay = display
  }

  const intl = new Intl.NumberFormat(undefined, opts)
  return intl.format(amount)
}

const formatFallback = (
  amount: number,
  code: string,
  fracDigits: number,
): string => {
  return `${amount.toFixed(fracDigits)} ${code}`
}
