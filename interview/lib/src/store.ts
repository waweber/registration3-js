import { InterviewResponse, InterviewResponseRecord } from "./types.js"

/**
 * Stores {@link InterviewResponseRecord} objects.
 */
export class InterviewResponseRecordStore {
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

  /**
   * Get a record by id.
   */
  get(state: string): InterviewResponseRecord | null {
    return this.records.get(state) ?? null
  }

  /**
   * Add a record.
   * @param response - the response
   * @param prev - the previous record id
   * @returns the added record
   */
  add(response: InterviewResponse, prev?: string): InterviewResponseRecord {
    const record = { response, prev, title: getTitle(response) }
    this.records.set(response.state, record)
    this.trim()
    return record
  }

  /**
   * Save the user responses for a record.
   * @param state - the state value
   * @param userResponse - the response value
   * @returns the updated record, or null if it does not exist
   */
  saveUserResponse(
    state: string,
    userResponse: Record<string, unknown>,
  ): InterviewResponseRecord | null {
    const cur = this.records.get(state)
    if (!cur) {
      return null
    }

    const updated = { ...cur, userResponse: userResponse }
    this.records.set(state, updated)
    return updated
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
