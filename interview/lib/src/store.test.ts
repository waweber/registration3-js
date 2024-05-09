import { InterviewStateRecordStore } from "./store.js"

test("store create/iterate works", () => {
  const items = [
    {
      response: {
        state: "1",
        completed: false,
        update_url: "",
      },
    },
    {
      response: {
        state: "2",
        completed: false,
        update_url: "",
      },
    },
    {
      response: {
        state: "3",
        completed: false,
        update_url: "",
      },
    },
  ]
  const store = new InterviewStateRecordStore(10, items)

  const out = Array.from(store)
  expect(out).toStrictEqual(items)
})

test("store add works", () => {
  const store = new InterviewStateRecordStore(10)
  const resp = store.add(
    {
      state: "1",
      completed: false,
      update_url: "",
      content: {
        type: "question",
        schema: {
          title: "Test",
          type: "object",
        },
      },
    },
    "0",
  )

  expect(resp).toStrictEqual({
    response: {
      state: "1",
      completed: false,
      update_url: "",
      content: {
        type: "question",
        schema: {
          title: "Test",
          type: "object",
        },
      },
    },
    title: "Test",
    prev: "0",
  })

  const out = Array.from(store)
  expect(out).toStrictEqual([
    {
      response: {
        state: "1",
        completed: false,
        update_url: "",
        content: {
          type: "question",
          schema: {
            title: "Test",
            type: "object",
          },
        },
      },
      title: "Test",
      prev: "0",
    },
  ])
})

test("store get works", () => {
  const store = new InterviewStateRecordStore(10, [
    {
      response: {
        state: "1",
        completed: false,
        update_url: "",
      },
    },
  ])

  const out = store.get("1")
  expect(out).toStrictEqual({
    response: {
      state: "1",
      completed: false,
      update_url: "",
    },
  })
})

test("store trims size", () => {
  const store = new InterviewStateRecordStore(10)
  for (let i = 0; i < 20; i++) {
    store.add({ state: `${i}`, completed: false, update_url: "" })
    const arr = Array.from(store)
    expect(arr.length).toBeLessThanOrEqual(10)
  }
})
