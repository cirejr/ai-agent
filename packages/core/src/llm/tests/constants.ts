import type { Message } from "@erwin/schema"
import type { Input } from "../protocols/openrouter-request"

export const test01 = {
  messages : [
  {
    id: 'fc_01',
    role: "user",
    content: [{
      type: "text",
      text: "Hello"
    }]
  },
  {
    id: "fc_02",
    role: "assistant",
    content: [{
      type: "text",
      text: "Yes, Hi what can I do for you"
    }]
  }
  ] as Message[],
  providerInput: [
  {
    type: "message",
    role: "user",
    content: [{
      type: "input_text",
      text: "Hello"
    }]
  },
  {
    type: 'message',
    role: 'assistant',
    id: 'fc_02',
    status: "in_progress",
    content: [{
      type: "output_text",
      text: "Yes, Hi what can I do for you"
    }]
  }
] as Input[]
}


export const test02 = {
  messagesWTC: [
  {
    id: 'fc_01',
    role: "user",
    content: [{
      type: "text",
      text: "Hello analyze the weather"
    }]
  },
  {
    id: "fc_02",
    role: "assistant",
    content: [{
      type: "text",
      text: "Hi, yes sure!"
    }]
  },
  {
    id: "fc_03",
    role: "assistant",
    content: [
      {
        type: "tool-call",
        toolCallId: "tc_01",
        name: "get_wheather",
        arguments: {
          city: "dakar",
        }
      }
    ]
  },
  ] as Message[],
  providerInputWTC: [
  {
    type: "message",
    role: "user",
    content: [{
      type: "input_text",
      text: "Hello analyze the weather"
    }]
  },
  {
    type: 'message',
    role: 'assistant',
    id: 'fc_02',
    status: "in_progress",
    content: [{
      type: "output_text",
      text: "Hi, yes sure!"
    }]
  },
  {
    type: "function_call",
    id: 'fc_03',
    call_id: "tc_01",
    name: "get_wheather",
    arguments: "{\"city\":\"dakar\"}"
  }
] as Input[]
}

export const test03 = {
  messagesWTO: [
  {
    id: 'fc_01',
    role: "user",
    content: [{
      type: "text",
      text: "Hello analyze the weather"
    }]
  },
  {
    id: "fc_02",
    role: "assistant",
    content: [{
      type: "text",
      text: "Hi, yes sure!"
    }]
  },
  {
    id: "fc_03",
    role: "assistant",
    content: [
      {
        type: "tool-call",
        toolCallId: "tc_01",
        name: "get_wheather",
        arguments: {
          city: "dakar",
        }
      }
    ]
  },
  {
    id: "msg_04",
    role: "tool",
    content: [
      {
        type: "tool-result",
        toolCallId: "tc_01",
        name: "get_wheather",
        result: {
          type: "json",
          value: { temperature: '39°C', condition: 'Sunny' },
        }
      }
    ]
  },
  ] as Message[],
  providerInputWTO: [
  {
    type: "message",
    role: "user",
    content: [{
      type: "input_text",
      text: "Hello analyze the weather"
    }]
  },
  {
    type: 'message',
    role: 'assistant',
    id: 'fc_02',
    status: "in_progress",
    content: [{
      type: "output_text",
      text: "Hi, yes sure!"
    }]
  },
  {
    type: "function_call",
    id: 'fc_03',
    call_id: "tc_01",
    name: "get_wheather",
    arguments: "{\"city\":\"dakar\"}"
  },
  {
    type: 'function_call_output',
    id: 'fc_output_1',
    call_id: 'tc_01',
    output: JSON.stringify({ temperature: '39°C', condition: 'Sunny' }),
  },
] as Input[]
}

export const test04 = {
  messagesWTO: [
    {
      id: 'msg_01',
      role: "system",
      content: [{
        type: "text",
        text: "you're a senior dev"
      }]
    },
  {
    id: 'msg_01',
    role: "user",
    content: [{
      type: "text",
      text: "Hello analyze my package.json file and today's weather"
    }]
  },
  {
    id: "msg_02",
    role: "assistant",
    content: [
      {
      type: "text",
      text: "Hi, yes sure!"
    },
    {
      type: "tool-call",
      toolCallId: "tc_02",
      name: "glob",
      arguments: {
        pattern: "**/package.json",
      }
    }
    ]
  },
  {
    id: "msg_03",
    role: "assistant",
    content: [
      {
        type: "tool-call",
        toolCallId: "tc_01",
        name: "get_wheather",
        arguments: {
          city: "dakar",
        }
      }
    ]
  },
  {
    id: "msg_04",
    role: "tool",
    content: [
      {
        type: "tool-result",
        toolCallId: "tc_01",
        name: "get_wheather",
        result: {
          type: "json",
          value: { temperature: '39°C', condition: 'Sunny' },
        }
      }
    ]
  },
  ] as Message[],
  providerInputWTO: [
  {
    type: "message",
    role: "user",
    content: [{
      type: "input_text",
      text: "Hello analyze my package.json file and today's weather"
    }]
  },
  {
    type: 'message',
    role: 'assistant',
    id: 'fc_02',
    status: "in_progress",
    content: [{
      type: "output_text",
      text: "Hi, yes sure!"
    }]
    },
    {
      type: "function_call",
      id: 'fc_03',
      call_id: "tc_02",
      name:"glob",
      arguments: "{\"pattern\":\"**/package.json\"}"
    },
  {
    type: "function_call",
    id: 'fc_03',
    call_id: "tc_01",
    name: "get_wheather",
    arguments: "{\"city\":\"dakar\"}"
  },
  {
    type: 'function_call_output',
    id: 'fc_output_1',
    call_id: 'tc_01',
    output: JSON.stringify({ temperature: '39°C', condition: 'Sunny' }),
  },
] as Input[]
}
