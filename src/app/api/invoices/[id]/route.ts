import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — a single invoice's status / payment linkage
// can change at any time; never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/invoices/[id]
// Fetches a single invoice by ID with full detail (linked order,
// linked request, linked quote, buyer fields, transaction history).
//
// Auth: the authenticated buyer may only fetch their own invoices. An
// admin (role `admin` or `super-admin`) may fetch any invoice — used by
// the admin dashboard's detail view.
//
// 200 → { success: true, data: { invoice } }
// 401 → no/invalid bearer token
// 403 → invoice exists but doesn't belong to the authenticated buyer
//       (and the caller isn't an admin)
// 404 → no invoice with that id
// ============================================================

const ADMIN_ROLES = new Set(["admin", "super-admin"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/invoices/[id]] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  try {
    // ---- Route param ---------------------------------------------------
    // Next.js 16: dynamic segment params are async and arrive as a Promise.
    const { id } = await params;
    if (!id) return error("Invoice id is required", 400);

    // ---- Lookup --------------------------------------------------------
    // Eagerly load the linked order + request + quote + transactions so
    // the buyer dashboard can render the invoice detail view (with the
    // originating order's status, the source quote's items, and the full
    // payment history) in a single round-trip.
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            serviceName: true,
            serviceSlug: true,
            status: true,
            amount: true,
            deliveryType: true,
            placedAt: true,
          },
        },
        request: {
          select: {
            id: true,
            reference: true,
            title: true,
            status: true,
          },
        },
        quote: {
          select: {
            id: true,
            reference: true,
            status: true,
          },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            reference: true,
            type: true,
            amount: true,
            method: true,
            status: true,
            gatewayReference: true,
            createdAt: true,
          },
        },
      },
    });

    if (!invoice) {
      return error("Invoice not found", 404);
    }

    // ---- Ownership / admin check --------------------------------------
    // A buyer may only see their own invoice. An admin may see any
    // invoice. We return 403 (not 404) when the invoice exists but
    // isn't theirs — the spec asks for that explicit signal so the
    // buyer UI can show a "Forbidden" message rather than a misleading
    // "Not Found".
    if (invoice.buyerId !== user.userId && !ADMIN_ROLES.has(user.role)) {
      return error("Forbidden", 403);
    }

    return success({ invoice });
  } catch (err) {
    console.error("[api/invoices/[id]] error:", err);
    return error("Unable to load invoice", 500);
  }
}
