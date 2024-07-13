import { createRoot } from "react-dom/client"

import "./styles.css"
import { ReceiptPage } from "#src/features/receipt/routes.js"

const mount = (el: HTMLElement) => {
  const root = createRoot(el)
  root.render(<ReceiptPage />)
}

const el = document.getElementById("root")
if (el) {
  mount(el)
} else {
  document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("root")
    if (el) {
      mount(el)
    }
  })
}
