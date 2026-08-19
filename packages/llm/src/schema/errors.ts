
export type AppError = InvalidMedia | InvalidAudioFormat | InvalidPrompt | RateLimitExceeded | InvalidToolArguments | ServerError | ProviderError | PolicyError

export type InvalidMedia = {
  _tag: "InvalidMedia",
  message: string,
}

export type InvalidAudioFormat = {
  _tag: "InvalidAudioFormat",
  message: string
}

export type InvalidPrompt = {
  _tag: "InvalidPrompt",
  message: string,
}

export type RateLimitExceeded = {
  _tag: "RateLimitExceeded",
  message: string
}

export type InvalidToolArguments = {
  _tag: "InvalidToolArguments",
  message: string
}

export type ServerError = {
  _tag: "ServerError",
  message: string
}

export type ProviderError = {
  _tag: "ProviderError",
  message: string
}

export type PolicyError = {
  _tag: "PolicyError",
  message: string
}
