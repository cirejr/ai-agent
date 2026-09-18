import { yus } from "../yusra";

export const ResultSchema = yus.union([yus.object({ ok: yus.literal(true), value: TSchema }), yus.object({ ok: yus.literal(false), error: ESchema })])
