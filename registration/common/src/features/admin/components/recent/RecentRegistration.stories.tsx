import { RecentRegistration } from "#src/features/admin/components/recent/RecentRegistration.js"
import { Meta, StoryObj } from "@storybook/react"
import "./RecentRegistration.scss"
import { Grid } from "@mantine/core"
import { MouseEvent } from "react"

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
            onClick={onClick}
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
          <RecentRegistration
            name="Example Registration"
            nickname="Badge Name"
            href="#"
            number={207}
            onClick={onClick}
          />
        </Grid.Col>
      </Grid>
    )
  },
}
