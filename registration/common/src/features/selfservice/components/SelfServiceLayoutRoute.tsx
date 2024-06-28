import { saveToken } from "#src/api/token.js"
import { signInMenuRoute } from "#src/app/routes/signin.js"
import {
  AlertProvider,
  SelfServiceLayout,
  Title,
  UserMenu,
  useTitle,
} from "#src/components/index.js"
import { useAuth } from "#src/hooks/auth.js"
import { Outlet } from "@tanstack/react-router"
import { useLocation } from "@tanstack/react-router"
import { observer } from "mobx-react-lite"

export const SelfServiceLayoutRoute = observer(() => {
  const [title, subtitle] = useTitle()
  const auth = useAuth()
  const loc = useLocation()
  return (
    <SelfServiceLayout
      title={title}
      subtitle={subtitle}
      homeHref="/"
      userMenu={
        <UserMenu
          userName={auth.token?.email}
          onSignIn={() => {
            auth.returnURL = loc.pathname
            window.location.href = signInMenuRoute.to
          }}
          onSignOut={() => {
            saveToken(null)
            window.location.reload()
          }}
          signInOptions={[{ id: "sign-in", label: "Sign In" }]}
        />
      }
    >
      <Title title="Registration">
        <AlertProvider>
          <Outlet />
        </AlertProvider>
      </Title>
    </SelfServiceLayout>
  )
})

export default SelfServiceLayoutRoute
