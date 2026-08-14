import type { Result } from "./results";

type Role = "system" | "user" | "assistant" | "tool"

type MessageHistory = Message[]

type TextPart = {
  type: "text"
  text: string;
}

type ReasoningPart = {
  type: "reasoning",
  id?: string,
  text: string
}

type ToolCallPart = {
  id?: string,
  type: "tool-call",
  toolCallId: string;
  name: string;
  arguments: Record<string, unknown>
}

type ToolResultValue = {
  type: "json"
  value: unknown
} | {
  type: "text"
  value: unknown
} | {
  type: "error"
  value: unknown
} | {
  type: "content"
  value: unknown[]
}

type ToolResultPart = {
  id?: string,
  type: "tool-result"
  toolCallId: string;
  name: string,
  result: ToolResultValue
}

type MediaPart = {
  type: "media"
  id: string;
  name: string;
  mimeType: string;
  data: string | Uint8Array // string either Base64 encoded data or dataUrl => data:mimeType+base64
}

type Part = TextPart | ToolCallPart | ReasoningPart | MediaPart | ToolResultPart

type Message = UserMessage | SystemMessage | AssistantMessage | ToolMessage

type UserMessage = {
  id: string;
  role: "user",
  content: UserPart[]
}

type SystemMessage = {
  id: string;
  role: "system",
  content: TextPart[]
}

type AssistantMessage = {
  id: string;
  role: "assistant",
  status?: "completed" | "in_progress" | "failed"
  content: AssistantPart[]
}

type ToolMessage = {
  id: string;
  role: "tool",
  content: ToolPart[]
}

type UserPart = TextPart | MediaPart
type AssistantPart = TextPart | ToolCallPart | ReasoningPart
type ToolPart = ToolResultPart

type ToolChoice = "auto" | "none" | "required"

type ReasoningEffort = "minimal" | "low" | "medium" | "high"

type JsonSchema = {
  type?: "object" | "string" | "number" | "integer" | "boolean" | "array" | "null",
  properties: Record<string, JsonSchema>,
  required?: string[],
  items?: JsonSchema,
  enum?: unknown[],
  description?: string
}

type Tool = {
  name: string,
  description: string,
  parameters: JsonSchema
}


type LLMRequest = {
  model: string,
  messages: MessageHistory,
  tools: Tool[],
  toolChoice: ToolChoice,
  reasoning?: {
    effort: ReasoningEffort
  },
  stream?: boolean,
  maxTokenOutput?: number
}

export type {
  AssistantMessage,
  AssistantPart,
  MediaPart,
  Message,
  MessageHistory,
  Part,
  ReasoningPart,
  Role,
  SystemMessage,
  TextPart,
  ToolCallPart,
  ToolMessage,
  ToolPart,
  ToolResultPart,
  UserMessage,
  UserPart
}
