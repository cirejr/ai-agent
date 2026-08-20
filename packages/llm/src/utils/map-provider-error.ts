
import type { ResponseError } from "../protocols/openai-responses";
import type { AppError } from "../schema";

const ERROR_TAG = {
  rate_limit_exceeded: "RateLimitExceeded",
  invalid_prompt: "InvalidPrompt",
  server_error: "ProviderServerError",
  bio_policy: "PolicyError",
  image_content_policy_violation: "PolicyError",
  data_residency_mismatch: "ProviderError",
  vector_store_timeout: "ProviderError",
  invalid_image: "InvalidMedia",
  invalid_image_format: "InvalidMedia",
  invalid_base64_image: "InvalidMedia",
  invalid_image_url: "InvalidMedia",
  image_too_large: "InvalidMedia",
  image_too_small: "InvalidMedia",
  image_parse_error: "InvalidMedia",
  invalid_image_mode: "InvalidMedia",
  image_file_too_large: "InvalidMedia",
  unsupported_image_media_type: "InvalidMedia",
  empty_image_file: "InvalidMedia",
  failed_to_download_image: "InvalidMedia",
  image_file_not_found: "InvalidMedia",
} satisfies Record<ResponseError["code"], AppError["_tag"]>

export function mapProviderError(error: ResponseError): AppError {
  return { _tag: ERROR_TAG[error.code], message: error.message }
}
