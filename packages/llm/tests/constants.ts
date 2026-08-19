import type { LLMResponse, Message } from "../src/schema/messages"
import type { Input, OpenAIResponse } from "../src/protocols/openai-responses"
import type { AppError } from "../src/schema"
import type { Model } from "../src/schema/model"

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
  ] satisfies Message[],
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
] satisfies Input[]
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
  ] satisfies Message[],
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
] satisfies Input[]
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
  ] satisfies Message[],
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
] satisfies Input[]
}

export const test04 = {
  messagesWTO: [
    {
      id: "msg_00",
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
  ] satisfies Message[],
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
] satisfies Input[]
}

export const test05 = {
  messagesWR: [
    {
      id: "msg_00",
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
        name: "react-job-offer.pdf",
        data: "VG8gaW5zdGFsbCBkZXBlbmRlbmNpZXM6CmBgYHNoCmJ1biBpbnN0YWxsCmBgYAoKVG8gcnVuOgpgYGBzaApidW4gcnVuIGRldgpgYGAKCm9wZW4gaHR0cDovL2xvY2FsaG9zdDozMDAwCiMgYWktYWdlbnQK"
      }]
    },
  {
    id: "msg_01",
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
  ] satisfies Message[],
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
          filename: "react-job-offer.pdf",
          file_data:"VG8gaW5zdGFsbCBkZXBlbmRlbmNpZXM6CmBgYHNoCmJ1biBpbnN0YWxsCmBgYAoKVG8gcnVuOgpgYGBzaApidW4gcnVuIGRldgpgYGAKCm9wZW4gaHR0cDovL2xvY2FsaG9zdDozMDAwCiMgYWktYWdlbnQK",
          file_url:"data:application/pdf;base64,VG8gaW5zdGFsbCBkZXBlbmRlbmNpZXM6CmBgYHNoCmJ1biBpbnN0YWxsCmBgYAoKVG8gcnVuOgpgYGBzaApidW4gcnVuIGRldgpgYGAKCm9wZW4gaHR0cDovL2xvY2FsaG9zdDozMDAwCiMgYWktYWdlbnQK"
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
      }],
      content: [{
        type: "reasoning_text",
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
  ] satisfies Input[]
}

export const resp01 = {
  response: {
    id: "resp_01", object: "response", created_at: 1720000000, model: "gpt-4o",
    output: [{
      type: "message", id: "msg_01", status: "completed", role: "assistant",
      content: [{ type: "output_text", text: "Yes, Hi what can I do for you", annotations: [] }]
    }],
    usage: { input_tokens: 10, output_tokens: 20, total_tokens: 30, input_tokens_details : { cache_write_tokens: 456, cached_tokens: 152 }, output_tokens_details : { reasoning_tokens: 0 } },
    parallel_tool_calls: true, temperature: null, top_p: null,
    status: "completed", error: null,
  } satisfies OpenAIResponse,
  expected: {
    id: "resp_01", createdAt: 1720000000, status: "completed", model: "gpt-4o",
    messages: [{ role: "assistant", content: [{ type: "text", text: "Yes, Hi what can I do for you" }] }],
    error: null,
    usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30, inputTokensDetails : { cacheWriteTokens: 456, cachedTokens: 152 }, outputTokensDetails : { reasoningTokens: 0 }  },
  } satisfies LLMResponse,
}


export const resp02 = {
  response: {
    id: "resp_02", object: "response", created_at: 1720000000, model: "gpt-4o",
    output: [
      { type: "message", id: "msg_01", status: "completed", role: "assistant",
        content: [{ type: "output_text", text: "Sure, let me check", annotations: [] }] },
      { type: "function_call", id: "fc_01", call_id: "tc_01", name: "get_wheather",
        arguments: '{"city":"dakar"}', status: "completed" },
      { type: "function_call_output", id: "fc_output_1", call_id: "tc_01", name: "get_wheather",
        output: JSON.stringify({ temperature: "39°C", condition: "Sunny" }),
        status: "completed", created_by: "system" },
    ],
    usage: { input_tokens: 10, output_tokens: 20, total_tokens: 30, input_tokens_details : { cache_write_tokens: 456, cached_tokens: 152 }, output_tokens_details : { reasoning_tokens: 0 }  },
    parallel_tool_calls: true, temperature: null, top_p: null,
    status: "completed", error: null,
  } satisfies OpenAIResponse,
  expected: {
    id: "resp_02", createdAt: 1720000000, status: "completed", model: "gpt-4o" as Model["id"],
    messages: [
      {
        role: "assistant",
        content: [
          { type: "text", text: "Sure, let me check" },
          { type: "tool-call", id: "fc_01", name: "get_wheather", toolCallId: "tc_01", arguments: { city: "dakar" } },
        ],
      },
      {
        role: "tool",
        content: [{
          id: "fc_output_1", type: "tool-result", toolCallId: "tc_01",
          name: "get_wheather", result: { type: "text", value: '{"temperature":"39°C","condition":"Sunny"}' },
        }],
      },
    ],
    error: null,
    usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30, inputTokensDetails : { cacheWriteTokens: 456, cachedTokens: 152 }, outputTokensDetails : { reasoningTokens: 0 }  },
  } satisfies LLMResponse,
}

export const resp03 = {
  response: {
    id: "resp_03",
    object: "response",
    created_at: 1720000000,
    model: "gpt-4o",
    output: [
      {
        type: "message",
        id: "msg_01",
        status: "completed",
        role: "assistant",
        content: [{ type: "output_text", text: "Sure, let me check", annotations: [] }],
      },
      {
        type: "function_call",
        id: "fc_01",
        call_id: "tc_01",
        name: "get_wheather",
        arguments: '{"city":"dakar"}',
        status: "completed",
      },
      {
        type: "function_call_output",
        id: "fc_output_1",
        call_id: "tc_01",
        name: "get_wheather",
        output: JSON.stringify({ temperature: "39°C", condition: "Sunny" }),
        status: "completed",
        created_by: "system",
      },
    ],
    parallel_tool_calls: true,
    temperature: null,
    top_p: null,
    status: "completed",
    error: null,
  } satisfies OpenAIResponse,
  expected: {
    id: "resp_03",
    createdAt: 1720000000,
    status: "completed",
    model: "gpt-4o",
    messages: [
      {
        role: "assistant",
        content: [
          { type: "text", text: "Sure, let me check" },
          {
            id: "fc_01",
            type: "tool-call",
            toolCallId: "tc_01",
            name: "get_wheather",
            arguments: { city: "dakar" },
          },
        ],
      },
      {
        role: "tool",
        content: [{
          id: "fc_output_1",
          type: "tool-result",
          toolCallId: "tc_01",
          name: "get_wheather",
          result: { type: "text", value: '{"temperature":"39°C","condition":"Sunny"}' },
        }],
      },
    ],
    error: null,
  } satisfies LLMResponse,
}

export const resp04 = {
  response: {
    id: "resp_04",
    object: "response",
    created_at: 1720000000,
    model: "gpt-4o",
    output: [{
      type: "function_call_output",
      id: "fc_output_1",
      call_id: "tc_01",
      name: "get_wheather",
      output: "Tool crashed",
      status: "failed",
      created_by: "system",
    }],
    parallel_tool_calls: true,
    temperature: null,
    top_p: null,
    status: "completed",
    error: null,
  } satisfies OpenAIResponse,
  expected: {
    id: "resp_04",
    createdAt: 1720000000,
    status: "completed",
    model: "gpt-4o",
    messages: [{
      role: "tool",
      content: [{
        id: "fc_output_1",
        type: "tool-result",
        toolCallId: "tc_01",
        name: "get_wheather",
        result: { type: "error", value: "Tool crashed" },
      }],
    }],
    error: null,
  } satisfies LLMResponse,
}

export const resp05 = {
  response: {
    id: "resp_05",
    object: "response",
    created_at: 1720000000,
    model: "gpt-4o",
    output: [{
      type: "function_call",
      id: "fc_01",
      call_id: "tc_01",
      name: "get_wheather",
      arguments: "{not valid json",
      status: "completed",
    }],
    parallel_tool_calls: true,
    temperature: null,
    top_p: null,
    status: "completed",
    error: null,
  } satisfies OpenAIResponse,
  expectedError: { _tag: "InvalidToolArguments" as const},
}

export const resp06 = {
  response: {
    id: "resp_06",
    object: "response",
    created_at: 1720000000,
    model: "gpt-4o",
    output: [],
    parallel_tool_calls: true,
    temperature: null,
    top_p: null,
    status: "failed",
    error: { code: "rate_limit_exceeded", message: "Slow down" },
  } satisfies OpenAIResponse,
  expectedError: { _tag: "RateLimitExceeded", message: "Slow down" } satisfies AppError,
}

export const resp07 = {
  response: {
    id: "resp_07",
    object: "response",
    created_at: 1720000000,
    model: "gpt-4o",
    output: [],
    parallel_tool_calls: true,
    temperature: null,
    top_p: null,
    status: "completed",
    error: null,
  } satisfies OpenAIResponse,
  expected: {
    id: "resp_07",
    createdAt: 1720000000,
    status: "completed",
    model: "gpt-4o",
    messages: [],
    error: null,
  } satisfies LLMResponse,
}
