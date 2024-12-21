import { RegistrationSearch } from "#src/features/admin/components/search/RegistrationSearch.js"
import { Stack } from "@mantine/core"
import { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import "./RegistrationSearch.scss"

const meta: Meta<typeof RegistrationSearch> = {
  component: RegistrationSearch,
}

export default meta

export const Default: StoryObj<typeof RegistrationSearch> = {
  render() {
    const [value, setValue] = useState("")
    return (
      <Stack>
        <span>Value: {value}</span>
        <RegistrationSearch
          results={[
            {
              id: "1",
              status: "created",
              number: 101,
              name: "Test Person",
              email: "test@example.net",
            },
            {
              id: "2",
              status: "created",
              name: "Test Person",
              email: "test@example.net",
            },
            {
              id: "3",
              status: "created",
              number: 3027,
              name: "Test Person",
              email: "test@example.net",
            },
          ]}
          onSearch={(query) => {
            setValue(query)
          }}
          onEnter={(query) => {
            setValue(query)
          }}
          getHref={() => ""}
          onClick={(e) => e.preventDefault()}
        />
      </Stack>
    )
  },
}

export const No_Results: StoryObj<typeof RegistrationSearch> = {
  render() {
    const [value, setValue] = useState("")
    return (
      <Stack>
        <span>Value: {value}</span>
        <RegistrationSearch
          results={[]}
          onSearch={(query) => {
            setValue(query)
          }}
          onEnter={(query) => {
            setValue(query)
          }}
          getHref={() => ""}
          onClick={(e) => e.preventDefault()}
        />
      </Stack>
    )
  },
}
