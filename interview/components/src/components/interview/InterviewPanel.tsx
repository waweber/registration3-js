import {
  Divider,
  Grid,
  GridProps,
  LoadingOverlay,
  useProps,
} from "@mantine/core"
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

export type InterviewPanelProps = Omit<GridProps, "onSubmit" | "children"> &
  InterviewRenderProps & {
    getHistoryLink?: (state: string) => string
  }

export const InterviewPanel = (props: InterviewPanelProps) => {
  const { className, getHistoryLink, Title, Content, Controls, ...other } =
    useProps("InterviewPanel", {}, props)

  const context = useContext(InterviewContext)

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

  return (
    <Grid
      className={clsx("InterviewPanel-root", className)}
      classNames={{
        inner: "InterviewPanel-inner",
      }}
      align="stretch"
      {...other}
    >
      <Grid.Col span={4} classNames={{ col: "InterviewPanel-historyCol" }}>
        <HistoryPanel className="InterviewPanel-history">
          {historyItems}
        </HistoryPanel>
        <Divider orientation="vertical" className="InterviewPanel-divider" />
      </Grid.Col>
      <Grid.Col span={8} classNames={{ col: "InterviewPanel-contentCol" }}>
        <ContentComponent
          className="InterviewPanel-content"
          title={<Title />}
          footer={<Controls />}
          onSubmit={(e) => {
            e.preventDefault()
            context.onSubmit()
          }}
        >
          <Content />
        </ContentComponent>
      </Grid.Col>
      <LoadingOverlay visible={context.submitting} />
    </Grid>
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
