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



export type { OpenAIResponse, Output, UsageStats, Status, ProviderError, ErrorCode }
