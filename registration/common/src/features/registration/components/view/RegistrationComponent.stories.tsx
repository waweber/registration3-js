import { RegistrationComponent } from "#src/features/registration/components/view/RegistrationComponent.js"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof RegistrationComponent> = {
  component: RegistrationComponent,
}

export default meta

export const Default: StoryObj<typeof RegistrationComponent> = {
  args: {
    registration: {
      id: "1",
      status: "created",
      event_id: "example-event",
      version: 1,
      date_created: "2020-01-01T00:00:00-05:00",
      first_name: "Copley",
      last_name: "Deer",
      email: "test@example.net",
      number: 1,
    },
    w: 600,
  },
}
