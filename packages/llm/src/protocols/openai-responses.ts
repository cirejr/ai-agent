import { Model, ModelID, type AppError, type AssistantMessage, type AssistantPart, type JsonSchema, type LLMRequest, type LLMResponse, type Message, type MessageHistory, type ReasoningPart, type Result, type SystemMessage, type TextPart, type ToolCallPart, type ToolMessage, type ToolResultPart } from "../schema"
import { getMediaCategory } from "../utils/media-category"
import { validateMedia } from "../utils/validate-media"
import { ALL_MIMES } from "../utils/media-mimes"
import { extractAudioFormat } from "../utils/extract-audio-format"
import { mapProviderError } from "../utils/map-provider-error"

type ResponseStatus = "completed" | "in_progress" | "failed" | "cancelled" | "queued" | "incomplete"
type ResponseOutputItemStatus = "completed" | "in_progress" | "failed"

type MessageContent = {
  type: "output_text",
  text: string
  annotations: unknown[]
}

type ResponseUsage = {
  input_tokens: number,
  output_tokens: number,
  input_tokens_details: {
    cache_write_tokens: number,
    cached_tokens: number
  },
  output_tokens_details: {
    reasoning_tokens: number
  },
  total_tokens: number,
}

export type ResponseOutputItem = ResponseOutputMessage | ReasoningOutput | ToolOutput | ToolCall

type ResponseOutputMessage = {
  type: "message",
  id: string,
  status: ResponseOutputItemStatus,
  role: "assistant",
  content: MessageContent[],
}

type ReasoningOutput = {
  type: "reasoning",
  id: string,
  status?: ResponseOutputItemStatus,
  encrypted_content?: string,
  summary: {
    type: "summary_text",
    text: string
    }[],
  content?: {
    type: "reasoning_text",
    text: string
    }[]
}

type ToolCaller = Direct | Program

type Direct = {
  type: "direct"
}

type Program = {
  caller_id: string,
  type: "program"
}

type ToolCall = {
  type: "function_call",
  id?: string,
  call_id: string,
  name: string,
  arguments: string
  status?: ResponseOutputItemStatus,
  caller?: ToolCaller
}

type ToolOutputContent = string | OutputContentList[]

type OutputContentList = ResponseInputText | ResponseInputImage | ResponseInputFile

type ToolOutput = {
  type: "function_call_output",
  id?: string,
  call_id: string,
  name?: string,
  output: ToolOutputContent,
  status: ResponseOutputItemStatus,
  created_by: string
}

export type OpenAIResponse = {
  id: string,
  object: "response",
  created_at: number,
  model: string,
  output: ResponseOutputItem[],
  usage?: ResponseUsage,
  parallel_tool_calls: boolean,
  temperature: number | null
  top_p: number | null,
  conversation?: { id: string } | null,
  status?: ResponseStatus,
  error: ResponseError | null,
  max_output_tokens?: number | null,
  max_tool_calls?: number | null,
  truncation?: "auto" | "disabled" | null,
  prompt_cache_options?: {
    mode: "implicit" | "explicit",
    ttl: "30m"
  }
}

export type ErrorCode = "invalid_prompt" | "rate_limit_exceeded" | "image_content_policy_violation" | "server_error" | "data_residency_mismatch" | "bio_policy"  |"vector_store_timeout" |"invalid_image" |"invalid_image_format" |"invalid_base64_image" |"invalid_image_url" |"image_too_large" |"image_too_small" |"image_parse_error" |"invalid_image_mode" |"image_file_too_large" |"unsupported_image_media_type" |"empty_image_file" |"failed_to_download_image" |"image_file_not_found"
export type ResponseError = {
    code: ErrorCode,
    message: string
}


type Request = BaseRequest | RequestWithTool

type BaseRequest = {
  model: string,
  input: Input[],
  instructions?: string | null,
  reasoning?: {
    effort: ReasoningEffort
  },
  stream?: boolean
  max_output_tokens?: number
}

type RequestWithTool = BaseRequest & {
  tools: Tool[],
  tool_choice?: ToolChoice
}

type ToolChoice = "auto" | "none" | "required"

type Tool = {
  type: "function",
  name: string,
  description?: string,
  strict?: boolean | null,
  parameters: JsonSchema,
  output_schema?: JsonSchema
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

type ResponseInputText = {
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

type ResponseInputFile = {
  type: "input_file",
  detail?:"auto" | "low"| "high",
  file_data?: string,
  file_id?: string,
  file_url?: string,
  filename?: string,
  prompt_cache_breakpoint?: {
    mode: "explicit"
  },
}

type ResponseInputImage = {
  type: "input_image",
  detail: "auto" | "low" | "high" | "original",
  file_id?: string,
  image_url?: string,
  prompt_cache_breakpoint?: {
    mode: "explicit"
  },
}

type UserVideo = {
  type: "input_video",
  video_url: string,
}

type UserInputContent = ResponseInputText | UserAudio | ResponseInputFile | ResponseInputImage | UserVideo

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
  summary: {
    type: "summary_text",
    text: string,
  }[],
  content?: {
    type: "reasoning_text",
    text: string
  }[],
  encrypted_content?: string,
  format?: unknown | "openai-responses-v1" | "azure-openai-responses-v1" | "google-gemini-v1" | "anthropic-claude-v1" | "bedrock-openai-responses-v1" | "xai-responses-v1" | "meta-responses-v1",
  signatures?: string
}

type AssistantInput = {
  type: 'message',
  role: 'assistant',
  id?: string,
  status?: MessageStatus,
  content: {
    type: 'output_text',
    text: string,
  }[]
}

type MessageStatus = "completed" | "in_progress" | "failed"

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
                const text: ResponseInputText = {
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
                    const image: ResponseInputImage =  {
                      type: "input_image",
                      detail: "original",
                      image_url: validated.value.dataUrl
                    }
                    content.push(image)
                    break
                  case "file": {
                    const file: ResponseInputFile =  {
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

export function toProvider(request: LLMRequest): Result<Request, AppError> {

  const result = toProviderInput(request.messages)

  if (!result.ok) return {
    ok: false,
    error: {
      _tag: result.error._tag,
      message: result.error.message
    }
  }

  const tools = request.tools.map<Tool>(tool => {
    return {
      type: "function" as const,
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
      output_schema: tool.outputSchema
    }
  })

  const providerRequest = {
    model: request.model.id,
    input: result.value,
    tools,
    tool_choice: request.toolChoice ?? "auto",
    reasoning: request.reasoning,
    max_output_tokens: request.maxTokenOutput,
    stream: request.stream,
  } satisfies Request

  return {
    ok: true,
    value: providerRequest
  }
}


export function fromProvider(response: OpenAIResponse, model: Model): Result<LLMResponse, AppError> {
  if (response.error != null) {
    return {
      ok: false,
      error: mapProviderError(response.error)
    }
  }

  const result = toMessages(response.output)

  if (!result.ok) return {
    ok: false,
    error: result.error
  }

  const llmResponse = {
    id: response.id,
    createdAt: response.created_at,
    status: response.status,
    model: model,
    messages: result.value,
    error: null,
    usage: response.usage && {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      totalTokens: response.usage.total_tokens,
      inputTokensDetails: {
        cacheWriteTokens: response.usage.input_tokens_details?.cache_write_tokens,
        cachedTokens: response.usage.input_tokens_details?.cached_tokens
      },
      outputTokensDetails: {
        reasoningTokens: response.usage.output_tokens_details?.reasoning_tokens
      }
    }
  } satisfies LLMResponse

  return {
    ok: true,
    value: llmResponse
  }
}

export function toMessages(output: ResponseOutputItem[]): Result<(AssistantMessage | ToolMessage)[], AppError> {

  const messages: (AssistantMessage | ToolMessage)[] = []

  const assistantParts = [] as AssistantPart[]
  const toolResultParts = [] as ToolResultPart[]

  for (const item of output) {

    if (item.type == "function_call_output") {
      const part = {
        id: item.id,
        name: item.name,
        toolCallId: item.call_id,
        type: "tool-result",
        result: item.status == "failed" ? {
          type: "error",
          value: item.output
        } : Array.isArray(item.output) ? {
            type: "content",
            value: item.output
          } : {
              type: "text",
              value: item.output
        }
      } satisfies ToolResultPart


      toolResultParts.push(part)
    }

    if (item.type == "message" || item.type == "function_call" || item.type == "reasoning") {
      switch (item.type) {
        case "message": {
          for (const part of item.content) {
            const messageContent = {
              type: "text",
              text: part.text
            } satisfies TextPart
            assistantParts.push(messageContent)
          }
          break
        }
        case "reasoning": {
          const reasoningPart = {
            id: item.id,
            type: "reasoning" as const,
            text: item.summary.map(s => s.text).join(","),
          } satisfies ReasoningPart
          assistantParts.push(reasoningPart)
          break
        }
        case "function_call": {
          let args: Record<string, unknown>
          try {
            args = JSON.parse(item.arguments)
          } catch(e) {
            return {
              ok: false,
              error: {
                _tag: "InvalidToolArguments",
                message: `${e instanceof Error ? e.message : `Invalid arguments for ${item.name}`}`
              }
            }
          }
          const toolCallPart = {
            id: item.id,
            name: item.name,
            toolCallId: item.call_id,
            type: "tool-call" as const,
            arguments: args
          } satisfies ToolCallPart

          assistantParts.push(toolCallPart)
          break
        }
      }

    }
  }

  if(assistantParts.length > 0) {
    const assistantMessages = {
      role: "assistant" as const,
      content: assistantParts
    } satisfies AssistantMessage

    messages.push(assistantMessages)
  }

 if(toolResultParts.length> 0) {
  const toolPart = {
    role: "tool" as const,
    content : toolResultParts
  } satisfies ToolMessage

  messages.push(toolPart)
 }

  return {
    ok: true,
    value: messages
  }
}

export * as OpenAIResponses from "./openai-responses"
