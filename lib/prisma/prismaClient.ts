import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Helper function to create a PrismaClient
const createPrismaClient = (): PrismaClient => {
  // Cast the extended client back to PrismaClient type
  return new PrismaClient().$extends(withAccelerate()) as PrismaClient;
};

let prisma: PrismaClient;

if (process.env.ENVIRONMENT === 'production') {
  prisma = createPrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = createPrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
