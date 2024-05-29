import { Button, Skeleton, Stack, StackProps, useProps } from "@mantine/core"
import clsx from "clsx"

export type OptionsProps = Omit<StackProps, "onSelect"> & {
  options?:
    | {
        id: string
        label: string
        button?: boolean
        href?: string
      }[]
    | null
  onSelect?: (optionId: string) => void
}

export const Options = (props: OptionsProps) => {
  const {
    className,
    options,
    onSelect = () => void 0,
    ...other
  } = useProps("Options", {}, props)

  let content

  if (options) {
    content = options.map((o) =>
      o.button ? (
        <Button
          key={o.id}
          variant="subtle"
          fullWidth
          onClick={() => onSelect(o.id)}
        >
          {o.label}
        </Button>
      ) : (
        <Button
          key={o.id}
          component="a"
          variant="subtle"
          fullWidth
          onClick={(e) => {
            e.preventDefault()
            onSelect(o.id)
          }}
        >
          {o.label}
        </Button>
      ),
    )
  } else {
    content = <Options.Placeholder />
  }

  return (
    <Stack className={clsx("Options-root", className)} gap="xs" {...other}>
      {content}
    </Stack>
  )
}

const OptionsPlaceholder = () => (
  <>
    <Skeleton h={36} />
    <Skeleton h={36} />
  </>
)

Options.Placeholder = OptionsPlaceholder
