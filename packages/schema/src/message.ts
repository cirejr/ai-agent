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
