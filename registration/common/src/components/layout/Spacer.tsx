import { Box, BoxProps } from "@mantine/core"
import clsx from "clsx"

export const Spacer = ({ className, ...other }: BoxProps) => (
  <Box className={clsx("Spacer-root", className)} {...other}></Box>
)
