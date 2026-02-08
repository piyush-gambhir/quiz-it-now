import QuizGeneratorPage from '@/components/quiz-generator-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Generate Quiz',
    description:
        'Transform any content into an AI-powered quiz. Paste text, upload files, or provide a link.',
};

export default function Page() {
    return <QuizGeneratorPage />;
}
