import { Button, ButtonProps, Group, GroupProps, useProps } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useFieldContext } from "../context.js"
import { getOptions } from "./util.js"
import clsx from "clsx"
import { useRef } from "react"

export type ButtonsSelectFieldProps = Omit<GroupProps, "children"> & {
  ButtonProps?: Partial<ButtonProps>
}

export const ButtonsSelectField = observer((props: ButtonsSelectFieldProps) => {
  const { ButtonProps, ...other } = useProps("ButtonsSelectField", {}, props)
  const defaultSubmitRef = useRef<HTMLButtonElement>(null)
  const clickedRef = useRef(false)

  const [state, schema, path] = useFieldContext()

  const options = getOptions(schema)
  const defaultOpt = options.find((v) => v.default)

  return (
    <Group
      className="ButtonsSelectField-root"
      preventGrowOverflow={false}
      {...other}
    >
      <button
        ref={defaultSubmitRef}
        type="submit"
        hidden
        style={{ display: "none" }}
        onClick={(e) => {
          if (!clickedRef.current) {
            if (!defaultOpt) {
              // must actually click a button if there is no default
              e.preventDefault()
            } else {
              // implicit submit from enter, set the default value
              state?.setValue(path, defaultOpt.value)
            }
          }
          clickedRef.current = false
        }}
      ></button>
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={opt.primary ? "filled" : "outline"}
          type={opt.default ? "submit" : "button"}
          className={clsx("ButtonsSelectField-button", {
            "ButtonsSelectField-primary": opt.primary,
            "ButtonsSelectField-default": opt.default,
          })}
          onClick={() => {
            state?.setValue(path, opt.value)
            clickedRef.current = true
            if (!opt.default) {
              // submit via the default button
              defaultSubmitRef.current?.click()
            }
          }}
          {...ButtonProps}
        >
          {opt.label}
        </Button>
      ))}
    </Group>
  )
})
