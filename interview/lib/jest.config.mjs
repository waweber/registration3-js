import { createJsWithTsEsmPreset } from "ts-jest"
const defaultEsmPreset = createJsWithTsEsmPreset()

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  testEnvironment: "node",
  ...defaultEsmPreset,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: ["dist"],
}

export default config
