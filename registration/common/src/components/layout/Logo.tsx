import { useProps } from "@mantine/core"
import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export type LogoProps = {
  alt?: string
} & ComponentPropsWithoutRef<"img">

export const Logo = (props: LogoProps) => {
  const { className, alt, src, ...other } = useProps(
    "Logo",
    {
      alt: "Logo",
    },
    props,
  )

  return (
    <img
      className={clsx("Logo-root", className)}
      src={src}
      alt={alt}
      {...other}
    />
  )
}
