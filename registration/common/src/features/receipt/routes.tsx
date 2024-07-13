import config from "#src/config.js"
import { fetchReceipt, Receipt } from "#src/features/receipt/api.js"
import { Receipt as ReceiptComponent } from "#src/features/receipt/components/Receipt.js"
import { parseISO } from "date-fns"
import { useEffect, useState } from "react"

export const ReceiptPage = () => {
  const pathParts = window.location.pathname.split("/")
  const receiptId = pathParts[pathParts.length - 1]

  const [receipt, setReceipt] = useState<Receipt | null | false>(null)

  useEffect(() => {
    if (receiptId) {
      fetchReceipt(config, receiptId).then((res) => {
        setReceipt(res ?? false)
      })
    }
  }, [receiptId])

  if (!receiptId || receipt === false) {
    return (
      <>
        <h1>Not Found</h1>
        <p>The receipt was not found.</p>
      </>
    )
  } else if (receipt == null) {
    return (
      <>
        <h1>Loading</h1>
        <p>Retrieving receipt...</p>
      </>
    )
  } else {
    return (
      <ReceiptComponent
        receiptId={receiptId}
        date={receipt.date_closed ? parseISO(receipt.date_closed) : undefined}
        receiptUrl={window.location.href}
        pricingResult={receipt.pricing_result}
      />
    )
  }
}
