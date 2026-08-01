import { ModelMessage, streamText, isStepCount } from 'ai';
import * as readline from 'node:readline/promises';
import { google } from '@ai-sdk/google';
import { tools } from '@/tools/tool';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: openrouter("nvidia/nemotron-3-ultra-550b-a55b:free"),
      messages,
      tools,
      stopWhen: isStepCount(30),
      onStepEnd: async ({ toolResults }) => {
        if (toolResults.length) {
          console.log(JSON.stringify(toolResults, null, 2));
        }
      },
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);
