import { HfInference } from '@huggingface/inference';

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function query(input: string) {
    const result = await inference.textClassification({
        model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        inputs: input,
    });

    return result;
}
