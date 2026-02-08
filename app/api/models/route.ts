import {
    fetchNvidiaOpenSourceModels,
    resolveDefaultModel,
} from '@/lib/ai/nvidia-models';
import {
    createSuccessResponse,
    toNextResponse,
} from '@/lib/utils/api-response';

export async function GET() {
    const models = await fetchNvidiaOpenSourceModels();
    const defaultModel = resolveDefaultModel();

    return toNextResponse(
        createSuccessResponse('Available models fetched successfully.', {
            models: models.map((model) => ({
                model: model.id,
                name: model.label,
            })),
            defaultModel,
        }),
    );
}
