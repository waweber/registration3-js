import { AccessCodeOptions } from "#src/features/selfservice/components/access-code/AccessCodeOptions.js"
import { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof AccessCodeOptions> = {
  component: AccessCodeOptions,
}

export default meta

export const Add_Only: StoryObj<typeof AccessCodeOptions> = {
  args: {
    options: [
      {
        id: "add-full",
        title: "Full Weekend",
      },
      {
        id: "add-day",
        title: "Day Pass",
      },
    ],
  },
}

export const Change_Only: StoryObj<typeof AccessCodeOptions> = {
  args: {
    changeOptions: [
      {
        registrationId: "1",
        title: "Copley Deer",
        options: [
          {
            id: "upgrade",
            title: "Upgrade Registration",
          },
        ],
      },
      {
        registrationId: "2",
        title: "Quincy Cougar",
        options: [
          {
            id: "upgrade",
            title: "Upgrade Registration",
          },
        ],
      },
    ],
  },
}

export const Both: StoryObj<typeof AccessCodeOptions> = {
  args: {
    options: [
      {
        id: "add-full",
        title: "Full Weekend",
      },
      {
        id: "add-day",
        title: "Day Pass",
      },
    ],
    changeOptions: [
      {
        registrationId: "1",
        title: "Copley Deer",
        options: [
          {
            id: "upgrade",
            title: "Upgrade Registration",
          },
        ],
      },
      {
        registrationId: "2",
        title: "Quincy Cougar",
        options: [
          {
            id: "upgrade",
            title: "Upgrade Registration",
          },
        ],
      },
    ],
  },
}

export const NotFound: StoryObj<typeof AccessCodeOptions.NotFound> = {
  render() {
    return <AccessCodeOptions.NotFound />
  },
}
