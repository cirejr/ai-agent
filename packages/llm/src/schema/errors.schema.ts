import { yus } from "../yusra"; 


export const InvalidMediaSchema = yus.object({ _tag: yus.literal("InvalidMedia"), message: yus.string() })
export const InvalidAudioFormatSchema = yus.object({ _tag: yus.literal("InvalidAudioFormat"), message: yus.string() })
export const InvalidPromptSchema = yus.object({ _tag: yus.literal("InvalidPrompt"), message: yus.string() })
export const RateLimitExceededSchema = yus.object({ _tag: yus.literal("RateLimitExceeded"), message: yus.string() })
export const InvalidToolArgumentsSchema = yus.object({ _tag: yus.literal("InvalidToolArguments"), message: yus.string() })
export const ProviderServerErrorSchema = yus.object({ _tag: yus.literal("ProviderServerError"), message: yus.string() })
export const ProviderErrorSchema = yus.object({ _tag: yus.literal("ProviderError"), message: yus.string() })
export const PolicyErrorSchema = yus.object({ _tag: yus.literal("PolicyError"), message: yus.string() })
export const InvalidResponseSchema = yus.object({ _tag: yus.literal("InvalidResponse"), message: yus.string() })
export const AppErrorSchema = yus.union([InvalidMediaSchema, InvalidAudioFormatSchema, InvalidPromptSchema, RateLimitExceededSchema, InvalidToolArgumentsSchema, ProviderServerErrorSchema, ProviderErrorSchema, PolicyErrorSchema, InvalidResponseSchema])