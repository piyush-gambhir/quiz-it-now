// import { env } from '@/env';
import { Db, MongoClient } from 'mongodb';

// Type definitions for environment variables
const uri: string = process.env.MONGODB_URI as string; // MongoDB connection string
const dbName: string = process.env.MONGODB_DB as string; // Database name

if (!uri || !dbName) {
  throw new Error(
    'Please define the MONGODB_URI and MONGODB_DB environment variables inside .env',
  );
}

// Define cached client and database types
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Function to connect to the database
export async function connectToDatabase(): Promise<Db> {
  // Check if the connection is already cached
  if (cachedDb) {
    return cachedDb;
  }

  // Create a new MongoDB client and connect
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  // Cache the database connection and client
  cachedClient = client;
  cachedDb = db;

  return db;
}

// Directly export the database connection (as a promise)
export const db: Promise<Db> = connectToDatabase();
