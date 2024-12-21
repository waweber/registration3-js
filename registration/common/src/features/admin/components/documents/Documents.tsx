import {
  Anchor,
  Divider,
  Paper,
  Stack,
  Table,
  TableScrollContainer,
  Title,
} from "@mantine/core"

import { usePrintAPI } from "@open-event-systems/registration-lib/print"
import { useRef } from "react"

export type DocumentsProps = {
  documentTypes: Record<string, string>
  documents: Record<string, string>
}

export const Documents = (props: DocumentsProps) => {
  const { documentTypes, documents } = props
  const api = usePrintAPI()
  const openDoc = (type: string, url: string) => {
    api.readDocument(url).then((res) => {
      const dataURL = URL.createObjectURL(res)
      const el = document.createElement("a")
      el.setAttribute("href", dataURL)
      // el.setAttribute("download", `${type}.pdf`)
      el.setAttribute("target", "_blank")
      el.click()
    })
  }
  return (
    <Paper shadow="xs" p="xs" withBorder>
      <Stack gap="xs">
        <Title order={6}>Documents</Title>
        <Divider />
        <Table>
          <Table.Tbody>
            {Object.keys(documents).map((t) => {
              const url = documents[t]
              const type = documentTypes[t] || t
              return (
                <Table.Tr key={t}>
                  <Table.Td>
                    <Anchor
                      component="button"
                      onClick={() => {
                        openDoc(t, url)
                      }}
                    >
                      {type}
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  )
}
