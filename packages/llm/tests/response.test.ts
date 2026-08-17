import { expect, test } from "bun:test";
import { OpenAIResponses } from "../src/protocols/openai-responses";
import { resp01, resp02, resp03, resp04, resp05, resp06, resp07 } from "./constants";

test("parses a text-only response", () => {
  const result = OpenAIResponses.fromProvider(resp01.response)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(resp01.expected)
})

test("folds reasoning and text into a single assistant message", () => {
  const result = OpenAIResponses.fromProvider(resp02.response)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(resp02.expected)
})

test("parses text, tool call and tool output with correct ordering", () => {
  const result = OpenAIResponses.fromProvider(resp03.response)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(resp03.expected)
})

test("maps a failed tool output to an error result", () => {
  const result = OpenAIResponses.fromProvider(resp04.response)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(resp04.expected)
})

test("rejects malformed tool call arguments", () => {
  const result = OpenAIResponses.fromProvider(resp05.response)
  if (result.ok) throw new Error("expected an error")
  expect(result.error._tag).toBe(resp05.expectedError._tag)
})

test("maps a provider error to an AppError", () => {
  const result = OpenAIResponses.fromProvider(resp06.response)
  if (result.ok) throw new Error("expected an error")
  expect(result.error).toEqual(resp06.expectedError)
})

test("handles an empty output", () => {
  const result = OpenAIResponses.fromProvider(resp07.response)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(resp07.expected)
})
