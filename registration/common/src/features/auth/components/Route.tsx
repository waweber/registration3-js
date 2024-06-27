import { FullPageMenuLayout, Title } from "#src/components/index"
import { Outlet } from "@tanstack/react-router"

export const SignInRoute = () => {
  return (
    <Title title="Sign In">
      <FullPageMenuLayout title="Sign In">
        <Outlet />
      </FullPageMenuLayout>
    </Title>
  )
}

export const SignInRouteNotFound = () => {
  return (
    <Title title="Not Found">
      <FullPageMenuLayout.Content title="Not Found">
        The page was not found.
      </FullPageMenuLayout.Content>
    </Title>
  )
}
