import { Box, BoxProps, useProps } from "@mantine/core"
import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export type LogoProps = ComponentPropsWithoutRef<"img"> & BoxProps & {}

export const Logo = (props: LogoProps) => {
  const { className, ...other } = useProps("Logo", {}, props)

  return (
    <Box
      className={clsx("Logo-root", className)}
      component="img"
      alt=""
      {...other}
    />
  )
}
