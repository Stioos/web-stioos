"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import type { AdminUser } from "@/types";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { EntityStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Eye,
  KeyRound,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";

// Module keys in matrix order (labels duplicated here — shared constants file
// is outside this task's allowed file list)
const MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  marketplace: "Marketplace",
  services: "Services",
  categories: "Categories",
  subcategories: "Subcategories",
  featured: "Featured",
  homepage: "Homepage",
  pages: "Pages",
  industries: "Industries",
  insights: "Insights",
  resources: "Resources",
  faqs: "FAQs",
  users: "Users",
  admins: "Admins",
  roles: "Roles",
  permissions: "Permissions",
  inquiries: "Inquiries",
  notifications: "Notifications",
  activity: "Activity",
  settings: "Settings",
  branding: "Branding",
  navigation: "Navigation",
};

const ROLE_TONES: Record<string, "amber" | "blue" | "green" | "violet" | "gray"> = {
  "super-admin": "amber",
  admin: "blue",
  "marketplace-manager": "green",
  "content-manager": "violet",
  "service-manager": "blue",
  "support-manager": "green",
};

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

interface AdminFormState {
  name: string;
  email: string;
  phone: string;
  title: string;
  roleId: string;
  active: boolean;
}

const EMPTY_FORM: AdminFormState = {
  name: "",
  email: "",
  phone: "",
  title: "",
  roleId: "role-admin",
  active: true,
};

type FormMode = "add" | "edit" | null;

function AdminsContent() {
  const { toast } = useToast();
  const { confirm, close: closeConfirm, state: confirmState } = useConfirmDialog();

  const admins = useAppStore((s) => s.admins);
  const roles = useAppStore((s) => s.roles);
  const addAdmin = useAppStore((s) => s.addAdmin);
  const updateAdmin = useAppStore((s) => s.updateAdmin);
  const deleteAdmin = useAppStore((s) => s.deleteAdmin);
  const setAdminStatus = useAppStore((s) => s.setAdminStatus);

  // ?new=1 / ?focus= — read via useSearchParams (Suspense-wrapped below) and
  // re-applied on param change using the render-time state adjustment pattern
  const params = useSearchParams();
  const newParam = params.get("new") === "1";
  const focusParam = params.get("focus");

  const [formMode, setFormMode] = useState<FormMode>(newParam ? "add" : null);
  const [detailId, setDetailId] = useState<string | null>(focusParam);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});
  const [saving, setSaving] = useState(false);

  const [renderedNew, setRenderedNew] = useState(newParam);
  const [renderedFocus, setRenderedFocus] = useState<string | null>(focusParam);
  if (newParam !== renderedNew) {
    setRenderedNew(newParam);
    if (newParam) {
      setForm(EMPTY_FORM);
      setFormMode("add");
    }
  }
  if (focusParam !== renderedFocus) {
    setRenderedFocus(focusParam);
    setDetailId(focusParam);
  }

  const roleById = useMemo(
    () => (id: string) => roles.find((r) => r.id === id),
    [roles]
  );

  const detailAdmin = admins.find((a) => a.id === detailId) ?? null;
  const detailRole = detailAdmin ? roleById(detailAdmin.roleId) : undefined;

  // ---------- actions ----------

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setFormMode("add");
  };

  const openEdit = (admin: AdminUser) => {
    setEditId(admin.id);
    setForm({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      title: admin.title,
      roleId: admin.roleId,
      active: admin.status === "active",
    });
    setErrors({});
    setFormMode("edit");
  };

  const closeForm = () => {
    setFormMode(null);
    setEditId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleSave = async () => {
    const nextErrors: Partial<Record<"name" | "email", string>> = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    if (formMode === "add") {
      addAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        title: form.title.trim(),
        roleId: form.roleId,
        status: form.active ? "active" : "inactive",
      });
      toast({
        title: "Admin created",
        description: `${form.name.trim()} was added to the admin team.`,
      });
    } else if (formMode === "edit" && editId) {
      updateAdmin(editId, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        title: form.title.trim(),
        roleId: form.roleId,
        status: form.active ? "active" : "inactive",
      });
      toast({
        title: "Admin updated",
        description: `${form.name.trim()}'s profile was saved.`,
      });
    }
    setSaving(false);
    closeForm();
  };

  const handleToggleStatus = (admin: AdminUser) => {
    const next = admin.status === "active" ? "inactive" : "active";
    setAdminStatus(admin.id, next);
    toast({
      title: next === "active" ? "Admin activated" : "Admin deactivated",
      description: `${admin.name} is now ${next}.`,
    });
  };

  const handleDelete = (admin: AdminUser) => {
    confirm({
      title: "Delete admin",
      description: `Permanently delete ${admin.name}? This cannot be undone and revokes their platform access immediately.`,
      confirmLabel: "Delete admin",
      onConfirm: () => {
        deleteAdmin(admin.id);
        if (detailId === admin.id) setDetailId(null);
        toast({
          title: "Admin deleted",
          description: `${admin.name} was removed from the platform.`,
        });
      },
    });
  };

  // ---------- columns ----------

  const columns = useMemo<Column<AdminUser>[]>(
    () => [
      {
        key: "admin",
        header: "Admin",
        render: (a) => (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-800 text-xs font-bold text-white">
              {initialsOf(a.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{a.name}</span>
              <span className="hidden truncate text-xs text-muted-foreground lg:block">
                {a.title || "—"}
              </span>
            </span>
          </div>
        ),
      },
      {
        key: "email",
        header: "Email",
        hideBelow: "sm",
        render: (a) => <span className="text-sm text-muted-foreground">{a.email}</span>,
      },
      {
        key: "role",
        header: "Role",
        hideBelow: "lg",
        render: (a) => {
          const role = roleById(a.roleId);
          return (
            <StatusBadge tone={ROLE_TONES[role?.slug ?? ""] ?? "gray"} dot={false}>
              {role?.name ?? "No role"}
            </StatusBadge>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        render: (a) => <EntityStatusBadge status={a.status} />,
      },
      {
        key: "modules",
        header: "Modules",
        hideBelow: "xl",
        render: (a) => {
          const role = roleById(a.roleId);
          const viewModules = role
            ? Object.entries(role.permissions)
                .filter(([, acts]) => (acts as string[]).includes("view"))
                .map(([m]) => m)
            : [];
          return (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
                >
                  <KeyRound className="h-3 w-3 text-muted-foreground" />
                  {viewModules.length} modules
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-2"
                onClick={(e) => e.stopPropagation()}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  View access via {role?.name ?? "role"}
                </p>
                <div className="max-h-64 overflow-y-auto">
                  {viewModules.map((m) => (
                    <p
                      key={m}
                      className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-foreground"
                    >
                      <Check className="h-3 w-3 text-emerald-600" />
                      {MODULE_LABELS[m] ?? m}
                    </p>
                  ))}
                  {viewModules.length === 0 && (
                    <p className="px-2 py-1 text-xs text-muted-foreground">No module access.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          );
        },
      },
      {
        key: "lastActive",
        header: "Last Active",
        hideBelow: "lg",
        sortable: true,
        sortValue: (a) => Date.parse(a.lastActive) || 0,
        render: (a) => (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(a.lastActive), { addSuffix: true })}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        hideBelow: "xl",
        sortable: true,
        sortValue: (a) => Date.parse(a.createdAt) || 0,
        render: (a) => (
          <span className="text-sm text-muted-foreground">
            {format(new Date(a.createdAt), "d MMM yyyy")}
          </span>
        ),
      },
    ],
    [roleById]
  );

  const rowActions = (a: AdminUser) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${a.name}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => setDetailId(a.id)}>
          <Eye className="h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openEdit(a)}>
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleStatus(a)}>
          {a.status === "active" ? (
            <>
              <UserX className="h-4 w-4" /> Deactivate
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" /> Activate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete(a)}
          className="text-red-600 focus:text-red-600 focus:bg-destructive/10 dark:text-red-400 dark:focus:text-red-400"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div>
      <PageHeader
        title="Admin Management"
        description="Manage administrator accounts, roles, and platform access."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Admin
          </Button>
        }
      />

      <DataTable
        data={admins}
        columns={columns}
        searchKeys={["name", "email", "title"]}
        searchPlaceholder="Search admins by name or email…"
        pageSize={8}
        onRowClick={(a) => setDetailId(a.id)}
        rowActions={rowActions}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-foreground">No admins found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search.</p>
          </div>
        }
      />

      {/* ---------- Detail sheet ---------- */}
      <Sheet open={!!detailAdmin} onOpenChange={(o) => !o && setDetailId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {detailAdmin && (
            <>
              <SheetHeader className="pb-0">
                <SheetTitle asChild>
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-base font-bold text-white">
                      {initialsOf(detailAdmin.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-bold tracking-tight text-foreground">
                        {detailAdmin.name}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {detailAdmin.title || "Administrator"}
                      </span>
                    </span>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Admin profile, permissions, and account controls.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-8">
                {/* Profile */}
                <div className="rounded-lg border bg-card p-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Profile
                  </p>
                  <div className="space-y-2.5 text-sm">
                    <p className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{detailAdmin.email}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{detailAdmin.phone || "—"}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>
                        Joined {format(new Date(detailAdmin.createdAt), "d MMMM yyyy")} · Active{" "}
                        {formatDistanceToNow(new Date(detailAdmin.lastActive), { addSuffix: true })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Role & permissions */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Role &amp; Permissions
                    </p>
                    {detailRole && (
                      <StatusBadge tone={ROLE_TONES[detailRole.slug] ?? "gray"} dot={false}>
                        {detailRole.name}
                      </StatusBadge>
                    )}
                  </div>
                  {detailRole ? (
                    <>
                      <p className="mb-3 text-sm text-muted-foreground">{detailRole.description}</p>
                      {detailRole.slug === "super-admin" ? (
                        <p className="flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:text-amber-300 dark:ring-amber-500/30">
                          <KeyRound className="h-3.5 w-3.5" />
                          Full access to all 22 modules and every action.
                        </p>
                      ) : (
                        <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
                          {Object.entries(detailRole.permissions)
                            .filter(([, acts]) => (acts as string[]).length > 0)
                            .map(([m, acts]) => (
                              <div key={m} className="rounded-md border bg-muted/30 px-2.5 py-1.5">
                                <p className="text-xs font-medium text-foreground">
                                  {MODULE_LABELS[m] ?? m}
                                </p>
                                <p className="mt-0.5 text-[10px] capitalize text-muted-foreground">
                                  {(acts as string[]).join(" · ")}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No role assigned.</p>
                  )}
                </div>

                {/* Status */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Account Status
                      </p>
                      <EntityStatusBadge status={detailAdmin.status} />
                    </div>
                    <Button
                      variant={detailAdmin.status === "active" ? "outline" : "default"}
                      onClick={() => handleToggleStatus(detailAdmin)}
                    >
                      {detailAdmin.status === "active" ? (
                        <>
                          <UserX className="h-4 w-4" /> Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4" /> Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-lg border border-red-600/30 bg-red-500/5 p-4 dark:bg-red-500/10">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
                    <AlertTriangle className="h-3.5 w-3.5" /> Danger Zone
                  </p>
                  <p className="mt-1.5 text-xs text-red-700/80">
                    Deleting this admin removes their access permanently. This cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleDelete(detailAdmin)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete admin
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ---------- Add / Edit sheet ---------- */}
      <Sheet open={formMode !== null} onOpenChange={(o) => !o && closeForm()}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{formMode === "add" ? "Add Admin" : "Edit Admin"}</SheetTitle>
            <SheetDescription>
              {formMode === "add"
                ? "Create an administrator account and assign a role."
                : "Update this administrator's profile and access."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-8">
            <div className="space-y-1.5">
              <Label htmlFor="admin-name">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Aarav Mehta"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@stioos.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="admin-phone">Phone</Label>
                <Input
                  id="admin-phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-title">Title</Label>
                <Input
                  id="admin-title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Operations Lead"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={form.roleId}
                onValueChange={(v) => setForm((f) => ({ ...f, roleId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {roleById(form.roleId)?.description ?? "Determines module access and permissions."}
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-lg border bg-card p-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">Active account</p>
                <p className="text-xs text-muted-foreground">
                  Inactive admins cannot sign in to the platform.
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(c) => setForm((f) => ({ ...f, active: c }))}
                aria-label="Toggle admin active status"
              />
            </div>
          </div>

          <SheetFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : formMode === "add" ? (
                "Create admin"
              ) : (
                "Save changes"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmDialog state={confirmState} onClose={closeConfirm} />
    </div>
  );
}

export default function AdminsPage() {
  return (
    <Suspense fallback={null}>
      <AdminsContent />
    </Suspense>
  );
}
