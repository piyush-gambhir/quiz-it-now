import { env } from '@/env';

export async function query(fileUrl: string) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
    {
      headers: {
        Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`,
      },
      method: 'POST',
      body: {
        inputs: {
          audio: {
            url: fileUrl,
          },
        },
      },
    },
  );
  const result = await response.json();
  return result;
}
