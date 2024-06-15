import { Button, ButtonProps, Grid, GridProps, useProps } from "@mantine/core"
import { observer } from "mobx-react-lite"
import { useFieldContext } from "../context.js"
import { getOptions } from "./util.js"
import clsx from "clsx"
import { useRef } from "react"

export type ButtonsSelectFieldProps = Omit<GridProps, "children"> & {
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
    <Grid
      classNames={{
        root: "ButtonsSelectField-root",
      }}
      justify="flex-end"
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
        <Grid.Col key={opt.value} span={{ base: 12, xs: 12, sm: "content" }}>
          <Button
            variant={opt.primary ? "filled" : "outline"}
            type={opt.default ? "submit" : "button"}
            fullWidth
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
        </Grid.Col>
      ))}
    </Grid>
  )
})
