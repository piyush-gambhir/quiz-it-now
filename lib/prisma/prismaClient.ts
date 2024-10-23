import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

let prisma: PrismaClient;

const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

if (process.env.ENVIRONMENT === 'production') {
  prisma = createPrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = createPrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;