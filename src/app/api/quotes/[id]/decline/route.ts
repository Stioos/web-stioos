import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — accept/decline mutations change server state and
// must never be cached.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/quotes/[id]/decline
// Buyer declines a quote. Sets quote.status = "declined", records the
// optional reason + declinedAt timestamp, and flips the parent
// MarketRequest.status to "rejected" — both inside a single transaction.
//
// Auth: `Authorization: Bearer <accessToken>`. The quote must belong to
// the authenticated buyer (quote.buyerId === user.userId). Admins do NOT
// bypass this gate — declining a quote is a buyer-side commercial action.
//
// Request body (all optional):
//   reason   string — free-text explanation captured on the quote record
//                    and on the request's statusHistory event. Max 1000
//                    chars. Whitespace-only is treated as absent.
//
// 200 → { success: true, data: { quote } }
// 400 → reason present but not a string / too long
// 401 → no/invalid bearer token
// 403 → quote exists but doesn't belong to the authenticated buyer
// 404 → no quote with that id
// 409 → quote isn't in a declinable state (already accepted / declined /
//       expired / draft)
// ============================================================

const MAX_REASON_LENGTH = 1000;

interface DeclineBody {
  reason?: unknown;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/quotes/[id]/decline] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  // ---- Route param (parsed before the body so a missing id 400s even
  // when the body is malformed) ------------------------------------------
  let id: string;
  try {
    ({ id } = await params);
  } catch {
    return error("Quote id is required", 400);
  }
  if (!id) return error("Quote id is required", 400);

  // ---- Parse body (optional) -------------------------------------------
  // Unlike accept, decline carries an optional `reason`. We still allow
  // an empty body so a caller can decline without giving a reason.
  let reason: string | null = null;
  try {
    const raw = (await request.json()) as DeclineBody;
    if (raw && raw.reason !== undefined && raw.reason !== null) {
      if (typeof raw.reason !== "string") {
        return error('"reason" must be a string', 400);
      }
      const trimmed = raw.reason.trim();
      if (trimmed.length > MAX_REASON_LENGTH) {
        return error(`"reason" is too long (max ${MAX_REASON_LENGTH} chars)`, 400);
      }
      if (trimmed) reason = trimmed;
    }
  } catch {
    // Body wasn't valid JSON or was empty — that's fine for decline,
    // `reason` just stays null.
  }

  try {
    // ---- Read-modify-write inside a transaction ------------------------
    const updated = await db.$transaction(async (tx) => {
      const quote = await tx.quote.findUnique({
        where: { id },
        select: {
          id: true,
          buyerId: true,
          status: true,
          requestId: true,
        },
      });

      if (!quote) {
        throw new NotFoundError();
      }

      // ---- Ownership gate --------------------------------------------
      // Only the buyer who owns the quote (i.e. the buyer who filed the
      // parent request) can decline it. Admins can't decline on a
      // buyer's behalf — they reject via the status PATCH endpoint
      // instead, which records a different event on the timeline.
      if (quote.buyerId !== user.userId) {
        throw new ForbiddenError();
      }

      // ---- State guard -----------------------------------------------
      // Only a quote in "sent" state can be declined. Declining an
      // already-accepted quote would be a contradictory commercial
      // action — surface a 409 with the current status so the buyer UI
      // can show an accurate message.
      if (quote.status !== "sent") {
        throw new StateConflictError(
          `Quote cannot be declined from status "${quote.status}"`
        );
      }

      const now = new Date();

      const declinedQuote = await tx.quote.update({
        where: { id: quote.id },
        data: {
          status: "declined",
          declineReason: reason,
          declinedAt: now,
        },
      });

      // Flip the parent request to "rejected" and append a timeline
      // event capturing the buyer's reason (if any). Read-modify-write
      // inside the same transaction so it's atomic with the quote update.
      const parentRequest = await tx.marketRequest.findUnique({
        where: { id: quote.requestId },
        select: { id: true, statusHistory: true },
      });

      if (parentRequest) {
        let history: unknown[] = [];
        try {
          const parsed = JSON.parse(parentRequest.statusHistory || "[]");
          if (Array.isArray(parsed)) history = parsed;
        } catch {
          history = [];
        }

        const event = {
          status: "rejected",
          note: reason ? `Quote declined by buyer: ${reason}` : "Quote declined by buyer",
          at: now.toISOString(),
          by: "buyer",
          byId: user.userId,
        };

        await tx.marketRequest.update({
          where: { id: parentRequest.id },
          data: {
            status: "rejected",
            declineReason: reason,
            statusHistory: JSON.stringify([...history, event]),
          },
        });
      }

      return declinedQuote;
    });

    return success({ quote: updated });
  } catch (err) {
    if (err instanceof NotFoundError) return error("Quote not found", 404);
    if (err instanceof ForbiddenError) return error("Forbidden", 403);
    if (err instanceof StateConflictError) return error(err.message, 409);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return error("Quote not found", 404);
    }
    console.error("[api/quotes/[id]/decline] error:", err);
    return error("Unable to decline quote", 500);
  }
}

// Sentinel classes — thrown inside the transaction so the outer catch can
// map each failure to its correct HTTP status without tripping the generic
// 500 path.
class NotFoundError extends Error {}
class ForbiddenError extends Error {}
class StateConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}
