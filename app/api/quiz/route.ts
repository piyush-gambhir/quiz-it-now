import { Quiz } from '@/lib/models';
import { connectToDatabase } from '@/lib/mongo/client';
import {
    createErrorResponse,
    createSuccessResponse,
    toNextResponse,
} from '@/lib/utils/api-response';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const rawPage = Number.parseInt(url.searchParams.get('page') || '1', 10);
        const rawLimit = Number.parseInt(
            url.searchParams.get('limit') || '10',
            10,
        );

        if (!userId) {
            return toNextResponse(
                createErrorResponse('userId parameter is required.', 400),
            );
        }

        const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
        const limit =
            Number.isFinite(rawLimit) && rawLimit > 0
                ? Math.min(rawLimit, 50)
                : 10;
        const skip = (page - 1) * limit;

        await connectToDatabase();

        const [totalQuizzes, userQuizzes] = await Promise.all([
            Quiz.countDocuments({ userId }),
            Quiz.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        ]);

        return toNextResponse(
            createSuccessResponse('Quizzes fetched successfully.', {
                quizzes: userQuizzes,
                totalQuizzes,
                currentPage: page,
                totalPages: Math.ceil(totalQuizzes / limit),
            }),
        );
    } catch (error) {
        return toNextResponse(
            createErrorResponse(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.',
                500,
            ),
        );
    }
}
