import { Anchor, Grid, GridProps, Text, useProps } from "@mantine/core"
import clsx from "clsx"
import { Registration, RegistrationProps } from "./Registration.js"
import { IconAlertCircle } from "@tabler/icons-react"
import { useContext } from "react"
import { AuthContext } from "#src/api/AuthProvider.js"

export type RegistrationListProps = Omit<GridProps, "children"> & {
  registrations?: (RegistrationProps & { key: string })[]
}

export const RegistrationList = (props: RegistrationListProps) => {
  const {
    className,
    registrations = [],
    ...other
  } = useProps("RegistrationList", {}, props)

  return (
    <Grid className={clsx("RegistrationList-root", className)} {...other}>
      {registrations.length == 0 && <RegistrationListEmpty />}
      {registrations.map(({ key, ...regProps }) => (
        <Grid.Col
          key={key}
          className="RegistrationList-col"
          span={{ base: 12, sm: 6, md: 4 }}
        >
          <Registration {...regProps} />
        </Grid.Col>
      ))}
    </Grid>
  )
}

const RegistrationListEmpty = () => {
  const auth = useContext(AuthContext)

  const showSignIn = !auth?.token?.email

  return (
    <Grid.Col span="auto" c="dimmed" className="RegistrationList-empty">
      <Text span>
        <IconAlertCircle />
      </Text>
      <Text span>
        You have no registrations for this event.
        {showSignIn && (
          <>
            {" "}
            <Anchor href="/sign-in">Sign In</Anchor> to see your current
            registrations.
          </>
        )}
      </Text>
    </Grid.Col>
  )
}

const RegistrationListPlaceholder = () => (
  <Grid className="RegistrationList-root">
    <Grid.Col
      className="RegistrationList-col"
      span={{ base: 12, sm: 6, md: 4, lg: 3 }}
    >
      <Registration.Placeholder />
    </Grid.Col>
    <Grid.Col
      className="RegistrationList-col"
      span={{ base: 12, sm: 6, md: 4, lg: 3 }}
    >
      <Registration.Placeholder />
    </Grid.Col>
    <Grid.Col
      className="RegistrationList-col"
      span={{ base: 12, sm: 6, md: 4, lg: 3 }}
    >
      <Registration.Placeholder />
    </Grid.Col>
  </Grid>
)

RegistrationList.Placeholder = RegistrationListPlaceholder
