import { Meta, StoryObj } from "@storybook/react"
import { RegistrationList } from "./RegistrationList.js"

const meta: Meta<typeof RegistrationList> = {
  component: RegistrationList,
}

export default meta

export const Default: StoryObj<typeof RegistrationList> = {
  args: {
    registrations: [
      ...Array.from(new Array(5).keys(), (i) => ({
        key: `${i}`,
        title: `Registration ${i + 1}`,
        subtitle: `Registration ${i + 1}`,
        description: `Registration ${i + 1}.`,
        n: i,
      })),
      {
        key: "long",
        title: "Long Registration",
        subtitle: "Long Registration",
        description:
          "A registration which is\n\nmuch\n\nlonger\n\n than the others.",
        n: 5,
      },
    ],
  },
}

export const New: StoryObj<typeof RegistrationList> = {
  args: {
    registrations: [
      ...Array.from(new Array(5).keys(), (i) => ({
        key: `${i}`,
        title: `Registration ${i + 1}`,
        subtitle: `Registration ${i + 1}`,
        description: `Registration ${i + 1}.`,
        n: i,
        new: true,
      })),
      {
        key: "long",
        title: "Long Registration",
        subtitle: "Long Registration",
        description:
          "A registration which is\n\nmuch\n\nlonger\n\n than the others.",
        n: 5,
        new: true,
      },
    ],
  },
}

export const Empty: StoryObj<typeof RegistrationList> = {
  args: {
    registrations: [],
  },
}

export const Placeholder: StoryObj<typeof RegistrationList> = {
  render() {
    return <RegistrationList.Placeholder />
  },
}
