import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { newRequestReference } from "@/lib/request-kinds";
import { error, success } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface QuoteRequestBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  serviceName?: unknown;
  budgetRange?: unknown;
  timeline?: unknown;
  details?: unknown;
}

class FieldValidationError extends Error {}

function requiredString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new FieldValidationError(`"${field}" is required`);
  }
  const result = value.trim();
  if (result.length > maxLength) {
    throw new FieldValidationError(`"${field}" is too long (max ${maxLength} characters)`);
  }
  return result;
}

function optionalString(value: unknown, field: string, maxLength: number): string {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") {
    throw new FieldValidationError(`"${field}" must be a string`);
  }
  const result = value.trim();
  if (result.length > maxLength) {
    throw new FieldValidationError(`"${field}" is too long (max ${maxLength} characters)`);
  }
  return result;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * POST /api/quote-requests
 * Public marketplace quote intake for local/demo or unauthenticated visitors.
 * It persists the same MarketRequest lifecycle record as the authenticated
 * request API, without changing the existing Prisma schema.
 */
export async function POST(request: NextRequest) {
  let body: QuoteRequestBody;
  try {
    body = (await request.json()) as QuoteRequestBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  let name: string;
  let email: string;
  let company: string;
  let phone: string;
  let serviceName: string;
  let budgetRange: string;
  let timeline: string;
  let details: string;

  try {
    name = requiredString(body.name, "name", 160);
    email = requiredString(body.email, "email", 254).toLowerCase();
    if (!EMAIL_RE.test(email)) throw new FieldValidationError("Enter a valid email address");
    company = optionalString(body.company, "company", 160);
    phone = optionalString(body.phone, "phone", 60);
    serviceName = optionalString(body.serviceName, "serviceName", 240) || "Marketplace service";
    budgetRange = optionalString(body.budgetRange, "budgetRange", 120) || "Not specified";
    timeline = optionalString(body.timeline, "timeline", 120) || "Not specified";
    details = requiredString(body.details, "details", 8000);
  } catch (validationError) {
    if (validationError instanceof FieldValidationError) {
      return error(validationError.message, 400);
    }
    return error("Invalid quote request", 400);
  }

  try {
    let buyer = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, company: true, status: true },
    });

    if (!buyer) {
      buyer = await db.user.create({
        data: {
          email,
          passwordHash: await hashPassword(randomUUID()),
          name,
          company,
          phone,
          role: "buyer",
        },
        select: { id: true, name: true, company: true, status: true },
      });
    }

    if (buyer.status === "suspended") {
      return error("This account has been suspended. Contact support.", 403);
    }

    const now = new Date();
    const statusHistory = JSON.stringify([
      {
        status: "open",
        note: "Quote request submitted from marketplace",
        at: now.toISOString(),
        by: buyer.name,
        byId: buyer.id,
      },
    ]);

    const created = await db.marketRequest.create({
      data: {
        reference: newRequestReference(),
        buyerId: buyer.id,
        buyerName: buyer.name,
        buyerCompany: buyer.company || company,
        categoryId: "marketplace-service",
        categoryName: "Marketplace Service",
        title: `${serviceName} — quote request`,
        details,
        budgetRange,
        timeline,
        status: "open",
        kind: "service",
        meta: JSON.stringify({
          source: "buyer-marketplace-quote",
          serviceName,
          contactName: name,
          contactEmail: email,
          company,
          phone,
        }),
        statusHistory,
      },
    });

    return success({ request: created }, 201);
  } catch (databaseError) {
    if (databaseError instanceof Prisma.PrismaClientKnownRequestError) {
      if (databaseError.code === "P2002") {
        return error("A request with this information already exists. Please retry.", 409);
      }
    }
    console.error("[api/quote-requests] POST error:", databaseError);
    return error("Unable to save quote request", 500);
  }
}
