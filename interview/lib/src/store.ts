import {
  InterviewResponse,
  InterviewResponseRecord,
  InterviewResponseStore,
  UserResponse,
} from "./types.js"

const DEFAULT_MAX_SIZE = 100

/**
 * Make a {@link InterviewResponseStore}.
 */
export const makeInterviewResponseStore = (
  records?: Iterable<InterviewResponseRecord>,
  maxSize = DEFAULT_MAX_SIZE,
): InterviewResponseStore => {
  return new StoreImpl(maxSize, records)
}

class StoreImpl {
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
    for (const [_, record] of this.records) {
      yield record
    }
  }

  get(state: string): InterviewResponseRecord | null {
    return this.records.get(state) ?? null
  }

  add(response: InterviewResponse, prev?: string): InterviewResponseRecord {
    const cur = this.records.get(response.state)
    const record = {
      ...cur,
      response,
      title: getTitle(response),
    }

    if (prev && prev != response.state) {
      record.prev = prev
    }

    this.records.set(response.state, record)
    this.trim()
    return record
  }

  saveUserResponse(
    state: string,
    userResponse: UserResponse,
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
