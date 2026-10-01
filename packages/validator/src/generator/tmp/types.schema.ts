import { yus } from "../yusra";
import type { Schema } from "../../core";

export const EventResultSchema = <T extends `event_${string}`, E = Error>(
  T: Schema<T>,
  E: Schema<E>,
) =>
  yus.union([
    yus.object({ ok: yus.literal(true), value: T }),
    yus.object({ ok: yus.literal(false), error: E }),
  ]);
export const StoreSchema = <T, K extends keyof T>(T: Schema<T>, K: Schema<K>) =>
  yus.object({ item: T, key: K });
