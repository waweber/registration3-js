import { Meta, StoryObj } from "@storybook/react"
import { OptionsDialog } from "./OptionsDialog.js"
import { useEffect, useState } from "react"
import { OptionsProps } from "./Options.js"
import { Box, Button } from "@mantine/core"
import { useOptionsDialog } from "../../hooks/options.js"

const meta: Meta<typeof OptionsDialog> = {
  component: OptionsDialog,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Default: StoryObj<typeof OptionsDialog> = {
  render() {
    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)
    const [options, setOptions] = useState<OptionsProps["options"]>(null)

    useEffect(() => {
      if (show) {
        window.setTimeout(() => {
          setOptions([
            { id: "option1", label: "Option 1", button: true },
            { id: "option2", label: "Option 2", button: true },
          ])
        }, 500)
      } else {
        setOptions(null)
      }
    }, [show])

    return (
      <>
        <Box p="xs">
          Value: {selected || "none"}
          <br />
          <Button onClick={() => setShow(true)}>Show</Button>
        </Box>
        <OptionsDialog
          title="Options"
          opened={show}
          options={options}
          onSelect={(id) => {
            setSelected(id)
            setShow(false)
          }}
          onClose={() => setShow(false)}
        />
      </>
    )
  },
}

export const With_Hook: StoryObj<typeof OptionsDialog> = {
  render() {
    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)
    const [options, setOptions] = useState<OptionsProps["options"]>(null)

    useEffect(() => {
      if (show) {
        window.setTimeout(() => {
          setOptions([
            { id: "option1", label: "Option 1", button: true },
            { id: "option2", label: "Option 2", button: true },
          ])
        }, 500)
      } else {
        setOptions(null)
      }
    }, [show])

    const {
      show: showDialog,
      select,
      close,
    } = useOptionsDialog({
      options: options,
      onSelect(optionId) {
        setSelected(optionId)
        setShow(false)
      },
      onShow() {
        setShow(true)
      },
      onClose() {
        setShow(false)
      },
    })

    return (
      <>
        <Box p="xs">
          Value: {selected || "none"}
          <br />
          <Button onClick={() => showDialog()}>Show</Button>
        </Box>
        <OptionsDialog
          title="Options"
          opened={show}
          options={options}
          onSelect={(id) => {
            select(id)
          }}
          onClose={() => close()}
        />
      </>
    )
  },
}
