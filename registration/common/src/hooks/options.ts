import { useCallback } from "react"
import { OptionsProps } from "../components/options/Options.js"

export type UseOptionsDialogOptions = {
  options?: OptionsProps["options"] | null
  onSelect?: (optionId: string) => void
  onShow?: () => void
  onClose?: () => void
  disableAutoselect?: boolean
}

export type UseOptionsDialogHook = {
  options: Exclude<OptionsProps["options"], undefined | null>
  show: () => void
  select: (optionId: string) => void
  close: () => void
}

export const useOptionsDialog = ({
  options,
  onSelect,
  onShow,
  onClose,
  disableAutoselect,
}: UseOptionsDialogOptions): UseOptionsDialogHook => {
  return {
    options: options ?? [],
    show: useCallback(() => {
      if (options?.length == 1 && !disableAutoselect) {
        onSelect && onSelect(options[0].id)
      } else {
        onShow && onShow()
      }
    }, [options, disableAutoselect, onSelect, onShow]),
    select: useCallback(
      (id) => {
        onSelect && onSelect(id)
      },
      [onSelect],
    ),
    close: useCallback(() => {
      onClose && onClose()
    }, [onClose]),
  }
}
