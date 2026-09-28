import { yus } from "../yusra";

export const BrandSchema = yus.intersection(
  TSchema,
  yus.object({ [__brand]: BSchema }),
);
export const ModelIDSchema = BrandSchema;
export const ProviderIDSchema = BrandSchema;
export const ModelSchema = yus.object({
  id: ModelIDSchema,
  provider: ProviderIDSchema,
});
