import { useAlert } from "#src/components/index.js"
import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  PaperProps,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core"
import { Markdown } from "@open-event-systems/interview-components"
import {
  getRegistrationName,
  Registration,
  RegistrationStatus,
} from "@open-event-systems/registration-lib/registration"
import { parseISO } from "date-fns"

export type RegistrationComponentProps = {
  registration: Registration
  summary?: string | null
  displayData?: (readonly [string, string])[]
  actions?: { id: string; label: string }[]
  onComplete?: () => void
  onCancel?: () => void
  onSelectAction?: (id: string) => void
} & PaperProps

export const RegistrationComponent = (props: RegistrationComponentProps) => {
  const {
    registration,
    summary,
    displayData = [],
    actions,
    onComplete,
    onCancel,
    onSelectAction,
    ...other
  } = props

  const alert = useAlert()

  const canComplete = registration.status == RegistrationStatus.pending
  const canCancel = registration.status != RegistrationStatus.canceled

  const hasActions = canComplete || canCancel || (actions && actions.length > 0)

  const filteredData = displayData.filter((e): e is readonly [string, string] =>
    Boolean(e[0] && e[1]),
  )

  return (
    <Paper
      withBorder
      shadow="xs"
      p="xs"
      className="AdminRegistration-root"
      {...other}
    >
      {registration.number != null && (
        <Box className="AdminRegistration-number">#{registration.number}</Box>
      )}
      <Title order={3} className="AdminRegistration-name">
        {getRegistrationName(registration)}
      </Title>
      {registration.status != RegistrationStatus.created && (
        <Box className="AdminRegistration-status">
          {statusText[registration.status] ?? registration.status}
        </Box>
      )}
      <Divider className="AdminRegistration-divider" />
      <Box className="AdminRegistration-details">
        <Table.ScrollContainer minWidth={500}>
          <Table>
            <Table.Tbody>
              <Table.Tr>
                <Table.Th scope="row" w="35%">
                  Preferred Name
                </Table.Th>
                <Table.Td>{registration.preferred_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th scope="row">First Name</Table.Th>
                <Table.Td>{registration.first_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th scope="row">Last Name</Table.Th>
                <Table.Td>{registration.last_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th scope="row">Nickname</Table.Th>
                <Table.Td>{registration.nickname}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th scope="row">Email</Table.Th>
                <Table.Td>{registration.email}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th scope="row">Created</Table.Th>
                <Table.Td>
                  {parseISO(registration.date_created).toLocaleString()}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th scope="row">Updated</Table.Th>
                <Table.Td>
                  {registration.date_updated
                    ? parseISO(registration.date_updated).toLocaleString()
                    : ""}
                </Table.Td>
              </Table.Tr>
              {filteredData.map(([k, v], i) => (
                <Table.Tr key={`extra${i}`}>
                  <Table.Th scope="row">{k}</Table.Th>
                  <Table.Td>{v}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {registration.notes && (
          <>
            <Title order={6}>Notes</Title>
            <Markdown>{registration.notes}</Markdown>
          </>
        )}
      </Box>
      {hasActions && (
        <>
          <Divider className="AdminRegistration-divider2" />
          <Group className="AdminRegistration-actions">
            {canComplete && (
              <Button
                variant="outline"
                onClick={() => onComplete && onComplete()}
              >
                Complete
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outline"
                color="red"
                onClick={() => {
                  alert({
                    title: "Cancel Registration",
                    message: "Cancel this registration?",
                    confirmText: "Yes",
                    cancelText: "No",
                  }).then((res) => {
                    if (res && onCancel) {
                      onCancel()
                    }
                  })
                }}
              >
                Cancel
              </Button>
            )}
            {actions && actions.length > 0 && (
              <Select
                placeholder="Action..."
                value=""
                onChange={(id) => {
                  if (id && onSelectAction) {
                    onSelectAction(id)
                  }
                }}
                data={actions.map((a) => ({ label: a.label, value: a.id }))}
              />
            )}
          </Group>
        </>
      )}
    </Paper>
  )
}

const statusText: Record<string, string | undefined> = {
  [RegistrationStatus.pending]: "Pending",
  [RegistrationStatus.canceled]: "Canceled",
}
