let PrismaClient: any = null;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch {
  console.log('@prisma/client not available');
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

function createPrismaClient() {
  if (!PrismaClient || !process.env.DATABASE_URL) {
    return null;
  }
  try {
    return new PrismaClient();
  } catch {
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma;

export default prisma;
