import { Quiz } from '@/lib/models';
import { connectToDatabase } from '@/lib/mongo/client';
import {
    createErrorResponse,
    createSuccessResponse,
    toNextResponse,
} from '@/lib/utils/api-response';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ quizId: string }> },
) {
    try {
        const { quizId } = await params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!quizId) {
            return toNextResponse(
                createErrorResponse('quizId parameter is required.', 400),
            );
        }

        if (!userId) {
            return toNextResponse(
                createErrorResponse('userId parameter is required.', 400),
            );
        }

        await connectToDatabase();

        const quiz = await Quiz.findOne({ quizId, userId }).lean();

        if (!quiz) {
            return toNextResponse(createErrorResponse('Quiz not found.', 404));
        }

        return toNextResponse(
            createSuccessResponse('Quiz fetched successfully.', quiz),
        );
    } catch (error) {
        return toNextResponse(
            createErrorResponse(
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch quiz.',
                500,
            ),
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ quizId: string }> },
) {
    try {
        const { quizId } = await params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!quizId) {
            return toNextResponse(
                createErrorResponse('quizId parameter is required.', 400),
            );
        }

        if (!userId) {
            return toNextResponse(
                createErrorResponse('userId parameter is required.', 400),
            );
        }

        await connectToDatabase();

        const deleted = await Quiz.findOneAndDelete({ quizId, userId });

        if (!deleted) {
            return toNextResponse(
                createErrorResponse('Quiz not found or already deleted.', 404),
            );
        }

        return toNextResponse(
            createSuccessResponse('Quiz deleted successfully.', {
                quizId,
            }),
        );
    } catch (error) {
        return toNextResponse(
            createErrorResponse(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete quiz.',
                500,
            ),
        );
    }
}
