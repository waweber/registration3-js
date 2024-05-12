import { Select, SelectProps, useProps } from "@mantine/core"
import clsx from "clsx"

export type HistorySelectorItem = {
  id: string
  label: string
}

export type HistorySelectorProps = Omit<
  SelectProps,
  "data" | "value" | "onChange"
> & {
  selectedId?: string
  items?: HistorySelectorItem[]
  onChange?: (selectedId: string) => void
}

export const HistorySelector = (props: HistorySelectorProps) => {
  const { className, selectedId, items, onChange, ...other } = useProps(
    "HistorySelector",
    {},
    props,
  )

  return (
    <Select
      className={clsx("HistorySelector-root", className)}
      data={items?.map((it) => ({
        value: it.id,
        label: it.label,
      }))}
      value={selectedId}
      onChange={(e) => {
        if (e && onChange) {
          onChange(e)
        }
      }}
      {...other}
    />
  )
}
