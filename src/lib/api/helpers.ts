import { NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * Shared helpers for API route handlers — JSON I/O, error responses,
 * request parsing, and the activity-log + notification side-effects that
 * mirror the old zustand store's behavior on every mutation.
 */

export const dynamic = "force-dynamic";

// ---------- JSON helpers ----------

export function ok(data: unknown, init?: ResponseInit) {
  return Response.json(data, { status: 200, ...init });
}
export function created(data: unknown) {
  return Response.json(data, { status: 201 });
}
export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}
export function unauthorized(message = "Sign in required.") {
  return Response.json({ error: message }, { status: 401 });
}
export function forbidden(message = "You do not have access.") {
  return Response.json({ error: message }, { status: 403 });
}
export function notFound(message = "Not found.") {
  return Response.json({ error: message }, { status: 404 });
}
export function serverError(message = "Server error.") {
  return Response.json({ error: message }, { status: 500 });
}

export async function parseBody<T = unknown>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

// ---------- activity log + notification side-effects ----------

export async function logActivity(input: {
  actor: string;
  action: string;
  module: string;
  target: string;
  description: string;
}): Promise<void> {
  try {
    await db.activityLog.create({ data: input });
  } catch {
    /* never fail a mutation because logging failed */
  }
}

export async function notify(input: {
  type: string;
  title: string;
  message: string;
}): Promise<void> {
  try {
    await db.notification.create({ data: input });
  } catch {
    /* ignore */
  }
}

// ---------- request reference generator ----------

export function newRequestReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return `REQ-${s}`;
}
