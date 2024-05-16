import { createRoot } from "react-dom/client"
import { App } from "./App.js"

const el = document.getElementById("root")
if (el) {
  const root = createRoot(el)
  const app = <App />
  root.render(app)
}
