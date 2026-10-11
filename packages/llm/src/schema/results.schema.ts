import { yus } from "../yusra";
import type { Schema } from "../../core";

export const ResultSchema = <T, E>(T: Schema<T>, E: Schema<E>) =>
  yus.union([
    yus.object({ ok: yus.literal(true), value: T }),
    yus.object({ ok: yus.literal(false), error: E }),
  ]);
