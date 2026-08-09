import type { Message } from "@erwin/schema"

type Request = {
  model: string,
  input: Input[],
  instructions: string,
  reasoning?: {
    effort: ReasoningEffort
  },
  stream?: boolean
  max_output_tokens?: number
} | RequestWithTool

type RequestWithTool = {
  model: string,
  input: Input[],
  instructions: string,
  reasoning?: {
    effort: ReasoningEffort
  },
  stream?: boolean,
  tools: Tool[],
  tool_choice: ToolChoice
  max_output_tokens?: number
}

type ToolChoice = "auto" | "none" | { type: "function", name: string }

type Tool = {
  type: "function",
  name: string,
  description: string,
  strict: boolean | null,
  parameters: {
    type: "object",
    properties: Record<string, unknown>,
    required: [string]
  }
}

type ReasoningEffort = "minimal" | "low" | "medium" | "high"

type UserInput = {
  type: "message",
  role: "user",
  content: [
    {
      type: "input_text",
      text: string
    }
  ]
}

type ToolInput = {
  type: "function_call",
  id: string,
  call_id: string,
  name: string,
  arguments: string
}

type ToolOutputInput = {
  type: 'function_call_output',
  id: string,
  call_id: string,
  output: string,
}

type AssistantInput = {
  type: 'message',
  role: 'assistant',
  id: string,
  status: ResponseStatus,
  content: [
    {
      type: 'output_text',
      text: string,
    }
  ]
}

type ResponseStatus = "completed" | "in_progress" | "failed"

export type Input = UserInput | AssistantInput | ToolInput | ToolOutputInput

export function toProviderInput(messages: Message[]): Input[] {
  const inputFromMessages = messages.filter(message => message.role !== "system").flatMap(message => {

    switch (message.role) {
      case "user":
        return message.content.map(part => {
          switch (part.type) {
            case "text":
              return {
                type: "message",
                role: "user",
                content: [{
                  type: "input_text",
                  text: part.text
                }]
              }
            case "media":
              return {
                type: "message",
                role: "user",
                content: [{
                  type: "input_image",
                  image_url: part.url
                }]
              }
          }
        })
      case "assistant":
        return message.content.map(part => {
          switch (part.type) {
            case "text":
              return {
                type: "message",
                role: "assistant",
                id: "fc_02",
                status: "in_progress",
                content: [
                  {
                    type: "output_text",
                    text: part.text
                  }
                ]
              }
            case "tool-call":
              return {
                type: "function_call",
                id: "fc_03",
                name: part.name,
                call_id: part.toolCallId,
                arguments: JSON.stringify(part.arguments)
              }
          }
          })
      case "tool":
        return message.content.map( part => {
          return {
            type: "function_call_output",
            id: "fc_output_1",
            call_id: part.toolCallId,
            output: JSON.stringify(part.result.value)
            }
        })
      }
  })

  console.log("inputFromMessages", JSON.stringify(inputFromMessages))

return inputFromMessages

}
