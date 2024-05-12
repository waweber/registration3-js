import { InterviewResponseRecordStore } from "./store.js"

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
  const store = new InterviewResponseRecordStore(10, items)

  const out = Array.from(store)
  expect(out).toStrictEqual(items)
})

test("store add works", () => {
  const store = new InterviewResponseRecordStore(10)
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
  const store = new InterviewResponseRecordStore(10, [
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

test("store saves user response", () => {
  const store = new InterviewResponseRecordStore(10, [
    {
      response: {
        state: "1",
        completed: false,
        update_url: "",
      },
    },
  ])

  const res = store.saveUserResponse("1", { test: true })
  expect(res).toStrictEqual({
    response: {
      state: "1",
      completed: false,
      update_url: "",
    },
    userResponse: { test: true },
  })

  expect(store.get("1")).toStrictEqual(res)
})

test("store trims size", () => {
  const store = new InterviewResponseRecordStore(10)
  for (let i = 0; i < 20; i++) {
    store.add({ state: `${i}`, completed: false, update_url: "" })
    const arr = Array.from(store)
    expect(arr.length).toBeLessThanOrEqual(10)
  }
})
