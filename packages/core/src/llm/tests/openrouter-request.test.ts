import { expect, test } from "bun:test";
import { toProviderInput } from "../protocols/openrouter-request";
import { test01, test02, test03, test04 } from "./constants";

test("serializes user and assistant messages", () => {
  expect(toProviderInput(test01.messages)).toEqual(test01.providerInput)
})

test("serializes tool input messages", () => {
  const result = toProviderInput(test02.messagesWTC)
  expect(result).toEqual(test02.providerInputWTC)
})

test("serializes tool input and tool output messages", () => {
  const result = toProviderInput(test03.messagesWTO)
  expect(result).toEqual(test03.providerInputWTO)
})

test("serializes tool input and tool output messages in one assitant message", () => {
  const result = toProviderInput(test04.messagesWTO)
  expect(result).toEqual(test04.providerInputWTO)
})
