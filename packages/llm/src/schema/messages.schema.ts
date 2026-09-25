import { yus } from "../yusra"; 
import { AppErrorSchema } from "./errors.schema"
import { ModelSchema } from "./model.schema"


export const RoleSchema = yus.union([yus.literal("system"), yus.literal("user"), yus.literal("assistant"), yus.literal("tool")])
export const TextPartSchema = yus.object({ type: yus.literal("text"), text: yus.string() })
export const MediaPartSchema = yus.object({ type: yus.literal("media"), id: yus.string(), name: yus.string(), mimeType: yus.string(), data: yus.union([yus.string(), ]) })
export const UserPartSchema = yus.union([TextPartSchema, MediaPartSchema])
export const UserMessageSchema = yus.object({ id: yus.string().optional(), role: yus.literal("user"), content: yus.array(UserPartSchema) })
export const SystemMessageSchema = yus.object({ id: yus.string().optional(), role: yus.literal("system"), content: yus.array(TextPartSchema) })
export const ToolCallPartSchema = yus.object({ id: yus.string().optional(), type: yus.literal("tool-call"), toolCallId: yus.string(), name: yus.string(), arguments: undefined })
export const ReasoningPartSchema = yus.object({ type: yus.literal("reasoning"), id: yus.string().optional(), text: yus.string() })
export const AssistantPartSchema = yus.union([TextPartSchema, ToolCallPartSchema, ReasoningPartSchema])
export const AssistantMessageSchema = yus.object({ id: yus.string().optional(), role: yus.literal("assistant"), status: yus.union([yus.literal("completed"), yus.literal("in_progress"), yus.literal("failed")]).optional(), content: yus.array(AssistantPartSchema) })
export const ToolResultValueSchema = yus.union([yus.object({ type: yus.literal("json"), value: undefined }), yus.object({ type: yus.literal("text"), value: undefined }), yus.object({ type: yus.literal("error"), value: undefined }), yus.object({ type: yus.literal("content"), value: yus.array(undefined) })])
export const ToolResultPartSchema = yus.object({ id: yus.string().optional(), type: yus.literal("tool-result"), toolCallId: yus.string(), name: yus.string().optional(), result: ToolResultValueSchema })
export const ToolPartSchema = ToolResultPartSchema
export const ToolMessageSchema = yus.object({ id: yus.string().optional(), role: yus.literal("tool"), content: yus.array(ToolPartSchema) })
export const MessageSchema = yus.union([UserMessageSchema, SystemMessageSchema, AssistantMessageSchema, ToolMessageSchema])
export const MessageHistorySchema = yus.array(MessageSchema)
export const PartSchema = yus.union([TextPartSchema, ToolCallPartSchema, ReasoningPartSchema, MediaPartSchema, ToolResultPartSchema])
export const ToolChoiceSchema = yus.union([yus.literal("auto"), yus.literal("none"), yus.literal("required")])
export const ReasoningEffortSchema = yus.union([yus.literal("minimal"), yus.literal("low"), yus.literal("medium"), yus.literal("high")])
export const JsonSchemaSchema = yus.object({ type: yus.union([yus.literal("object"), yus.literal("string"), yus.literal("number"), yus.literal("integer"), yus.literal("boolean"), yus.literal("array"), yus.literal("null")]).optional(), properties: undefined, required: yus.array(yus.string()).optional(), items: JsonSchemaSchema.optional(), enum: yus.array(undefined).optional(), description: yus.string().optional() })
export const ToolSchema = yus.object({ name: yus.string(), description: yus.string(), inputSchema: JsonSchemaSchema, outputSchema: JsonSchemaSchema.optional() })
export const LLMRequestSchema = yus.object({ model: ModelSchema, messages: MessageHistorySchema, tools: yus.array(ToolSchema), toolChoice: ToolChoiceSchema.optional(), max_tool_calls: yus.union([yus.number(), yus.literal(null)]).optional(), reasoning: yus.object({ effort: ReasoningEffortSchema }).optional(), stream: yus.boolean().optional(), maxTokenOutput: yus.number().optional() })
export const ResponseUsageSchema = yus.object({ inputTokens: yus.number(), outputTokens: yus.number(), inputTokensDetails: yus.object({ cacheWriteTokens: yus.number(), cachedTokens: yus.number() }), outputTokensDetails: yus.object({ reasoningTokens: yus.number() }), totalTokens: yus.number() })
export const ResponseStatusSchema = yus.union([yus.literal("completed"), yus.literal("in_progress"), yus.literal("failed"), yus.literal("cancelled"), yus.literal("queued"), yus.literal("incomplete")])
export const LLMResponseSchema = yus.object({ id: yus.string(), createdAt: yus.number(), model: ModelSchema, messages: MessageHistorySchema, usage: ResponseUsageSchema.optional(), status: ResponseStatusSchema.optional(), error: yus.union([AppErrorSchema, yus.literal(null)]) })