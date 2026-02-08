import { createOpenAI } from '@ai-sdk/openai';

import { env } from '@/env';
import { resolveDefaultModel } from '@/lib/ai/nvidia-models';

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1';

let cachedProvider: ReturnType<typeof createOpenAI> | null = null;

function getNvidiaProvider() {
    if (!env.NVIDIA_API_KEY) {
        throw new Error('NVIDIA_API_KEY is required.');
    }

    if (cachedProvider) {
        return cachedProvider;
    }

    cachedProvider = createOpenAI({
        apiKey: env.NVIDIA_API_KEY,
        baseURL: env.NVIDIA_BASE_URL || DEFAULT_BASE_URL,
    });

    return cachedProvider;
}

export function getNvidiaChatModel(model?: string) {
    const provider = getNvidiaProvider();
    return provider.chat(model || resolveDefaultModel());
}

export function getDefaultNvidiaModel() {
    return resolveDefaultModel();
}
