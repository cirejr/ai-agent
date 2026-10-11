import { yus } from "../yusra";

export const ModelID = yus.string().brand<"ModelID">();
export const ProviderID = yus.string().brand<"ProviderID">();
export const ModelSchema = yus.object({ id: ModelID, provider: ProviderID });
