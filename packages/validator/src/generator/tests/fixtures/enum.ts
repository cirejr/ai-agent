export enum Status {
  Pending,
  Active,
  Disabled,
}

export enum HttpStatus {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
}

export enum Role {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}
