import type { AppError } from "../schema";

export function mapProviderError(errorCode: string) {
  //TODO: properly construct this function
  return {_tag: "RateLimitExceeded" as const }
}
