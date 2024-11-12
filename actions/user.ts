'use server';

// import { ObjectId } from 'mongodb';

// import { db } from '@/lib/mongo/client';
// import { generateUUIDv4 } from '@/lib/utils/generateUUID';

// type User = {
//   _id?: ObjectId;
//   userId: string;
//   email: string;
//   name: string | null;
//   avatar: string | null;
//   createdAt: Date;
//   updatedAt: Date;
// };

// export async function getUserByEmail(email: string): Promise<User | null> {
//   try {
//     const database = await db;
//     const collection = database.collection('users');
//     const user = await collection.findOne({ email });
//     return user as User | null;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// export async function getUserById(userId: string): Promise<User | null> {
//   try {
//     const database = await db;
//     const collection = database.collection('users');
//     const user = await collection.findOne({ userId });
//     return user as User | null;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// export async function createUser(data: {
//   email: string;
//   name?: string | null;
//   avatar?: string | null;
// }): Promise<User> {
//   try {
//     const database = await db;
//     const collection = database.collection('users');

//     const now = new Date();
//     const user: User = {
//       userId: generateUUIDv4(),
//       email: data.email,
//       name: data.name || null,
//       avatar: data.avatar || null,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const result = await collection.insertOne(user);
//     return { ...user, _id: result.insertedId };
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

export async function getUser(email?: string, userId?: string) {
  if (!email && !userId) {
    throw new Error('Either email or userId must be provided');
  }

  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL!}/api/users`);
  if (email) {
    url.searchParams.append('email', email);
  }
  if (userId) {
    url.searchParams.append('userId', userId);
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  const user = await response.json().then((data) => data?.data?.user);

  return user;
}

export async function createUser(
  email: string,
  name?: string,
  avatar?: string,
) {
  const user = await getUser(email);
  if (user) {
    return user;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL!}/api/users`,
    {
      method: 'POST',
      body: JSON.stringify({ email, name, avatar }),
    },
  );

  const newUser = await response.json().then((data) => data?.data?.user);
  return newUser;
}
