import { Box, BoxProps, Divider, LoadingOverlay, useProps } from "@mantine/core"
import { InterviewRenderProps } from "../types.js"
import clsx from "clsx"
import { HistoryPanel } from "../history/HistoryPanel.js"
import { Content as ContentComponent } from "../content/Content.js"
import {
  InterviewResponseRecord,
  InterviewResponseStore,
} from "@open-event-systems/interview-lib"
import { useContext, useMemo } from "react"
import { InterviewContext } from "./Context.js"
import { useMediaQuery } from "@mantine/hooks"
import { HistorySelector } from "../history/HistorySelector.js"

export type InterviewPanelProps = Omit<BoxProps, "onSubmit" | "children"> &
  InterviewRenderProps & {
    getHistoryLink?: (state: string) => string
  }

export const InterviewPanel = (props: InterviewPanelProps) => {
  const { className, getHistoryLink, Title, Content, Controls, ...other } =
    useProps("InterviewPanel", {}, props)

  const context = useContext(InterviewContext)

  const isSmall = useMediaQuery("(max-width: 48em)", false, {
    getInitialValueInEffect: false,
  })

  const historyRecords = useMemo(
    () =>
      context.recordId
        ? getHistoryRecords(
            context.store,
            context.recordId,
            context.latestRecordId,
          )
        : [],
    [context.recordId, context.latestRecordId],
  )

  const historyItems = useMemo(
    () =>
      getHistoryItems(
        historyRecords,
        getHistoryLink,
        context.onNavigate,
        context.recordId,
      ),
    [historyRecords],
  )

  const historySelectorItems = useMemo(
    () =>
      historyRecords.map((r, i) => ({
        id: r.response.state,
        label: `${i + 1}. ${r.title ?? ""}`,
      })),
    [historyRecords],
  )

  return (
    <Box className={clsx("InterviewPanel-root", className)} {...other}>
      <Box className="InterviewPanel-historyCol">
        {isSmall ? (
          <HistorySelector
            className="InterviewPanel-historySelector"
            items={historySelectorItems}
            selectedId={context.recordId ?? undefined}
            onChange={(selectedId) => {
              context.onNavigate(selectedId)
            }}
          />
        ) : (
          <>
            <HistoryPanel className="InterviewPanel-history">
              {historyItems}
            </HistoryPanel>
            <Divider
              orientation="vertical"
              className="InterviewPanel-divider"
            />
          </>
        )}
      </Box>
      <Box className="InterviewPanel-contentCol">
        <ContentComponent
          className="InterviewPanel-content"
          title={!isSmall ? <Title /> : undefined}
          footer={<Controls />}
          onSubmit={(e) => {
            e.preventDefault()
            context.onSubmit()
          }}
        >
          <Content />
        </ContentComponent>
      </Box>
      <LoadingOverlay visible={context.submitting} />
    </Box>
  )
}

const getHistoryItems = (
  records: InterviewResponseRecord[],
  getLink?: (state: string) => string,
  onClick?: (state: string) => void,
  current: string | null = null,
) => {
  return records.map((rec, i) => (
    <HistoryPanel.Item
      key={rec.response.state}
      label={`${i + 1}. ${rec.title || ""}`}
      active={!!current && rec.response.state == current}
      href={getLink ? getLink(rec.response.state) : undefined}
      onClick={() => {
        onClick && onClick(rec.response.state)
      }}
    />
  ))
}

const getHistoryRecords = (
  store: InterviewResponseStore,
  current: string,
  latest: string | null = null,
) => {
  const records = []
  let cur: string | undefined = latest ?? current
  while (cur) {
    const record = store.get(cur)
    if (record) {
      records.push(record)
    }
    cur = record?.prev
  }
  records.reverse()
  return records
}
