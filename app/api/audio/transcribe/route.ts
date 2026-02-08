import { transcribeWithOpenAI } from '@/lib/ai/audio-transcription';
import logger from '@/lib/logger/winston';
import {
    createErrorResponse,
    createSuccessResponse,
    toNextResponse,
} from '@/lib/utils/api-response';

export async function POST(request: Request) {
    try {
        logger.info('Received audio transcription request');

        const formData = await request.formData();
        const audioFile = formData.get('file') as File;

        if (!audioFile) {
            logger.error('No audio file provided');
            return toNextResponse(
                createErrorResponse('No audio file provided', 400),
            );
        }

        logger.info(`Transcribing audio file: ${audioFile.name}`);

        // Use OpenAI Whisper API for transcription
        // Make sure OPENAI_API_KEY is set in environment variables
        const transcription = await transcribeWithOpenAI(audioFile);

        logger.info('Audio transcribed successfully');

        return toNextResponse(
            createSuccessResponse('Audio transcribed successfully', {
                transcription,
            }),
        );
    } catch (error) {
        logger.error(`Error transcribing audio: ${error}`);

        let errorMessage = 'Error transcribing audio';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return toNextResponse(createErrorResponse(errorMessage, 500));
    }
}
