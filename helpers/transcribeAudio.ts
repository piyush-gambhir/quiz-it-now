export interface TranscriptionResponse {
    text: string;
    [key: string]: any;
}

// Define the options type for the helper function
export interface TranscriptionOptions {
    audioUrl: string;
    language?: string;
    task?: string;
}

/**
 * Helper function to transcribe audio using Hugging Face Whisper API with an S3 URL.
 * @param options - The options for the transcription request.
 * @returns A Promise resolving to the transcription response from the Whisper model.
 */
export async function transcribeAudio(
    options: TranscriptionOptions,
): Promise<TranscriptionResponse> {
    // Set up the request headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    };

    try {
        // Make the API request
        const response = await fetch(
            `https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    url: options.audioUrl,
                }),
            },
        );

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} - ${response.statusText}`,
            );
        }

        // Parse the JSON response
        const result: TranscriptionResponse = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to transcribe audio:', error);
        throw error;
    }
}
