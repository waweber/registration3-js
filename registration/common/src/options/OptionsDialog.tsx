import {
  Button,
  LoadingOverlay,
  Modal,
  ModalProps,
  NavLink,
  Skeleton,
  Stack,
  useProps,
} from "@mantine/core"
import clsx from "clsx"
import { useCallback, useRef, useState } from "react"

export type OptionsDialogProps = Omit<ModalProps, "onSelect" | "children"> & {
  options?: OptionsDialogOption[]
  placeholder?: boolean
  onSelect?: (optionId: string) => Promise<void> | void
}

export type OptionsDialogOption = {
  id: string
  label: string
  button?: boolean
  href?: string
}

export const OptionsDialog = (props: OptionsDialogProps) => {
  const {
    className,
    classNames,
    onSelect,
    options,
    opened,
    placeholder,
    ...other
  } = useProps("OptionsDialog", {}, props)
  const prevItemsRef = useRef<OptionsDialogOption[]>(options ?? [])
  const [loading, setLoading] = useState(false)

  const handleSelect = useCallback(
    (id: string) => {
      if (onSelect) {
        const ret = onSelect(id)
        if (ret && "then" in ret) {
          setLoading(true)
          ret
            .then(() => {
              setLoading(false)
            })
            .catch(() => {
              setLoading(false)
            })
        }
      }
    },
    [onSelect],
  )

  if (options && opened) {
    prevItemsRef.current = options
  }

  const optsOrPrev = opened ? options : prevItemsRef.current

  const opts =
    !placeholder &&
    optsOrPrev?.map((opt) => (
      <Button
        component={opt.button ? "button" : "a"}
        key={opt.id}
        variant="subtle"
        onClick={() => handleSelect(opt.id)}
        href={opt.href}
      >
        {opt.label}
      </Button>
    ))

  return (
    <Modal
      className={clsx("OptionsDialog-root", className)}
      centered
      opened={opened}
      classNames={{
        ...classNames,
        body: clsx("OptionsDialog-body", classNames?.body),
      }}
      size="sm"
      {...other}
    >
      <Stack gap="xs">
        {placeholder && (
          <>
            <Skeleton height={40} />
            <Skeleton height={40} />
          </>
        )}
        {opts}
        <LoadingOverlay visible={loading} />
      </Stack>
    </Modal>
  )
}
