import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — admin mutations must never be served from cache.
export const dynamic = "force-dynamic";

// ============================================================
// PATCH /api/requests/[id]/status
// Admin-only status update. Appends a new event to the request's
// statusHistory JSON column and sets the request's `status` field.
//
// Auth: `Authorization: Bearer <accessToken>` with role `admin` or
// `super-admin`.
//
// Request body:
//   status*  string — one of the allowed MarketRequest status values
//   note     string — optional free-text annotation shown in the timeline
//
// The statusHistory array is read, parsed, appended to, and re-stringified
// — Prisma's SQLite connector can't atomically push to a JSON column, so
// we do a read-modify-write inside a transaction to avoid losing events
// when two admins act on the same request concurrently.
//
// 200 → { success: true, data: { request } }
// 400 → missing/invalid status, malformed body
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// 404 → request id not found  (Prisma P2025)
// ============================================================

interface UpdateStatusBody {
  status?: unknown;
  note?: unknown;
}

class FieldValidationError extends Error {}

const VALID_STATUSES = new Set([
  "open",
  "in_review",
  "quoted",
  "approved",
  "ordered",
  "paid",
  "delivered",
  "closed",
  "rejected",
]);

const MAX_NOTE_LENGTH = 1000;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/requests/[id]/status] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }

  try {
    // ---- Route param ---------------------------------------------------
    const { id } = await params;
    if (!id) return error("Request id is required", 400);

    // ---- Parse body ----------------------------------------------------
    let body: UpdateStatusBody;
    try {
      body = (await request.json()) as UpdateStatusBody;
    } catch {
      return error("Invalid JSON body", 400);
    }

    // ---- Validate status (required) -----------------------------------
    if (typeof body.status !== "string" || !body.status.trim()) {
      return error('"status" is required', 400);
    }
    const nextStatus = body.status.trim();
    if (!VALID_STATUSES.has(nextStatus)) {
      return error(
        `"status" must be one of: ${Array.from(VALID_STATUSES).join(", ")}`,
        400
      );
    }

    // ---- Validate note (optional) -------------------------------------
    let note: string | null = null;
    if (body.note !== undefined && body.note !== null) {
      if (typeof body.note !== "string") {
        return error('"note" must be a string', 400);
      }
      const trimmed = body.note.trim();
      if (trimmed.length > MAX_NOTE_LENGTH) {
        return error(`"note" is too long (max ${MAX_NOTE_LENGTH} chars)`, 400);
      }
      // Preserve a non-empty note; treat an empty/whitespace-only note as
      // absent so the timeline event stays clean.
      if (trimmed) note = trimmed;
    }

    // ---- Resolve the admin's display name ------------------------------
    // The JWT carries userId + email + role but not the display name —
    // denormalize it from the AdminUser row so the timeline `by` field
    // is human-readable. Fall back to the email if the admin row isn't
    // found (defensive — shouldn't happen, but shouldn't block the
    // status update either).
    let issuedByName = admin.email;
    try {
      const adminRow = await db.adminUser.findUnique({
        where: { id: admin.userId },
        select: { name: true },
      });
      if (adminRow?.name) issuedByName = adminRow.name;
    } catch (lookupErr) {
      console.error("[api/requests/[id]/status] admin lookup failed:", lookupErr);
    }

    // ---- Read-modify-write the statusHistory inside a transaction ------
    // Without a transaction, two concurrent PATCH calls could both read
    // the same history array, both append, and the second write would
    // clobber the first event. Wrapping in $transaction serializes the
    // read + write so both events survive.
    const updated = await db.$transaction(async (tx) => {
      const existing = await tx.marketRequest.findUnique({
        where: { id },
        select: { id: true, statusHistory: true },
      });

      if (!existing) {
        // Throw a sentinel the outer catch can map to 404 without
        // tripping the generic 500 path.
        throw new NotFoundError();
      }

      // Parse the existing history defensively — if it's somehow
      // malformed (corrupt row, manual edit), start from an empty array
      // rather than crashing the whole update.
      let history: unknown[] = [];
      try {
        const parsed = JSON.parse(existing.statusHistory || "[]");
        if (Array.isArray(parsed)) history = parsed;
      } catch {
        history = [];
      }

      const event = {
        status: nextStatus,
        note: note ?? undefined,
        at: new Date().toISOString(),
        by: issuedByName,
        byId: admin.userId,
      };

      const nextHistory = JSON.stringify([...history, event]);

      return tx.marketRequest.update({
        where: { id },
        data: {
          status: nextStatus,
          statusHistory: nextHistory,
        },
      });
    });

    return success({ request: updated });
  } catch (err) {
    // 404 sentinel thrown inside the transaction.
    if (err instanceof NotFoundError) {
      return error("Request not found", 404);
    }
    // Prisma's own P2025 (record not found) — covers the unlikely case
    // where the request is deleted between the findUnique and the update.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return error("Request not found", 404);
    }
    if (err instanceof FieldValidationError) return error(err.message, 400);
    console.error("[api/requests/[id]/status] error:", err);
    return error("Unable to update request status", 500);
  }
}

// Sentinel class — thrown inside the transaction to short-circuit the
// read-modify-write when the request doesn't exist. Distinguished from
// a real Prisma error so the outer catch can map it to a 404 cleanly.
class NotFoundError extends Error {}
