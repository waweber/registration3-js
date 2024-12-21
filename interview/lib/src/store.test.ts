import { makeInterviewResponseStore } from "./store.js"

test("store create/iterate works", () => {
  const items = [
    {
      response: {
        state: "1",
        completed: false,
        target: "",
      },
    },
    {
      response: {
        state: "2",
        completed: false,
        target: "",
      },
    },
    {
      response: {
        state: "3",
        completed: false,
        target: "",
      },
    },
  ]
  const store = makeInterviewResponseStore(items, 10)

  const out = Array.from(store)
  expect(out).toStrictEqual(items)
})

test("store add works", () => {
  const store = makeInterviewResponseStore([], 10)
  const resp = store.add(
    {
      state: "1",
      completed: false,
      target: "",
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
  const store = makeInterviewResponseStore(
    [
      {
        response: {
          state: "1",
          completed: false,
          target: "",
        },
      },
    ],
    10,
  )

  const out = store.get("1")
  expect(out).toStrictEqual({
    response: {
      state: "1",
      completed: false,
      target: "",
    },
  })
})

test("store saves user response", () => {
  const store = makeInterviewResponseStore(
    [
      {
        response: {
          state: "1",
          completed: false,
          target: "",
        },
      },
    ],
    10,
  )

  const res = store.saveUserResponse("1", { test: true })
  expect(res).toStrictEqual({
    response: {
      state: "1",
      completed: false,
      target: "",
    },
    userResponse: { test: true },
  })

  expect(store.get("1")).toStrictEqual(res)
})

test("store trims size", () => {
  const store = makeInterviewResponseStore([], 10)
  for (let i = 0; i < 20; i++) {
    store.add({ state: `${i}`, completed: false, target: "" })
    const arr = Array.from(store)
    expect(arr.length).toBeLessThanOrEqual(10)
  }
})
