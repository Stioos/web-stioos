"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  BellRing,
  CheckCheck,
  Inbox,
  MessageSquare,
  PenTool,
  Rocket,
  Settings,
  ShieldCheck,
  Trash2,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { exactTime, relTime } from "@/components/admin/inquiry-detail";
import type { AppNotification, NotificationType } from "@/types";

const TYPE_META: Record<
  NotificationType,
  { icon: LucideIcon; label: string; tile: string }
> = {
  service_request: {
    icon: Inbox,
    label: "Service Requests",
    tile: "bg-blue-600/10 text-blue-600",
  },
  contact_inquiry: {
    icon: MessageSquare,
    label: "Contact Inquiries",
    tile: "bg-violet-600/10 text-violet-600",
  },
  admin_created: {
    icon: ShieldCheck,
    label: "Admin Accounts",
    tile: "bg-emerald-600/10 text-emerald-600",
  },
  service_published: {
    icon: Rocket,
    label: "Publishing",
    tile: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  content_updated: {
    icon: PenTool,
    label: "Content Updates",
    tile: "bg-rose-500/10 text-rose-600",
  },
  system: {
    icon: Settings,
    label: "System",
    tile: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  },
};

type Filter = "all" | "unread" | NotificationType;

export interface AdminNotificationsViewProps {
  notifications: AppNotification[];
}

export function AdminNotificationsView({ notifications }: AdminNotificationsViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const confirm = useConfirmDialog();

  const [filter, setFilter] = useState<Filter>("all");
  const [markingAll, setMarkingAll] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Local overrides: PATCH /api/notifications/[id] only supports setting
  // `read: true`. "Mark unread" is tracked locally and merged over server
  // state for display.
  const [unreadOverrides, setUnreadOverrides] = useState<Record<string, boolean>>({});

  const isUnread = (id: string, storeRead: boolean) =>
    id in unreadOverrides ? unreadOverrides[id] : !storeRead;

  const sorted = useMemo(
    () => [...notifications].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [notifications]
  );

  const unreadCount = sorted.filter((n) => isUnread(n.id, n.read)).length;

  const filtered = useMemo(() => {
    return sorted.filter((n) => {
      const unread = isUnread(n.id, n.read);
      if (filter === "all") return true;
      if (filter === "unread") return unread;
      return n.type === filter;
    });
  }, [sorted, filter, unreadOverrides]);

  const markRead = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to mark notification.");
      }
      // Clear any local unread override so the server state wins.
      setUnreadOverrides((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const markUnreadLocal = (id: string) => {
    setUnreadOverrides((prev) => ({ ...prev, [id]: true }));
    toast({ title: "Marked as unread" });
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to mark all notifications.");
      }
      setUnreadOverrides({});
      toast({
        title: "All notifications read",
        description: `${sorted.length} notifications marked as read.`,
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setMarkingAll(false);
    }
  };

  const handleRowClick = (id: string, read: boolean) => {
    if (isUnread(id, read)) void markRead(id);
  };

  const handleToggleRead = (id: string, read: boolean) => {
    const currentlyUnread = isUnread(id, read);
    if (currentlyUnread) void markRead(id);
    else markUnreadLocal(id);
  };

  const openConfirmDelete = (id: string, title: string) => {
    confirm.confirm({
      title: "Delete notification?",
      description: `This permanently removes "${title}" from your notification center.`,
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        void (async () => {
          setBusyId(id);
          try {
            const res = await fetch(`/api/notifications/${id}`, {
              method: "DELETE",
              credentials: "same-origin",
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error ?? "Failed to delete notification.");
            }
            toast({ title: "Notification deleted" });
            router.refresh();
          } catch (e) {
            toast({
              title: "Delete failed",
              description: e instanceof Error ? e.message : "Something went wrong.",
              variant: "destructive",
            });
          } finally {
            setBusyId(null);
          }
        })();
      },
    });
  };

  const filterChips: { id: Filter; label: string; count?: number }[] = [
    { id: "all", label: "All", count: sorted.length },
    { id: "unread", label: "Unread", count: unreadCount },
    ...(Object.keys(TYPE_META) as NotificationType[]).map((t) => ({
      id: t as Filter,
      label: TYPE_META[t].label,
      count: sorted.filter((n) => n.type === t).length,
    })),
  ];

  return (
    <div>
      <PageHeader
        title="Notification Center"
        description="Platform alerts across inquiries, publishing, content, and system activity."
        actions={
          <Button onClick={handleMarkAll} disabled={markingAll || unreadCount === 0}>
            <CheckCheck className="h-4 w-4" />
            {markingAll ? "Marking…" : "Mark all as read"}
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            aria-pressed={filter === chip.id}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors",
              filter === chip.id
                ? "bg-slate-900 text-white ring-slate-900"
                : "bg-card text-muted-foreground ring-border hover:text-foreground"
            )}
          >
            {chip.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] font-bold",
                filter === chip.id ? "bg-white/20 dark:bg-black/20" : "bg-muted"
              )}
            >
              {chip.count ?? 0}
            </span>
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="You're all caught up"
          description="New platform notifications will appear here as inquiries, publishing, and content activity happens."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nothing matches this filter"
          description="Try a different filter chip, or mark everything as read to start fresh."
          action={{ label: "Clear filter", onClick: () => setFilter("all") }}
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <ul className="divide-y" role="list">
              {filtered.map((n) => {
                const unread = isUnread(n.id, n.read);
                const meta = TYPE_META[n.type] ?? TYPE_META.system;
                const TypeIcon = meta.icon;
                return (
                  <li key={n.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${n.title} — ${unread ? "unread" : "read"}`}
                      onClick={() => handleRowClick(n.id, n.read)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleRowClick(n.id, n.read);
                        }
                      }}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/50",
                        unread && "bg-blue-500/5 dark:bg-blue-500/10"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          unread ? meta.tile : "bg-muted text-muted-foreground"
                        )}
                      >
                        <TypeIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("truncate text-sm", unread ? "font-semibold text-foreground" : "font-medium text-foreground/75")}>
                            {n.title}
                          </p>
                          {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground/70" title={exactTime(n.createdAt)}>
                          {relTime(n.createdAt)} · {meta.label}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          aria-label={unread ? "Mark as read" : "Mark as unread"}
                          title={unread ? "Mark as read" : "Mark as unread"}
                          disabled={busyId === n.id}
                          onClick={() => handleToggleRead(n.id, n.read)}
                        >
                          {unread ? <CheckCheck className="h-4 w-4" /> : <Undo2 className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-red-600 dark:hover:text-red-400"
                          aria-label="Delete notification"
                          title="Delete notification"
                          disabled={busyId === n.id}
                          onClick={() => openConfirmDelete(n.id, n.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog state={confirm.state} onClose={confirm.close} />

      {sorted.length > 0 && filtered.length > 0 && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <BellRing className="h-3.5 w-3.5" />
          Click a notification to mark it read. {unreadCount} unread of {sorted.length} total.
        </p>
      )}
    </div>
  );
}
