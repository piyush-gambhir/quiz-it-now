import { HfInference } from '@huggingface/inference';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CompletionOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export async function* getChatCompletion(
  model: string,
  messages: ChatMessage[],
  options: CompletionOptions = {},
) {
  let modelResponse = '';
  const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

  const inferenceResponse = inference.chatCompletionStream({
    model: model,
    messages: messages,
    max_tokens: options.max_tokens ?? 2048,
    temperature: options.temperature ?? 0.7,
    top_p: options.top_p ?? 0.95,
  });

  for await (const chunk of inferenceResponse) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      modelResponse += newContent;
    }
  }

  return modelResponse;
}
