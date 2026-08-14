import { expect, test } from "bun:test";
import { test01, test02, test03, test04, test05 } from "./constants";
import { toProviderInput } from "../src/protocols/openai-responses";

test("serializes user and assistant messages", () => {
  const result = toProviderInput(test01.messages)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(test01.providerInput)
})

test("serializes tool input messages", () => {
  const result = toProviderInput(test02.messagesWTC)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(test02.providerInputWTC)
})

test("serializes tool input and tool output messages", () => {
  const result = toProviderInput(test03.messagesWTO)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(test03.providerInputWTO)
})


test("serializes tool input and tool output messages in one assitant message", () => {
  const result = toProviderInput(test04.messagesWTO)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(test04.providerInputWTO)
})

test("serializes reasoning messages in provider input", () => {
  const result = toProviderInput(test05.messagesWR)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.value).toEqual(test05.providerInputWR)
})
