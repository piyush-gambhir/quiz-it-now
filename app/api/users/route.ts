import { auth } from '@/auth';

import { ObjectId } from 'mongodb';

import { db } from '@/lib/mongo/client';
import { generateUUIDv4 } from '@/lib/utils/generateUUID';

export async function GET(request: Request) {
  try {
    // const session = await auth();
    // if (!session) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       statusCode: 401,
    //       message: 'Unauthorized',
    //       data: null,
    //       error: {
    //         code: 401,
    //         message: 'Authentication required',
    //       },
    //     }),
    //     {
    //       status: 401,
    //       headers: { 'Content-Type': 'application/json' },
    //     },
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    const database = await db;
    const collection = database.collection('users');

    let user = null;
    if (email) {
      user = await collection.findOne({ email });
    } else if (userId) {
      user = await collection.findOne({ userId });
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
    const { email, name, avatar } = body;

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

    const database = await db;
    const collection = database.collection('users');

    const existingUser = await collection.findOne({ email });
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

    const now = new Date();
    const user = {
      userId: generateUUIDv4(),
      email,
      name: name || null,
      avatar: avatar || null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(user);
    const createdUser = { ...user, _id: result.insertedId };

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
