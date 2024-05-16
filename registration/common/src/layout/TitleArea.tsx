import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Text,
  TextProps,
  Title,
  TitleProps,
  useProps,
} from "@mantine/core"
import clsx from "clsx"
import { Logo, LogoProps } from "./Logo.js"
import { observer } from "mobx-react-lite"
import { useTitle } from "../title/Title.js"

export type TitleAreaProps = {
  noLogo?: boolean
  LogoProps?: LogoProps
  TitleProps?: TitleProps
  SubtitleProps?: TextProps
  ContainerProps?: ContainerProps
} & BoxProps

export const TitleArea = observer((props: TitleAreaProps) => {
  const {
    className,
    noLogo,
    LogoProps,
    TitleProps,
    SubtitleProps,
    ContainerProps,
    ...other
  } = useProps("TitleArea", {}, props)

  const [title, subtitle] = useTitle()

  return (
    <Box className={clsx("TitleArea-root", className)} {...other}>
      <Container className="TitleArea-container" size="lg" {...ContainerProps}>
        {!noLogo && <Logo className="TitleArea-logo" {...LogoProps} />}
        <Title order={1} className="TitleArea-title" {...TitleProps}>
          {title}
        </Title>
        <Text className="TitleArea-subtitle" {...SubtitleProps}>
          {subtitle}
        </Text>
      </Container>
    </Box>
  )
})

TitleArea.displayName = "TitleArea"
