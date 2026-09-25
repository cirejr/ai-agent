import { yus } from "../yusra"; 


export const MediaPartSchema = yus.object({ type: yus.literal("media"), id: yus.string(), name: yus.string(), mimeType: yus.string(), data: yus.union([yus.string(), ]) })
export const ModelSchema = yus.object({ id: yus.string(), media: MediaPartSchema })
export const LLMRequestSchema = yus.object({ model: ModelSchema })
export const NewSchema = yus.object({ data: undefined })
export const CSchema = yus.string()
export const BSchema = yus.object({ y: CSchema })
export const ASchema = yus.object({ x: yus.array(BSchema) })