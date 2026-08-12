import type { Message } from "@erwin/schema"
import type { Input } from "../protocols/openai-request"

export const test01 = {
  messages: [
    {
      id: 'msg_00',
      role: "system",
      content: [{
        type: "text",
        text: "Your a personal assistant, help me"
      }]
  },
  {
    id: 'msg_01',
    role: "user",
    content: [{
      type: "text",
      text: "Hello"
    }]
  },
  {
    id: "msg_02",
    role: "assistant",
    status: "completed",
    content: [{
      type: "text",
      text: "Yes, Hi what can I do for you"
    }]
  }
  ] as Message[],
  providerInput: [
    {
      type: "message",
      role: "system",
      content: [{
        type: "input_text",
        text: "Your a personal assistant, help me"
      }]
  },
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
    id: 'msg_02',
    status: "completed",
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
    id: 'msg_01',
    role: "user",
    content: [{
      type: "text",
      text: "Hello analyze the weather"
    }]
  },
  {
    id: "msg_02",
    role: "assistant",
    status: "completed",
    content: [{
      type: "text",
      text: "Hi, yes sure!"
    }]
  },
  {
    id: "msg_03",
    role: "assistant",
    content: [
      {
        id: "fc_01",
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
    id: 'msg_02',
    status: "completed",
    content: [{
      type: "output_text",
      text: "Hi, yes sure!"
    }]
  },
  {
    type: "function_call",
    id: 'fc_01',
    call_id: "tc_01",
    name: "get_wheather",
    arguments: "{\"city\":\"dakar\"}"
  }
] as Input[]
}

export const test03 = {
  messagesWTO: [
  {
    id: 'msg_01',
    role: "user",
    content: [{
      type: "text",
      text: "Hello analyze the weather"
    }]
  },
  {
    id: "msg_02",
    role: "assistant",
    status: "completed",
    content: [{
      type: "text",
      text: "Hi, yes sure!"
    }]
  },
  {
    id: "msg_03",
    role: "assistant",
    content: [
      {
        id: "fc_01",
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
        id:"fc_output_1",
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
    id: 'msg_02',
    status: "completed",
    content: [{
      type: "output_text",
      text: "Hi, yes sure!"
    }]
  },
  {
    type: "function_call",
    id: 'fc_01',
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
    status: "completed",
    content: [
      {
      type: "text",
      text: "Hi, yes sure!"
    },
      {
      id: "fc_01",
      type: "tool-call",
      toolCallId: "tc_01",
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
        id: "fc_02",
        type: "tool-call",
        toolCallId: "tc_02",
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
        id: "fc_output_1",
        type: "tool-result",
        toolCallId: "tc_02",
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
      role: "system",
      content: [{
        type: "input_text",
        text: "you're a senior dev"
      }]
  },
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
    id: 'msg_02',
    status: "completed",
    content: [{
      type: "output_text",
      text: "Hi, yes sure!"
    }]
    },
    {
      type: "function_call",
      id: 'fc_01',
      call_id: "tc_01",
      name:"glob",
      arguments: "{\"pattern\":\"**/package.json\"}"
    },
  {
    type: "function_call",
    id: 'fc_02',
    call_id: "tc_02",
    name: "get_wheather",
    arguments: "{\"city\":\"dakar\"}"
  },
  {
    type: 'function_call_output',
    id: 'fc_output_1',
    call_id: 'tc_02',
    output: JSON.stringify({ temperature: '39°C', condition: 'Sunny' }),
  },
] as Input[]
}

export const test05 = {
  messagesWR: [
    {
      id: "msg_01",
      role: "user",
      content: [
        {
          type: "text",
          text: "Please read the content of this file and provide me with a resume that matches it"
         },
        {
        type: "media",
        id: "md_01",
        mimeType: "application/pdf",
        name: "react-job-offer.pdf"
      }]
    },
  {
    id: "msg_02",
    role: "assistant",
    status: "completed",
    content: [
      {
        type: "reasoning",
        id: "rs_01",
        text: "Okay, Let's first see. By the name of the file, this looks like a job offer for a react role. Yes it seems I am correct. "
      },
      {
        type: "text",
        text: "This is a react job offer, so here is a resume tailored to the offer"
      }
    ]
  }
  ] as Message[],
  providerInputWR: [
    {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Please read the content of this file and provide me with a resume that matches it"
        },
        {
          type: "input_file",
          file_id: "md_01",
          filename: "react-job-offer.pdf"
        }
      ]
    },
    {
      type: "reasoning",
      id: "rs_01",
      status: "completed",
      summary: [{
        type: "summary_text",
        text: "Okay, Let's first see. By the name of the file, this looks like a job offer for a react role. Yes it seems I am correct. "
      }]
    },
    {
      type: "message",
      id: "msg_01",
      role: "assistant",
      status: "completed",
      content: [{
        type: "output_text",
        text: "This is a react job offer, so here is a resume tailored to the offer"
      }]
    }
  ] as Input[]
}
