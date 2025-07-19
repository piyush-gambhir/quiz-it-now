export async function query(input: object) {
    const response = await fetch(
        'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B',
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(input),
        },
    );
    const result = await response.json();
    return result;
}
