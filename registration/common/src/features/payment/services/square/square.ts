import { Card, Payments, Square } from "@square/web-payments-sdk-types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLayoutEffect, useState } from "react"

const PRODUCTION_CLIENT_URL = "https://web.squarecdn.com/v1/square.js"
const SANDBOX_CLIENT_URL = "https://sandbox.web.squarecdn.com/v1/square.js"

export type UseCardResult = {
  ref: (el: HTMLElement | null) => void
  card: Card | null
}

export const useCard = (
  payments: Payments,
  onSubmit?: (card: Card) => void,
): UseCardResult => {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [card, setCard] = useState<Card | null>(null)

  useLayoutEffect(() => {
    if (el) {
      const cardPromise = payments.card().then(async (card) => {
        await card.attach(el)
        setCard(card)
        return card
      })
      return () => {
        setCard(null)
        cardPromise.then((card) => card.destroy())
      }
    }
  }, [payments, el])

  useLayoutEffect(() => {
    if (card && onSubmit) {
      const handler = () => onSubmit(card)
      card.addEventListener("submit", handler)
      return () => {
        card.removeEventListener("submit", handler)
      }
    }
  }, [card, onSubmit])

  return {
    ref: setEl,
    card,
  }
}

export const useSquare = (
  applicationId: string,
  locationId: string,
  sandbox = false,
): Payments => {
  const query = useSuspenseQuery({
    queryKey: [
      "payment-services",
      { service: "square", applicationId, locationId, sandbox },
    ],
    async queryFn() {
      const square = await loadSquare(sandbox)
      return square.payments(applicationId, locationId)
    },
    staleTime: Infinity,
  })

  return query.data
}

/**
 * Load the Square web sdk via a script tag.
 * @param sandbox - whether to use the sandbox environment
 * @returns a promise that completes with the Square global object.
 */
export const loadSquare = (sandbox = false): Promise<Square> => {
  if (window.Square) {
    return Promise.resolve(window.Square)
  }
  const url = sandbox ? SANDBOX_CLIENT_URL : PRODUCTION_CLIENT_URL

  return new Promise<Square>((resolve) => {
    const el = document.createElement("script")
    el.setAttribute("src", url)

    function onLoad(this: HTMLScriptElement) {
      this.remove()
      if (window.Square) {
        resolve(window.Square)
      }
    }

    el.addEventListener("load", onLoad)

    document.body.appendChild(el)
  })
}
