type Schema<T> = {
  parse(input: unknown): T
}

type ToolDescriptor<Input, Output> = {
  name: string;
  description: string;
  inputSchema: Schema<Input>
  outputSchema?: Schema<Output>
  execute: (args: unknown) => Promise<Output>
}

type AnyToolDescriptor = ToolDescriptor<any, any>

export type { Schema, ToolDescriptor, AnyToolDescriptor}
