import { RecentRegistration } from "#src/features/admin/components/recent/RecentRegistration.js"
import { Meta, StoryObj } from "@storybook/react"
import { Grid } from "@mantine/core"
import { MouseEvent } from "react"
import "./RecentRegistration.scss"

const meta: Meta<typeof RecentRegistration> = {
  component: RecentRegistration,
}

export default meta

export const Default: StoryObj<typeof RecentRegistration> = {
  args: {
    checkInId: "B01",
    name: "Example Person",
    number: 1234,
    nickname: "Badge Name",
    description: "Pick up badge",
  },
  render(args) {
    return (
      <RecentRegistration
        {...args}
        href="#"
        onClick={(e) => {
          e.preventDefault()
        }}
      />
    )
  },
}

export const Multi: StoryObj<typeof RecentRegistration> = {
  render() {
    const onClick = (e: MouseEvent) => {
      e.preventDefault()
    }
    return (
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <RecentRegistration
            checkInId="B01"
            name="Example Registration"
            nickname="Badge Name"
            number={1234}
            description="Pick up badge"
            href="#"
            onClick={onClick}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <RecentRegistration
            checkInId="F42"
            name="Example Registration"
            nickname="Badge Name"
            number={86}
            description="Pick up badge"
            href="#"
            onClick={onClick}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <RecentRegistration
            checkInId="C13"
            name="Example Registration"
            nickname="Badge Name"
            number={2437}
            description="Sign forms"
            href="#"
            onClick={onClick}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <RecentRegistration
            checkInId="A22"
            name="Example Registration"
            nickname="Badge Name"
            href="#"
            number={488}
            description="Pick up badge"
            onClick={onClick}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <RecentRegistration
            name="Example Registration"
            nickname="Badge Name"
            href="#"
            number={207}
            description="Pick up badge"
            onClick={onClick}
          />
        </Grid.Col>
      </Grid>
    )
  },
}
