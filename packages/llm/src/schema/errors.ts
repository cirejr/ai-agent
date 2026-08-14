
export type AppError = InvalidMedia | InvalidAudioFormat

export type InvalidMedia = {
  _tag: "InvalidMedia",
  message: string,
}

export type InvalidAudioFormat = {
  _tag: "InvalidAudioFormat",
  message: string
}
