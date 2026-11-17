"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Loader2, MessageSquare, SendHorizonal } from "lucide-react";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EmptyState, timeAgo } from "@/components/dashboard/shared";
import { useToast } from "@/hooks/use-toast";
import type { MarketMessage, MarketThread } from "@/types";

export interface MessagesViewProps {
  threads: MarketThread[];
  buyerId: string;
}

/**
 * Two-pane messaging view used by the buyer dashboard. Thread list on the
 * left, chat pane on the right; on mobile the panes switch via the
 * selected-thread state.
 *
 * The server fetches `listBuyerThreads(buyerId)` once per render and
 * passes the result as `threads`. Sending a message POSTs to
 * `/api/threads/[id]/messages`, then calls `router.refresh()` so the
 * server query re-runs and the thread's messages list is updated.
 *
 * Pending messages are appended optimistically to the visible list and
 * removed from the local `pending` array as soon as the server prop
 * catches up — the memo filters them out by body+sentAt, so no effect
 * is needed for reconciliation (avoids cascading renders).
 */
export function MessagesView({ threads, buyerId }: MessagesViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState<MarketMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Threads come sorted by the server (lastMessageAt desc).
  const myThreads = useMemo(() => threads, [threads]);
  const activeThread = myThreads.find((t) => t.id === selectedId) ?? null;

  // Merge server messages with any local pending messages for the active
  // thread that the server hasn't yet persisted (matched on body+sentAt).
  // Once `router.refresh()` delivers the server's authoritative copy, the
  // pending entry is dropped from the visible list — no effect required.
  const visibleMessages = useMemo(() => {
    if (!activeThread) return [];
    const serverKeys = new Set(
      activeThread.messages.map((m) => `${m.body}|${m.sentAt}`)
    );
    const local = pending.filter(
      (m) =>
        m.threadId === activeThread.id &&
        !serverKeys.has(`${m.body}|${m.sentAt}`)
    );
    return [...activeThread.messages, ...local];
  }, [activeThread, pending]);

  // Auto-scroll to the latest message whenever the count changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleMessages.length, selectedId]);

  if (myThreads.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Messages</h1>
          <p className="text-sm text-slate-400">
            Conversations with our delivery teams live here.
          </p>
        </header>
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Message our team from any service page and the conversation will appear here."
          action={
            <Button asChild variant="outline">
              <Link href="/marketplace">Browse the marketplace</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const counterpartOf = (thread: MarketThread) => thread.teamName;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !draft.trim() || sending) return;
    const body = draft.trim();
    const nowIso = new Date().toISOString();
    const tempId = `local-${Date.now()}`;
    // Optimistic: append a local copy so the buyer sees their message
    // immediately. Cleared from the visible list once the server prop
    // includes the matching body+sentAt.
    const tempMessage: MarketMessage = {
      id: tempId,
      threadId: activeThread.id,
      senderId: buyerId,
      senderName: "You",
      senderRole: "buyer",
      body,
      sentAt: nowIso,
    };
    setPending((prev) => [...prev, tempMessage]);
    setDraft("");
    setSending(true);
    try {
      const res = await fetch(`/api/threads/${activeThread.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ body }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok?: true; error?: string }
        | { ok?: false; error?: string };
      if (res.ok && (data as { ok?: boolean }).ok !== false) {
        // Refresh so the server's authoritative copy lands. The memo
        // above will drop the optimistic entry as soon as the new prop
        // matches body+sentAt.
        router.refresh();
        return;
      }
      // Revert the optimistic message on failure.
      setPending((prev) => prev.filter((m) => m.id !== tempId));
      toast({
        title: "Could not send message",
        description: data.error ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } catch {
      setPending((prev) => prev.filter((m) => m.id !== tempId));
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Messages</h1>
        <p className="text-sm text-slate-400">
          {myThreads.length} active {myThreads.length === 1 ? "conversation" : "conversations"}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Thread list */}
        <div
          className={cn(
            "overflow-hidden rounded-xl border bg-card shadow-sm",
            activeThread && "hidden lg:block"
          )}
        >
          <div className="max-h-[560px] overflow-y-auto p-2" role="list" aria-label="Conversations">
            {myThreads.map((thread) => {
              const last = thread.messages[thread.messages.length - 1];
              const active = thread.id === selectedId;
              return (
                <button
                  key={thread.id}
                  type="button"
                  role="listitem"
                  onClick={() => setSelectedId(thread.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "bg-muted" : "hover:bg-muted/60"
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon name={thread.serviceIcon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {thread.serviceName}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(thread.lastMessageAt)}
                      </span>
                    </span>
                    <span className="block truncate text-[11px] font-medium text-muted-foreground">
                      {counterpartOf(thread)}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {last ? last.body : "No messages yet"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat pane */}
        <div
          className={cn(
            "flex min-h-[480px] flex-col overflow-hidden rounded-xl border bg-card shadow-sm",
            !activeThread && "hidden lg:flex"
          )}
        >
          {activeThread ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Back to conversations"
                  onClick={() => setSelectedId(null)}
                  className="h-9 w-9 shrink-0 lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon name={activeThread.serviceIcon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/marketplace/${activeThread.serviceSlug}`}
                    className="block truncate text-sm font-semibold text-foreground hover:underline"
                  >
                    {activeThread.serviceName}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    with {counterpartOf(activeThread)}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto p-4"
                aria-live="polite"
                aria-label="Message history"
              >
                {visibleMessages.map((message) => {
                  const mine = message.senderId === buyerId;
                  return (
                    <div
                      key={message.id}
                      className={cn("flex flex-col", mine ? "items-end" : "items-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed sm:max-w-[75%]",
                          mine
                            ? "rounded-br-sm border border-amber-500/25 bg-amber-500/15 text-foreground"
                            : "rounded-bl-sm bg-muted text-foreground"
                        )}
                      >
                        {!mine && (
                          <p className="mb-0.5 text-[11px] font-semibold text-muted-foreground">
                            {message.senderName}
                          </p>
                        )}
                        {message.body}
                      </div>
                      <p className="mt-1 px-1 text-[10px] text-muted-foreground">
                        {format(new Date(message.sentAt), "MMM d, HH:mm")}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <form className="flex items-center gap-2 border-t p-3" onSubmit={handleSend}>
                <label htmlFor="message-input" className="sr-only">
                  Type your message
                </label>
                <Input
                  id="message-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  autoComplete="off"
                  className="min-h-11 flex-1"
                  disabled={sending}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  disabled={!draft.trim() || sending}
                  aria-label="Send message"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <SendHorizonal className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                aria-hidden="true"
              >
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">Select a conversation</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Pick a thread on the left to read the history and reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
