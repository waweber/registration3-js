import {
  Anchor,
  AnchorProps,
  Box,
  Divider,
  Paper,
  PaperProps,
  useProps,
} from "@mantine/core"
import { ReactNode } from "@tanstack/react-router"
import clsx from "clsx"
import {
  ComponentPropsWithoutRef,
  createContext,
  MouseEvent,
  useContext,
} from "react"

export type RecentRegistrationProps = {
  checkInId?: string | null
  name?: string | null
  number?: number | null
  nickname?: string | null
  href?: string | null
  onClick?: (e: MouseEvent) => void
} & PaperProps

export const RecentRegistration = (props: RecentRegistrationProps) => {
  const {
    checkInId,
    name,
    number,
    nickname,
    href,
    onClick,
    className,
    ...other
  } = useProps("RecentRegistration", {}, props)

  return (
    <Paper
      className={clsx(className, "RecentRegistration-root")}
      withBorder
      shadow="xs"
      {...other}
    >
      <HrefContext.Provider value={[href || null, onClick || (() => {})]}>
        <RegLink
          className="RecentRegistration-checkInId"
          tabIndex={checkInId != null ? undefined : -1}
        >
          {checkInId}
        </RegLink>
        <RegLink
          className="RecentRegistration-name"
          tabIndex={checkInId != null ? -1 : undefined}
        >
          {name}
        </RegLink>
        <RegLink className="RecentRegistration-number">{number}</RegLink>
        <RegLink className="RecentRegistration-nickname">{nickname}</RegLink>
      </HrefContext.Provider>
    </Paper>
  )
}

const RegLink = (props: AnchorProps & ComponentPropsWithoutRef<"a">) => {
  const { ...other } = props
  const [href, onClick] = useContext(HrefContext)

  return (
    <Anchor
      href={href || undefined}
      onClick={onClick}
      tabIndex={-1}
      {...other}
    />
  )
}

const HrefContext = createContext<
  readonly [string | null, (e: MouseEvent) => void]
>([null, () => {}])
