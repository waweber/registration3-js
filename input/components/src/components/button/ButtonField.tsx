import { Button, Grid, useProps } from "@mantine/core"
import { FieldProps } from "../../types.js"
import { MouseEvent, useCallback, useRef } from "react"
import { useController, useFormContext } from "react-hook-form"

export type ButtonFieldProps = FieldProps

export const ButtonField = (props: ButtonFieldProps) => {
  const { name, schema } = useProps("ButtonField", {}, props)
  const defaultSubmitRef = useRef<HTMLButtonElement | null>(null)
  const clickedRef = useRef(false)

  const { setValue } = useFormContext()
  useController({ name: name, defaultValue: "" })

  const oneOf = schema.oneOf || []

  const defaultSubmit = useCallback(
    (e: MouseEvent) => {
      if (!clickedRef.current) {
        if (schema.default !== undefined) {
          //implicit submit from enter, set the value
          setValue(name, schema.default)
        } else {
          //do nothing, if there is no default a button must be clicked
          e.preventDefault()
        }
      }
      clickedRef.current = false
    },
    [name, setValue],
  )

  const buttons = oneOf
    .filter((o) => o.const !== undefined)
    .map((o, i) => {
      const isDefault =
        schema.default !== undefined && o.const == schema.default
      const primary = !!o["x-primary"]

      return (
        <Grid.Col key={i} span={{ base: 12, xs: 12, sm: "content" }}>
          <Button
            className="ButtonField-button"
            type={isDefault ? "submit" : "button"}
            variant={primary ? "filled" : "outline"}
            fullWidth
            onClick={() => {
              setValue(name, o.const)
              clickedRef.current = true
              if (!isDefault) {
                //manually submit
                defaultSubmitRef.current?.click()
              }
            }}
          >
            {o.title}
          </Button>
        </Grid.Col>
      )
    })

  return (
    <Grid
      classNames={{
        root: "ButtonField-root",
      }}
      justify="flex-end"
    >
      <button
        ref={defaultSubmitRef}
        type="submit"
        hidden
        style={{ display: "none" }}
        onClick={defaultSubmit}
      ></button>
      {buttons}
    </Grid>
  )
}
