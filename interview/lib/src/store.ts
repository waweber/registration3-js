import { InterviewResponse, InterviewResponseRecord } from "./types.js"

export class InterviewStateRecordStore {
  private records = new Map<string, InterviewResponseRecord>()

  constructor(
    private maxSize: number,
    records?: Iterable<InterviewResponseRecord>,
  ) {
    for (const record of records || []) {
      this.records.set(record.response.state, record)
    }
  }

  *[Symbol.iterator](): Iterator<InterviewResponseRecord> {
    for (const [_state, record] of this.records) {
      yield record
    }
  }

  get(state: string): InterviewResponseRecord | null {
    return this.records.get(state) ?? null
  }

  add(response: InterviewResponse, prev?: string): InterviewResponseRecord {
    const record = { response, prev, title: getTitle(response) }
    this.records.set(response.state, record)
    this.trim()
    return record
  }

  private trim() {
    while (this.records.size > this.maxSize) {
      const res = this.records.keys().next()
      if (!res.done) {
        this.records.delete(res.value)
      }
    }
  }
}

const getTitle = (response: InterviewResponse) => {
  if (response.completed) {
    return
  } else if (response.content?.type == "question") {
    return response.content.schema.title
  } else if (response.content?.type == "exit") {
    return response.content.title
  }
}
