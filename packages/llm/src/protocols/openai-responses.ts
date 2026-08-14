import { type AppError, type Message, type Result, type SystemMessage } from "../schema"
import { getMediaCategory } from "../utils/media-category"
import { validateMedia } from "../utils/validate-media"
import { ALL_MIMES } from "../utils/media-mimes"
import { extractAudioFormat } from "../utils/extract-audio-format"

type Status = "completed" | "in_progress" | "failed"

type MessageContent = {
  type: "output_text",
  text: string
  annotations: unknown[]
}

type UsageStats = {
  input_tokens: number,
  output_tokens: number,
  output_tokens_details?: {
    reasoning_tokens: number
  },
  total_tokens: number,
}

type Output = MessageOutput | ReasoningOutput | ToolOutput

type MessageOutput = {
  type: "message",
  id: string,
  status: Status,
  role: "assistant",
  content: MessageContent[],
}

type ReasoningOutput = {
  type: "reasoning",
  id: string,
  status: Status,
  encrypted_content?: string,
  summary?: string[]
  content?: {
    type: "reasoning_text",
    text: string
    }[]
}

type ToolOutput = {
  type: "function_call",
  id: string,
  call_id: string,
  name: string,
  arguments: string
}

type SuccessResponse = {
  id: string,
  object: "response",
  created_at: number,
  model: string,
  output: Output[]
  usage?: UsageStats,
  status: "completed" | "in_progress"
  error: null,
  error_type?: never
}

type FailedResponse = {
  id: string,
  status: "failed"
  error: ProviderError,
  error_type: string
}

type ErrorCode = "invalid_prompt" | "rate_limit_exceeded" | "image_content_policy_violation" | "server_error"

type ProviderError = {
    code: ErrorCode,
    message: string
}

type OpenAIResponse = SuccessResponse | FailedResponse

type Request = BaseRequest | RequestWithTool

type BaseRequest = {
  model: string,
  input: Input[],
  instructions: string,
  reasoning?: {
    effort: ReasoningEffort
  },
  stream?: boolean
  max_output_tokens?: number
}

type RequestWithTool = BaseRequest & {
  tools: Tool[],
  tool_choice: ToolChoice
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
    format: string
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

export function toProviderInput(messages: Message[]): Result<Input[], AppError> {
  const inputs = []
  for(const message of messages) {
    switch (message.role) {
      case "system":
        inputs.push(toSystemInput(message))
        break
      case "user": {
        const content: UserInputContent[] = []
        for (const part of message.content) {
            switch (part.type) {
              case "text": {
                const text: UserText = {
                  type: "input_text",
                  text: part.text
                }
                content.push(text)
                break
              }
              case "media": {
                const category = getMediaCategory(part.mimeType)
                const validated = validateMedia(part.mimeType, part.data, new Set(ALL_MIMES))
                if (!validated.ok) {
                  return {
                    ok: false,
                    error: {
                      _tag: "InvalidMedia",
                      message: "Not a valid media"
                    }
                  }
                }
                switch (category) {
                  case "image":
                    const image: UserImage =  {
                      type: "input_image",
                      detail: "original",
                      image_url: validated.value.dataUrl
                    }
                    content.push(image)
                    break
                  case "file": {
                    const file: UserFile =  {
                      type: "input_file",
                      file_id: part.id,
                      filename: part.name,
                      file_url: validated.value.dataUrl,
                      file_data: validated.value.base64,
                    }

                    content.push(file)
                    break
                  }
                  case "audio": {
                    const format = extractAudioFormat(validated.value.mime)
                    if (!format.ok) {
                      return {
                        ok: false,
                        error: {
                          _tag: "InvalidAudioFormat",
                          message: "Not a valid audio format"
                        }
                      }
                    }
                    const audio: UserAudio = {
                      type: "input_audio",
                      input_audio: {
                        data: validated.value.base64,
                        format: format.value.format
                      }
                    }
                    content.push(audio)
                    break
                  }
                  case "video": {
                    const video: UserVideo = {
                      type: "input_video",
                      video_url: validated.value.dataUrl
                    }
                    content.push(video)
                    break
                  }
                }
              }
            }
          }
        inputs.push({type: "message" as const, role: "user" as const, content})
        break
      }
      case "assistant": {
        const assistantMessage = message.content.map<AssistantInput|ToolInput|ReasoningOutputInput>(part => {
          switch (part.type) {
            case "text":
            //console.log('assistant message received', message)
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

        inputs.push(...assistantMessage)
        break
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
        inputs.push(...toolResult)
        break
      }
    }
  }

  return {
    ok: true,
    value: inputs
  }

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



export function fromProvider(response: OpenAIResponse) {
  if (response?.status === "failed") {
    return {
      status: "failed",
      error: response.error,
      error_type: response.error_type
    }
  } else {

    const result = response.output.map(output => {
      if (output.type === "message") {

      }
    } )

  }
}



export * as OpenAIResponses from "./openai-responses"
