import { Registration } from "#src/features/registration/types.js"
import { formatName, formatStatus } from "#src/features/registration/utils.js"
import {
  Paper,
  PaperProps,
  Table,
  TableScrollContainer,
  Text,
  Title,
} from "@mantine/core"
import { ReactNode } from "react"

export type RegistrationComponentProps = {
  registration: Readonly<Registration>
} & PaperProps

export const RegistrationComponent = (props: RegistrationComponentProps) => {
  const { registration, ...other } = props

  return (
    <Paper p="xs" {...other}>
      <Title order={2} component="h4">
        {formatName(registration)}
      </Title>
      <Text span>{formatStatus(registration.status)}</Text>
      <Info registration={registration} />
    </Paper>
  )
}

const Info = ({ registration }: { registration: Registration }) => {
  return (
    <TableScrollContainer minWidth={500}>
      <Table>
        <Table.Tbody>
          <DataRow label="Number" value={registration.number} />
          <DataRow label="First Name" value={registration.first_name} />
          <DataRow label="Last Name" value={registration.last_name} />
          <DataRow label="Preferred Name" value={registration.preferred_name} />
          <DataRow label="Nickname" value={registration.nickname} />
          <DataRow label="Email" value={registration.email} />
        </Table.Tbody>
      </Table>
    </TableScrollContainer>
  )
}

const DataRow = ({
  label,
  value,
}: {
  label?: ReactNode
  value?: ReactNode
}) => {
  return (
    <Table.Tr>
      <Table.Th scope="row" className="RegistrationComponent-keyCol">
        {label}
      </Table.Th>
      <Table.Td>{value}</Table.Td>
    </Table.Tr>
  )
}
