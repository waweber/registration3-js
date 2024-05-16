import { Box, BoxProps, Loader, useProps } from "@mantine/core"
import clsx from "clsx"

export type FullscreenLoaderProps = BoxProps & {}

export const FullscreenLoader = (props: FullscreenLoaderProps) => {
  const { className, ...other } = useProps("FullscreenLoader", {}, props)

  return (
    <Box className={clsx("FullscreenLoader-root", className)} {...other}>
      <Loader type="dots" />
    </Box>
  )
}
