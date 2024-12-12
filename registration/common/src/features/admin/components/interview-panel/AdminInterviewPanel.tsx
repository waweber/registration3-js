import { getDefaultUpdateURL } from "#src/utils.js"
import { Box, Stack, Title } from "@mantine/core"
import {
  Interview,
  InterviewContentComponentProps,
} from "@open-event-systems/interview-components"
import {
  CompleteInterviewResponse,
  InterviewResponseRecord,
} from "@open-event-systems/interview-lib"
import {
  getInterviewStateQueryOptions,
  useInterviewAPI,
  useInterviewStore,
} from "@open-event-systems/registration-lib/interview"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"

export type AdminInterviewPanelProps = {
  recordId?: string | null
  onClose?: () => void
  onNavigate: (recordId: string) => void
  onComplete?: (response: CompleteInterviewResponse) => Promise<void> | void
}

export const AdminInterviewPanel = (props: AdminInterviewPanelProps) => {
  const { recordId, onNavigate, onClose, onComplete } = props

  const [latestRecordId, setLatestRecordId] = useState<string | null>(null)

  const interviewAPI = useInterviewAPI()
  const interviewStore = useInterviewStore()
  const queryClient = useQueryClient()

  const onUpdate = useCallback(
    async (record: InterviewResponseRecord) => {
      if (record.response.completed) {
        onComplete && (await onComplete(record.response))
      } else {
        const opts = getInterviewStateQueryOptions(
          interviewAPI,
          interviewStore,
          getDefaultUpdateURL(),
          record.response.state,
        )
        queryClient.setQueryData(opts.queryKey, record)
        setLatestRecordId(record.response.state)
        onNavigate(record.response.state)
      }
    },
    [interviewAPI, interviewStore, queryClient, onNavigate, onComplete],
  )

  return (
    <Box>
      <Interview
        api={interviewAPI}
        store={interviewStore}
        latestRecordId={latestRecordId ?? undefined}
        recordId={recordId || undefined}
        onNavigate={onNavigate}
        onUpdate={onUpdate}
        onClose={onClose}
        contentComponent={AdminInterviewPanelContent}
      />
    </Box>
  )
}

const AdminInterviewPanelContent = ({
  title,
  controls,
  children,
}: InterviewContentComponentProps) => {
  return (
    <Stack>
      <Title order={3}>{title}</Title>
      {children}
      {controls}
    </Stack>
  )
}
