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

type ToolCallPart = ToolCall & {
  kind: "toolCall"
}

type ToolResult = {
  kind: "ToolResult"
  status: "success" | "error",
  payload: {
    toolCallId: string;
    content: Record<string, unknown>
  }
}

type Attachment = {
  kind: "media"
  id: string;
  type: "image" | "document" | "audio"
  name: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;

  uploadProgress: number
}

type ToolCall = {
  toolCallId: string;
  name: string;
  arguments: Record<string, unknown>
}

type Part = TextPart | ToolCallPart | ReasoningPart | Attachment | ToolResult

type Message = {
  id: string;
  role: Role
  content: Part[]
}
