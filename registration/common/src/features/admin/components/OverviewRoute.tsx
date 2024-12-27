import { adminEventIndexRoute } from "#src/app/routes/admin/admin.js"
import { Title } from "#src/components/index.js"
import { Paper, Title as MTitle, Table, Grid } from "@mantine/core"
import { useEventOverview } from "@open-event-systems/registration-lib/admin"
import { sub as dateSub } from "date-fns"

export const OverviewRoute = () => {
  const { eventId } = adminEventIndexRoute.useParams()
  const now = getNow()
  const todayDate = getToday()
  const lastFiveMins = useEventOverview(
    eventId,
    true,
    dateSub(now, { minutes: 5 }),
  )
  const lastHalfHour = useEventOverview(
    eventId,
    true,
    dateSub(now, { minutes: 30 }),
  )
  const lastTwoHours = useEventOverview(
    eventId,
    true,
    dateSub(now, { hours: 2 }),
  )
  const today = useEventOverview(eventId, true, todayDate)
  const checkedIn = useEventOverview(eventId, true)
  const total = useEventOverview(eventId)

  return (
    <Grid justify="center">
      <Grid.Col span={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
        <Paper p="xs" withBorder shadow="xs">
          <Title title="Event Overview">
            <MTitle order={6}>Overview</MTitle>
            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th scope="row">Total Attendees</Table.Th>
                  <Table.Td>{total.count}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th scope="row">Checked In (Last 5 minutes)</Table.Th>
                  <Table.Td>{lastFiveMins.count}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th scope="row">Checked In (Last 30 minutes)</Table.Th>
                  <Table.Td>{lastHalfHour.count}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th scope="row">Checked In (Last 2 hours)</Table.Th>
                  <Table.Td>{lastTwoHours.count}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th scope="row">Checked In (today)</Table.Th>
                  <Table.Td>{today.count}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th scope="row">Total Checked In</Table.Th>
                  <Table.Td>{checkedIn.count}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Title>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

const getNow = (): Date => {
  const now = new Date()
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    0,
    0,
  )
}

const getToday = (): Date => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
}
