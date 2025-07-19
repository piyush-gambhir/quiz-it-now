import OpenAI from 'openai';

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
    if (!openai) {
        const nvidiaApiKey = process.env.NVIDIA_API_KEY;
        if (!nvidiaApiKey) {
            throw new Error('NVIDIA_API_KEY environment variable is required');
        }

        openai = new OpenAI({
            apiKey: nvidiaApiKey,
            baseURL: 'https://integrate.api.nvidia.com/v1',
        });
    }
    return openai;
}

// Define the message type for the chat completion
export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

// Define the options type for the helper function
export type CompletionOptions = {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
};

/**
 * Helper function to get a chat completion response.
 * @param model - The model to use for the completion.
 * @param messages - An array of message objects for the chat.
 * @param options - Optional parameters for temperature, top_p, max_tokens, etc.
 * @returns An async generator yielding chunks of response text.
 */
export async function* getChatCompletion(
    model: string,
    messages: ChatMessage[],
    options: CompletionOptions = {},
): AsyncGenerator<string> {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
        model,
        messages,
        stream: true,
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 1,
        max_tokens: options.max_tokens ?? 4096,
    });

    for await (const chunk of completion) {
        yield chunk.choices[0]?.delta?.content || '';
    }
}
