import { Meta, StoryObj } from "@storybook/react"
import { Currency, CurrencyContext } from "./Currency.js"

const meta: Meta<typeof Currency> = {
  component: Currency,
}

export default meta

export const Default: StoryObj<typeof Currency> = {
  args: {
    amount: 10000,
    code: "USD",
  },
  render(args) {
    const { code, ...other } = args

    return (
      <CurrencyContext.Provider value={code ?? "USD"}>
        <Currency {...other} />
      </CurrencyContext.Provider>
    )
  },
}
