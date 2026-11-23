import { PrismaClient } from "@prisma/client";

// ============================================================
// PRODUCTION DATABASE CLIENT
// ============================================================
// Singleton pattern — prevents connection pool exhaustion when
// Next.js hot-reloads in dev or when serverless functions reuse
// the same PrismaClient instance across requests.
//
// For 200K users:
//   - Prisma's default pool size is 10 (num_cpus * 2 + 1)
//   - For PostgreSQL production, set the pool size via:
//     DATABASE_URL=postgresql://...?connection_limit=20
//   - Use PgBouncer for connection pooling at the DB level
//   - Consider Prisma Data Proxy / Accelerate for serverless
// ============================================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
