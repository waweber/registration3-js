import "@mantine/core/styles.css"
import { createRoot } from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import { StrictMode, Suspense, lazy } from "react"
import { FullscreenLoader } from "#src/components/index.js"
import config from "#src/config.js"

const App = lazy(() => import("./App.js"))

const Loader = () => {
  return (
    <StrictMode>
      <MantineProvider theme={config.theme}>
        <FullscreenLoader>
          <Suspense fallback={<FullscreenLoader.Show />}>
            <App config={config} />
          </Suspense>
        </FullscreenLoader>
      </MantineProvider>
    </StrictMode>
  )
}

const app = <Loader />

const mount = (el: HTMLElement) => {
  const root = createRoot(el)
  root.render(app)
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
