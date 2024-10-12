import { RegistrationSearchFilters } from "#src/features/registration/components/search/RegistrationSearchFilters.js"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof RegistrationSearchFilters> = {
  component: RegistrationSearchFilters,
  parameters: {
    layout: "padded",
  },
}

export default meta

export const Default: StoryObj<typeof RegistrationSearchFilters> = {}
