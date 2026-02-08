import { env } from '@/env';

export type NvidiaModelOption = {
    id: string;
    label: string;
};

export const DEFAULT_OPEN_SOURCE_MODELS: NvidiaModelOption[] = [
    {
        id: 'meta/llama-3.1-70b-instruct',
        label: 'Llama 3.1 70B Instruct (Meta)',
    },
    {
        id: 'meta/llama-3.1-8b-instruct',
        label: 'Llama 3.1 8B Instruct (Meta)',
    },
    {
        id: 'meta/llama-3.3-70b-instruct',
        label: 'Llama 3.3 70B Instruct (Meta)',
    },
    {
        id: 'mistralai/mistral-7b-instruct-v0.3',
        label: 'Mistral 7B Instruct v0.3',
    },
    {
        id: 'google/gemma-2-9b-it',
        label: 'Gemma 2 9B IT (Google)',
    },
    {
        id: 'qwen/qwen2.5-7b-instruct',
        label: 'Qwen 2.5 7B Instruct',
    },
    {
        id: 'nvidia/nemotron-mini-4b-instruct',
        label: 'Nemotron Mini 4B Instruct (NVIDIA)',
    },
];

const OPEN_SOURCE_MODEL_IDS = new Set(DEFAULT_OPEN_SOURCE_MODELS.map((m) => m.id));

export function resolveDefaultModel() {
    return env.NVIDIA_MODEL || DEFAULT_OPEN_SOURCE_MODELS[0].id;
}

function modelLabelFromId(modelId: string) {
    const curatedMatch = DEFAULT_OPEN_SOURCE_MODELS.find((m) => m.id === modelId);
    if (curatedMatch) {
        return curatedMatch.label;
    }

    const parts = modelId.split('/');
    return parts.length === 2 ? `${parts[1]} (${parts[0]})` : modelId;
}

function parseCustomModels(value?: string) {
    if (!value) {
        return [];
    }

    return value
        .split(',')
        .map((model) => model.trim())
        .filter(Boolean)
        .map((id) => ({ id, label: modelLabelFromId(id) }));
}

export async function fetchNvidiaOpenSourceModels() {
    const customModels = parseCustomModels(env.NVIDIA_MODELS);
    if (customModels.length > 0) {
        return customModels;
    }

    if (!env.NVIDIA_API_KEY) {
        return DEFAULT_OPEN_SOURCE_MODELS;
    }

    try {
        const response = await fetch(
            `${env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'}/models`,
            {
                headers: {
                    Authorization: `Bearer ${env.NVIDIA_API_KEY}`,
                },
                cache: 'no-store',
            },
        );

        if (!response.ok) {
            return DEFAULT_OPEN_SOURCE_MODELS;
        }

        const payload = (await response.json()) as {
            data?: Array<{ id?: string }>;
        };

        const availableIds = new Set(
            (payload.data || [])
                .map((model) => model.id)
                .filter((id): id is string => Boolean(id)),
        );

        const models = DEFAULT_OPEN_SOURCE_MODELS.filter((model) =>
            availableIds.has(model.id),
        );

        if (models.length > 0) {
            return models;
        }

        // Fallback: allow any open-source looking instruct model from the account.
        const dynamicModels = [...availableIds]
            .filter(
                (id) =>
                    id.includes('/') &&
                    (id.includes('instruct') || id.includes('-it')) &&
                    !id.startsWith('openai/') &&
                    !id.startsWith('writer/') &&
                    !id.startsWith('ai21labs/'),
            )
            .slice(0, 15)
            .map((id) => ({ id, label: modelLabelFromId(id) }));

        return dynamicModels.length > 0 ? dynamicModels : DEFAULT_OPEN_SOURCE_MODELS;
    } catch {
        return DEFAULT_OPEN_SOURCE_MODELS;
    }
}

export function isSupportedOpenSourceModel(modelId: string) {
    return OPEN_SOURCE_MODEL_IDS.has(modelId);
}
