import { InterviewResponse } from "./types.js"

export class InterviewStateRecordImpl {
  constructor(
    private getPrevHook: (prevState: string) => InterviewStateRecordImpl | null,
    private saveHook: (record: InterviewStateRecordImpl) => void,
    public state: InterviewResponse,
    public title?: string,
    public prev?: string,
    public responses?: Record<string, unknown>,
  ) {}

  getPrev(): InterviewStateRecordImpl | null {
    return this.getPrevHook(this.state.state)
  }

  setResponses(responses: Record<string, unknown>) {
    this.responses = { ...responses }
    this.saveHook(this)
  }

  toJSON(): Record<string, unknown> {
    return {
      state: this.state,
      title: this.title ?? undefined,
      prev: this.prev ?? undefined,
      responses: this.responses ?? undefined,
    }
  }
}
