import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentBuyer } from "@/lib/auth-server";
import {
  badRequest,
  notFound,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/threads/[id]/messages — buyer sends a message in their own thread.
 * Body: { body }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized("Sign in to send messages.");
  const { id } = await params;
  const body = await parseBody<{ body?: string }>(req);
  if (!body?.body) return badRequest("body is required.");
  const text = String(body.body).trim();
  if (!text) return badRequest("Message cannot be empty.");

  const thread = await db.marketThread.findUnique({ where: { id } });
  if (!thread) return notFound("Conversation not found.");
  if (thread.buyerId !== buyer.id)
    return badRequest("You can only message in your own conversations.");

  const now = new Date();
  const message = await db.marketMessage.create({
    data: {
      threadId: id,
      senderId: buyer.id,
      senderName: buyer.name,
      senderRole: "buyer",
      body: text,
      sentAt: now,
    },
  });
  await db.marketThread.update({
    where: { id },
    data: { lastMessageAt: now },
  });
  return ok({ ok: true, message: { id: message.id, sentAt: message.sentAt.toISOString() } });
}
