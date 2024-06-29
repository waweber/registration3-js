import { Title } from "#src/components/index.js"
import {
  Alert,
  Card,
  CardProps,
  NavLink,
  Space,
  Text,
  useProps,
} from "@mantine/core"
import {
  IconChevronRight,
  IconExclamationCircle,
  IconSparkles,
} from "@tabler/icons-react"
import { Fragment } from "react/jsx-runtime"

export type AccessCodeOption = {
  id: string
  title: string
}

export type AccessCodeChangeOptions = {
  registrationId: string
  title: string
  options: AccessCodeOption[]
}

export type AccessCodeOptionsProps = Omit<
  CardProps,
  "children" | "onSelect"
> & {
  options?: AccessCodeOption[]
  changeOptions?: AccessCodeChangeOptions[]
  onSelect?: (selection: { id: string; registrationId: string | null }) => void
}

export const AccessCodeOptions = (props: AccessCodeOptionsProps) => {
  const {
    options = [],
    changeOptions = [],
    onSelect,
    ...other
  } = useProps("AccessCodeOptions", {}, props)

  return (
    <Card
      classNames={{
        root: "AccessCodeOptions-root",
      }}
      shadow="md"
      padding="xs"
      miw={280}
      maw={500}
      {...other}
    >
      <Alert title="Access Code" icon={<IconSparkles />}>
        You are using an access code. Choose an option below.
      </Alert>
      {changeOptions
        .filter((ro) => ro.options.length > 0)
        .map((ro) => (
          <Fragment key={ro.registrationId}>
            <Space h="xs" />
            <Text span fw="bold" component="h6">
              {ro.title}
            </Text>
            <Card.Section>
              {ro.options.map((o) => (
                <NavLink
                  key={o.id}
                  label={o.title}
                  component="button"
                  onClick={() =>
                    onSelect &&
                    onSelect({ id: o.id, registrationId: ro.registrationId })
                  }
                  rightSection={<IconChevronRight />}
                />
              ))}
            </Card.Section>
          </Fragment>
        ))}
      {options.length > 0 && (
        <>
          <Space h="xs" />
          <Text span fw="bold" component="h6">
            New Registration
          </Text>
        </>
      )}
      {options.length > 0 && (
        <Card.Section>
          {options.map((o) => (
            <NavLink
              key={o.id}
              label={o.title}
              component="button"
              onClick={() =>
                onSelect && onSelect({ id: o.id, registrationId: null })
              }
              rightSection={<IconChevronRight />}
            />
          ))}
        </Card.Section>
      )}
      <Space />
    </Card>
  )
}

const AccessCodeNotFound = (props: CardProps) => {
  const { ...other } = useProps("AccessCodeOptions", {}, props)
  return (
    <Title title="Not Found">
      <Card
        classNames={{
          root: "AccessCodeOptions-root",
        }}
        shadow="md"
        padding="xs"
        miw={280}
        maw={500}
        {...other}
      >
        <Alert
          title="Invalid Access Code"
          color="red"
          icon={<IconExclamationCircle />}
        >
          The access code was not found. It may have already been used or
          expired.
        </Alert>
      </Card>
    </Title>
  )
}

AccessCodeOptions.NotFound = AccessCodeNotFound

export default AccessCodeOptions
