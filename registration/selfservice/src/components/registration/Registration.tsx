import {
  ActionIcon,
  Box,
  CSSProperties,
  Card,
  CardProps,
  Menu,
  Skeleton,
  Text,
  Title,
  useProps,
} from "@mantine/core"
import { IconDotsVertical } from "@tabler/icons-react"
import { Markdown } from "@open-event-systems/interview-components"
import clsx from "clsx"

export type RegistrationMenuItem = {
  label: string
  onClick: () => void
}

export type RegistrationProps = CardProps & {
  title?: string
  subtitle?: string
  description?: string
  headerColor?: string
  headerImage?: string
  new?: boolean
  n?: number
  menuItems?: RegistrationMenuItem[]
}

export const Registration = (props: RegistrationProps) => {
  const {
    className,
    style,
    title = "Registration",
    subtitle,
    description,
    headerColor,
    headerImage,
    new: _new,
    n = 0,
    menuItems = [],
    ...other
  } = useProps("Registration", {}, props)

  const cssProps: CSSProperties = {
    "--registration-n": n,
  }

  if (headerColor) {
    cssProps["--header-color"] = headerColor
  }

  if (headerImage) {
    cssProps["--header-image"] = `url(${headerImage})`
  }

  return (
    <Card
      className={clsx("Registration-root", className, {
        "Registration-new": _new,
      })}
      style={{ ...cssProps, ...style }}
      {...other}
    >
      <Card.Section className="Registration-header">
        <Box className="Registration-titleContainer">
          <Title className="Registration-title" order={4}>
            {title}
          </Title>
          <Text span className="Registration-subtitle">
            {subtitle}
          </Text>
        </Box>
        {menuItems.length > 0 ? (
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon
                className="Registration-menuIcon"
                aria-label="Edit registration"
                variant="subtle"
                c="inherit"
              >
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Change</Menu.Label>
              {menuItems.map((it, i) => (
                <Menu.Item key={i} onClick={it.onClick}>
                  {it.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        ) : null}
      </Card.Section>
      <Markdown className="Registration-description" component={Text} fz="sm">
        {description}
      </Markdown>
    </Card>
  )
}

const RegistrationPlaceholder = () => (
  <Card className="Registration-root">
    <Card.Section>
      <Skeleton radius={0}>
        <Box className="Registration-titleContainer">
          <Title className="Registration-title" order={4}>
            &nbsp;
          </Title>
          <Text span className="Registration-subtitle">
            &nbsp;
          </Text>
        </Box>
      </Skeleton>
    </Card.Section>
    <Skeleton mt={8} w="80%">
      <Text size="sm">&nbsp;</Text>
    </Skeleton>
    <Skeleton mt={8} w="80%">
      <Text size="sm">&nbsp;</Text>
    </Skeleton>
    <Skeleton mt={8} w="55%">
      <Text size="sm">&nbsp;</Text>
    </Skeleton>
  </Card>
)

Registration.Placeholder = RegistrationPlaceholder
