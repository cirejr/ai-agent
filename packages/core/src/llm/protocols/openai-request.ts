import { type Message, type SystemMessage } from "@erwin/schema"
import getMediaCategory from "../utils/media-category"

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
    required: string[]
  }
}

type ReasoningEffort = "minimal" | "low" | "medium" | "high"

type SystemInput = {
  type: "message",
  role: "system",
  content:
  {
    type: "input_text",
    text: string,
    prompt_cache_breakpoint?: {
      mode: "explicit"
    }
  }[],
  phase?: "commentary" | "final_answer"
}

type UserText = {
  type: "input_text",
  text: string,
  prompt_cache_breakpoint?: {
    mode: "explicit"
  },
}

type UserAudio = {
  type: "input_audio",
  input_audio: {
    data: string,
    format: "mp3" | "wav"
  }
}

type UserFile = {
  type: "input_file",
  file_data?: string,
  file_id?: string,
  file_url?: string,
  filename?: string
}

type UserImage = {
  type: "input_image",
  detail: "auto" | "low" | "high" | "original"
  image_url?: string
}

type UserVideo = {
  type: "input_video",
  video_url: string,
}

type UserInputContent = UserText | UserAudio | UserFile | UserImage | UserVideo

type UserInput = {
  type: "message",
  role: "user",
  content: UserInputContent[]
}

type ToolInput = {
  type: "function_call",
  id?: string,
  call_id: string,
  name: string,
  arguments: string
}

type ToolOutputInput = {
  type: 'function_call_output',
  id?: string,
  call_id: string,
  output: string,
}

type ReasoningOutputInput = {
  type: "reasoning",
  id?: string,
  status: "completed",
  summary: [
    {
      type: "summary_text",
      text: string,
    }
  ],
  content?: [{
    type: "reasoning_text",
    text: string
  }],
  encrypted_content?: string,
  format?: unknown | "openai-responses-v1" | "azure-openai-responses-v1" | "google-gemini-v1" | "anthropic-claude-v1" | "bedrock-openai-responses-v1" | "xai-responses-v1" | "meta-responses-v1",
  signatures?: string
}

type AssistantInput = {
  type: 'message',
  role: 'assistant',
  id?: string,
  status?: ResponseStatus,
  content: [
    {
      type: 'output_text',
      text: string,
    }
  ]
}

type ResponseStatus = "completed" | "in_progress" | "failed"

export type Input = UserInput | AssistantInput | ToolInput | ToolOutputInput | ReasoningOutputInput | SystemInput

export function toProviderInput(messages: Message[]): Input[] {
  const inputFromMessages = messages.flatMap<Input>( message => {
    switch (message.role) {
      case "system":
        const systemInput = toSystemInput(message)
        return systemInput
      case "user":{
        const userMessage: UserInput = {
          type: "message",
          role: "user",
          content: message.content.map<UserInputContent>( part => {
            switch (part.type) {
              case "text": {
                const text: UserText = {
                  type: "input_text",
                  text: part.text
                }
                return text
              }
              case "media": {
                const category = getMediaCategory(part.mimeType)
                switch (category) {
                  case "image":
                    const image: UserImage =  {
                      type: "input_image",
                      detail: "original",
                      image_url: part.url
                    }
                    return image
                  case "file": {
                    const file: UserFile =  {
                      type: "input_file",
                      file_id: part.id,
                      filename: part.name,
                      file_url: part.url,
                      file_data: part.data,
                    }

                    return file
                  }
                  case "audio": {
                    const audio: UserAudio = {
                      type: "input_audio",
                      input_audio: {
                        data: part.data,
                        format: part.audioFormat
                      }
                    }
                    return audio
                  }
                  case "video": {
                    const video: UserVideo = {
                      type: "input_video",
                      video_url: part.url
                    }
                    return video
                  }
                }
              }
            }
          })
        }
        return userMessage
      }
      case "assistant": {
        const assistantMessage = message.content.map<AssistantInput|ToolInput|ReasoningOutputInput>(part => {
          switch (part.type) {
            case "text":
              const textPart: AssistantInput = {
                type: "message",
                role: "assistant",
                id: message.id,
                status: message.status,
                content: [
                  {
                    type: "output_text",
                    text: part.text
                  }
                ]
              }
              return textPart
            case "tool-call":
              const toolCall: ToolInput = {
                type: "function_call",
                id: part.id,
                name: part.name,
                call_id: part.toolCallId,
                arguments: JSON.stringify(part.arguments)
              }

              return toolCall
            case "reasoning":
              const reasoningPart: ReasoningOutputInput = {
                type: "reasoning",
                id: part.id,
                status: "completed",
                summary: [
                  {
                    type: "summary_text",
                    text: part.text,
                  },
                ],
                content: [
                  {
                    type: "reasoning_text",
                    text: part.text
                  }
                ],
              }
              return reasoningPart
          }
        })

        return assistantMessage
      }
      case "tool": {
        const toolResult: ToolOutputInput[] =  message.content.map<ToolOutputInput>( part => {
          return {
            type: "function_call_output",
            id: part.id,
            call_id: part.toolCallId,
            output: JSON.stringify(part.result.value)
          }
        })
        return toolResult
      }
    }
  })

return inputFromMessages

}

export function toSystemInput(message: SystemMessage): SystemInput {
  return {
    type: "message",
    role: "system",
    content: message.content.map(part => {
      return {
        type: "input_text",
        text: part.text
      }
    })
  }
}
