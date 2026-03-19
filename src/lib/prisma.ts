import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("[prisma] TURSO_DATABASE_URL:", url ? `${url.substring(0, 30)}...` : "NOT SET");
  console.log("[prisma] TURSO_AUTH_TOKEN:", authToken ? "SET" : "NOT SET");

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
