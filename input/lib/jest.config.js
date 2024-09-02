import { createJsWithTsEsmPreset } from "ts-jest"

const defaultEsmPreset = createJsWithTsEsmPreset()

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  ...defaultEsmPreset,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
}
