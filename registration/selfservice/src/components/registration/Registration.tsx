import {
  ActionIcon,
  Box,
  Card,
  CardProps,
  Menu,
  Skeleton,
  Text,
  Title,
  useProps,
} from "@mantine/core"
import { Markdown } from "@open-event-systems/registration-common/components"
import { IconDotsVertical } from "@tabler/icons-react"
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
    menuItems = [],
    ...other
  } = useProps("Registration", {}, props)

  return (
    <Card
      className={clsx("Registration-root", className)}
      style={{ "--header-color": headerColor, ...style }}
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
