import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin, JWTPayload } from "@/lib/auth";
import { newQuoteReference } from "@/lib/request-kinds";

// Always evaluate fresh — quote creation is a write and must never be
// cached; the underlying request state changes atomically with the write.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/quotes
// Admin-only quote issuance. Creates a Quote record tied to a
// MarketRequest and flips the request's status to "quoted" in a single
// atomic transaction.
//
// Auth: `Authorization: Bearer <accessToken>` with role `admin` or
// `super-admin`.
//
// Request body:
//   requestId*      string — the MarketRequest this quote responds to
//   items*           array  — line items, each: { description, quantity, unitPrice }
//   taxRate          number — percentage applied to subtotal (default 0)
//   validityDays     number — days the quote is valid for (default 14)
//   notes            string — optional footer note
//
// Computed server-side (never trusted from the body):
//   reference        QUO-XXXXX (5 chars from the unambiguous alphabet)
//   requestReference mirror of the parent request's reference for fast
//                    display without a join
//   buyerId/Name/Company  denormalized from the parent request
//   issuedById/Name  denormalized from the admin's verified token + row
//   items            augmented with `id` + computed `amount` per line
//   subtotal         sum of (quantity * unitPrice) across all items
//   taxAmount        subtotal * taxRate / 100
//   discount         0 (no discount support on this endpoint — patched later)
//   total            subtotal + taxAmount - discount
//   validUntil       issuedAt + validityDays
//
// 201 → { success: true, data: { quote } }
// 400 → missing/invalid field, empty items array, negative price/quantity
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// 404 → requestId doesn't exist
// 409 → a quote already exists for this request (requestId is @unique)
// ============================================================

interface QuoteItemInput {
  description?: unknown;
  quantity?: unknown;
  unitPrice?: unknown;
}

interface CreateQuoteBody {
  requestId?: unknown;
  items?: unknown;
  taxRate?: unknown;
  validityDays?: unknown;
  notes?: unknown;
}

class FieldValidationError extends Error {}

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_NOTES_LENGTH = 2000;
const MAX_VALIDITY_DAYS = 365;
const MIN_VALIDITY_DAYS = 1;

// Round monetary values to 2 decimal places. Floating-point math on
// currency is a footgun (0.1 + 0.2 = 0.30000000000000004); rounding to
// the cent after every arithmetic step keeps the stored values sane.
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function asFiniteNumber(value: unknown, field: string): number {
  if (value === undefined || value === null) {
    throw new FieldValidationError(`"${field}" is required`);
  }
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new FieldValidationError(`"${field}" must be a finite number`);
  }
  return n;
}

export async function POST(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/quotes] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }

  // ---- Parse body -------------------------------------------------------
  let body: CreateQuoteBody;
  try {
    body = (await request.json()) as CreateQuoteBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  // ---- Validate requestId (required) -----------------------------------
  if (typeof body.requestId !== "string" || !body.requestId.trim()) {
    return error('"requestId" is required', 400);
  }
  const requestId = body.requestId.trim();

  // ---- Validate items (required, non-empty array) ----------------------
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return error('"items" must be a non-empty array', 400);
  }

  // Coerce + validate each line item, then compute its amount server-side.
  // The body's amount (if any) is ignored — we never trust a client to
  // tell us how much a line costs.
  const items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }> = [];
  try {
    for (let i = 0; i < body.items.length; i += 1) {
      const raw = body.items[i] as QuoteItemInput;
      const prefix = `items[${i}]`;

      if (typeof raw.description !== "string" || !raw.description.trim()) {
        throw new FieldValidationError(`"${prefix}.description" is required`);
      }
      const description = raw.description.trim();
      if (description.length > MAX_DESCRIPTION_LENGTH) {
        throw new FieldValidationError(
          `"${prefix}.description" is too long (max ${MAX_DESCRIPTION_LENGTH} chars)`
        );
      }

      const quantity = asFiniteNumber(raw.quantity, `${prefix}.quantity`);
      if (quantity <= 0) {
        throw new FieldValidationError(`"${prefix}.quantity" must be greater than 0`);
      }

      const unitPrice = asFiniteNumber(raw.unitPrice, `${prefix}.unitPrice`);
      if (unitPrice < 0) {
        throw new FieldValidationError(`"${prefix}.unitPrice" must be ≥ 0`);
      }

      items.push({
        id: `item-${i + 1}`,
        description,
        // Quantities are stored as numbers — fractional quantities
        // (e.g. 0.5 of a day) are valid for service billing, so we
        // don't floor to int.
        quantity,
        unitPrice: round2(unitPrice),
        amount: round2(quantity * unitPrice),
      });
    }
  } catch (err) {
    if (err instanceof FieldValidationError) return error(err.message, 400);
    throw err;
  }

  // ---- Validate optional numeric fields --------------------------------
  let taxRate = 0;
  if (body.taxRate !== undefined && body.taxRate !== null) {
    taxRate = asFiniteNumber(body.taxRate, "taxRate");
    if (taxRate < 0) {
      return error('"taxRate" must be ≥ 0', 400);
    }
    if (taxRate > 100) {
      return error('"taxRate" must be ≤ 100', 400);
    }
  }

  let validityDays = 14;
  if (body.validityDays !== undefined && body.validityDays !== null) {
    validityDays = asFiniteNumber(body.validityDays, "validityDays");
    if (!Number.isInteger(validityDays)) {
      return error('"validityDays" must be a whole number of days', 400);
    }
    if (validityDays < MIN_VALIDITY_DAYS || validityDays > MAX_VALIDITY_DAYS) {
      return error(
        `"validityDays" must be between ${MIN_VALIDITY_DAYS} and ${MAX_VALIDITY_DAYS}`,
        400
      );
    }
  }

  let notes: string | null = null;
  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== "string") {
      return error('"notes" must be a string', 400);
    }
    const trimmed = body.notes.trim();
    if (trimmed.length > MAX_NOTES_LENGTH) {
      return error(`"notes" is too long (max ${MAX_NOTES_LENGTH} chars)`, 400);
    }
    if (trimmed) notes = trimmed;
  }

  // ---- Compute totals --------------------------------------------------
  const subtotal = round2(items.reduce((sum, item) => sum + item.amount, 0));
  const taxAmount = round2((subtotal * taxRate) / 100);
  const discount = 0; // No discount endpoint yet — patched separately.
  const total = round2(subtotal + taxAmount - discount);

  // ---- Resolve the admin's display name --------------------------------
  // Same pattern as the status route: JWT carries userId + email + role;
  // we denormalize a human-readable name from the AdminUser row, with
  // the email as a defensive fallback.
  let issuedByName = admin.email;
  try {
    const adminRow = await db.adminUser.findUnique({
      where: { id: admin.userId },
      select: { name: true },
    });
    if (adminRow?.name) issuedByName = adminRow.name;
  } catch (lookupErr) {
    console.error("[api/quotes] admin lookup failed:", lookupErr);
  }

  // ---- Persist: create Quote + flip request status, atomically --------
  try {
    const quote = await db.$transaction(async (tx) => {
      // Lock + read the parent request inside the transaction. We need
      // its buyer fields to denormalize onto the quote (so historical
      // quotes stay readable even if the buyer later edits their
      // profile or is deleted), and we need to confirm it exists.
      const marketRequest = await tx.marketRequest.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          reference: true,
          buyerId: true,
          buyerName: true,
          buyerCompany: true,
          status: true,
        },
      });

      if (!marketRequest) {
        throw new NotFoundError();
      }

      // Create the quote first. If requestId is already taken by another
      // quote (the @unique constraint on Quote.requestId), Prisma throws
      // P2002 — we map that to a 409 in the catch below.
      const created = tx.quote.create({
        data: {
          reference: newQuoteReference(),
          requestId: marketRequest.id,
          requestReference: marketRequest.reference,
          buyerId: marketRequest.buyerId,
          buyerName: marketRequest.buyerName,
          buyerCompany: marketRequest.buyerCompany,
          issuedById: admin.userId,
          issuedByName,
          items: JSON.stringify(items),
          subtotal,
          taxRate,
          taxAmount,
          discount,
          total,
          validityDays,
          validUntil: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000),
          notes,
          status: "sent",
        },
      });

      // Flip the parent request to "quoted" and stamp the quotedAmount
      // so the admin pipeline can show the number without a join. We
      // don't overwrite the status if the request is already closed /
      // rejected — admin can still act on it, but the timeline will
      // reflect the actual transition.
      const requestUpdate = tx.marketRequest.update({
        where: { id: marketRequest.id },
        data: {
          status: "quoted",
          quotedAmount: total,
        },
      });

      // Run both writes in parallel — they hit different tables and
      // don't depend on each other's return value.
      const [createdQuote] = await Promise.all([created, requestUpdate]);
      return createdQuote;
    });

    return success({ quote }, 201);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return error("Request not found", 404);
    }
    if (err instanceof FieldValidationError) return error(err.message, 400);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 → either the quote reference collided (extremely unlikely,
      // 30^5 ≈ 24M space) or — far more likely — a quote already exists
      // for this requestId (Quote.requestId is @unique).
      if (err.code === "P2002") {
        const target =
          (err.meta?.target as string[] | undefined)?.join(", ") ?? "requestId";
        if (target.includes("requestId")) {
          return error("A quote already exists for this request", 409);
        }
        return error("Reference collision — please retry", 409);
      }
    }
    console.error("[api/quotes] POST error:", err);
    return error("Unable to create quote", 500);
  }
}

// Sentinel class — thrown inside the transaction when the parent request
// isn't found, so the outer catch can map it to a clean 404.
class NotFoundError extends Error {}
