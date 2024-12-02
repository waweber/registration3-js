import { useAlert } from "#src/components/index.js"
import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  PaperProps,
  Table,
  Title,
} from "@mantine/core"
import {
  getRegistrationName,
  Registration,
  RegistrationStatus,
} from "@open-event-systems/registration-lib/registration"

export type RegistrationComponentProps = {
  registration: Registration
  onComplete?: () => void
  onCancel?: () => void
} & PaperProps

export const RegistrationComponent = (props: RegistrationComponentProps) => {
  const { registration, onComplete, onCancel, ...other } = props

  const alert = useAlert()

  const canComplete = registration.status == RegistrationStatus.pending
  const canCancel = registration.status != RegistrationStatus.canceled

  const hasActions = canComplete || canCancel

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
          </Table.Tbody>
        </Table>
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
