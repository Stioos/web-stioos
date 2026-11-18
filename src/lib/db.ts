import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 * In dev, Next.js reloads modules on HMR which would otherwise leak
 * PrismaClient instances (each holds a connection pool). We stash the
 * instance on globalThis so it survives HMR.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
