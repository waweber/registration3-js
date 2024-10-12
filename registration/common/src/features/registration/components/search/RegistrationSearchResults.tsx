import { Registration } from "#src/features/registration/types.js"
import {
  Anchor,
  Box,
  Table,
  TableProps,
  TableTdProps,
  Text,
} from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { createContext, useContext } from "react"

export type RegistrationSearchResultsProps = Omit<TableProps, "results"> & {
  results?: Registration[]
  getTo?: (registration: Registration) => string | null | undefined
  showMore?: boolean
  onMore?: () => void
}

export const RegistrationSearchResults = (
  props: RegistrationSearchResultsProps,
) => {
  const { results, getTo, showMore, onMore, ...other } = props
  return (
    <Table.ScrollContainer minWidth={500}>
      <Table {...other}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">#</Table.Th>
            <Table.Th scope="col">Name</Table.Th>
            <Table.Th scope="col">Email</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {results?.map((r) => (
            <Table.Tr key={r.id}>
              <RegContext.Provider
                value={{ to: getTo ? getTo(r) || undefined : undefined }}
              >
                <LinkCol tab>{r.number ?? <>&ndash;</>}</LinkCol>
                <LinkCol>{formatName(r)}</LinkCol>
                <LinkCol>{r.email}</LinkCol>
              </RegContext.Provider>
            </Table.Tr>
          ))}
        </Table.Tbody>
        {showMore && (
          <Table.Tfoot>
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Anchor
                  className="RegistrationSearchResults-more"
                  component="button"
                  onClick={onMore}
                >
                  More
                </Anchor>
              </Table.Td>
            </Table.Tr>
          </Table.Tfoot>
        )}
      </Table>
    </Table.ScrollContainer>
  )
}

const NoResults = () => (
  <Text c="dimmed" className="RegistrationSearchResults-noResults">
    No results
  </Text>
)

RegistrationSearchResults.NoResults = NoResults

const RegContext = createContext<{ to?: string }>({})

const LinkCol = (props: TableTdProps & { tab?: boolean }) => {
  const { children, tab, ...other } = props
  const ctx = useContext(RegContext)
  return (
    <Table.Td className="RegistrationSearchResults-td" {...other}>
      <Anchor
        className="RegistrationSearchResults-anchor"
        component={Link}
        to={ctx.to}
        tabIndex={tab ? undefined : -1}
      >
        {children}
      </Anchor>
    </Table.Td>
  )
}

const formatName = (r: Registration): string => {
  let pname = ""
  if (r.preferred_name && r.preferred_name.length > 0) {
    pname = `(${r.preferred_name})`
  }

  const parts = [r.first_name, pname, r.last_name].filter(
    (v): v is string => !!v && v.length > 0,
  )
  return parts.join(" ")
}
