export type Result<T, E> = { ok: true, value: T } | { ok: false, error: E }

export type ValidateMedia = {
  mime: string,
  bytes: Uint8Array<ArrayBuffer>,
  dataUrl: string,
  base64: string
}

export type AppError = InvalidMedia | InvalidAudioFormat

export type InvalidMedia = {
  _tag: "InvalidMedia",
  message: string,
}

export type InvalidAudioFormat = {
  _tag: "InvalidAudioFormat",
  message: string
}
