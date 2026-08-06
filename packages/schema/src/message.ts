type Role = "system" | "user" | "assistant" | "tool"

type MessageHistory = Message[]

type TextPart = {
  kind: "text"
  content: string;
}

type ReasoningPart = {
  kind: "reasoning",
  content: string
}


type ToolCall = {
  toolCallId: string;
  name: string;
  arguments: Record<string, unknown>
}

type ToolCallPart = ToolCall & {
  kind: "tool-call"
}

type ToolResultPart = {
  kind: "tool-result"
  toolCallId: string;
  status: "success" | "error",
  content?: Record<string, unknown>
  error?: string
}

type AttachmentPart = {
  kind: "media"
  id: string;
  type: "image" | "document" | "audio"
  name: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;

  uploadProgress: number
}


type Part = TextPart | ToolCallPart | ReasoningPart | AttachmentPart | ToolResultPart

type Message = UserMessage | SystemMessage | AssistantMessage | ToolMessage

type BaseMessage = {
  id: string;
  role : Role
}

type UserMessage = {
  id: string;
  role: "user",
  content: UserPart[]
}

type SystemMessage = {
  id: string;
  role: "system",
  content: TextPart
}

type AssistantMessage = {
  id: string;
  role: "assistant",
  content: AssistantPart[]
}

type ToolMessage = {
  id: string;
  role: "tool",
  content: ToolPart[]
}

type UserPart = TextPart | AttachmentPart
type AssistantPart = TextPart | ToolCallPart | ReasoningPart
type ToolPart = ToolResultPart

export type { AssistantMessage, AssistantPart, AttachmentPart, BaseMessage, Message, MessageHistory, Part, ReasoningPart, Role, SystemMessage, TextPart, ToolCall, ToolCallPart, ToolMessage, ToolPart, ToolResultPart, UserMessage, UserPart}
