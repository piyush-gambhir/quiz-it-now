import { User } from '@/lib/models';
import { connectToDatabase } from '@/lib/mongo/client';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const userId = searchParams.get('userId');

        await connectToDatabase();

        let user = null;
        if (email) {
            user = await User.findOne({ email }).lean();
        } else if (userId) {
            user = await User.findById(userId).lean();
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    statusCode: 400,
                    message: 'Bad Request',
                    data: null,
                    error: {
                        code: 400,
                        message: 'Either email or userId is required',
                    },
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    statusCode: 404,
                    message: 'User not found',
                    data: null,
                    error: {
                        code: 404,
                        message: 'No user found with the provided criteria',
                    },
                }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                statusCode: 200,
                message: 'User fetched successfully',
                data: {
                    user,
                },
                error: {
                    code: null,
                    message: null,
                },
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new Response(
            JSON.stringify({
                success: false,
                statusCode: 500,
                message: 'Internal Server Error',
                data: null,
                error: {
                    code: 500,
                    message: errorMessage,
                },
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, image } = body;

        if (!email) {
            return new Response(
                JSON.stringify({
                    success: false,
                    statusCode: 400,
                    message: 'Bad Request',
                    data: null,
                    error: {
                        code: 400,
                        message: 'Email is required',
                    },
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    statusCode: 409,
                    message: 'Conflict',
                    data: null,
                    error: {
                        code: 409,
                        message: 'User with this email already exists',
                    },
                }),
                {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const createdUser = await User.create({
            email,
            name: name || undefined,
            image: image || undefined,
        });

        return new Response(
            JSON.stringify({
                success: true,
                statusCode: 201,
                message: 'User created successfully',
                data: {
                    user: createdUser,
                },
                error: {
                    code: null,
                    message: null,
                },
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new Response(
            JSON.stringify({
                success: false,
                statusCode: 500,
                message: 'Internal Server Error',
                data: null,
                error: {
                    code: 500,
                    message: errorMessage,
                },
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
