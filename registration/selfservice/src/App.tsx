import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router.js"
import { DEFAULT_THEME, MantineProvider } from "@mantine/core"

import "@mantine/core/styles.css"
import "@open-event-systems/registration-common/styles.scss"

export const App = () => {
  return (
    <MantineProvider theme={DEFAULT_THEME} forceColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  )
}
