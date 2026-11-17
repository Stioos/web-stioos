"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import type { User, UserStatus } from "@/types";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { EntityStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  Ban,
  Building2,
  CalendarDays,
  Briefcase,
  CalendarClock,
  CheckCheck,
  Download,
  Eye,
  Globe2,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Target,
  Trash2,
  User as UserIcon,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

interface UserFormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  status: UserStatus;
}

const EMPTY_FORM: UserFormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  country: "",
  status: "active",
};

type FormMode = "add" | "edit" | null;

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

function UsersContent() {
  const { toast } = useToast();
  const { confirm, close: closeConfirm, state: confirmState } = useConfirmDialog();

  const users = useAppStore((s) => s.users);
  const addUser = useAppStore((s) => s.addUser);
  const updateUser = useAppStore((s) => s.updateUser);
  const deleteUser = useAppStore((s) => s.deleteUser);
  const setUserStatus = useAppStore((s) => s.setUserStatus);

  // ?new=1 / ?focus= — read via useSearchParams (Suspense-wrapped below) and
  // re-applied on param change using the render-time state adjustment pattern
  const params = useSearchParams();
  const newParam = params.get("new") === "1";
  const focusParam = params.get("focus");

  const [detailId, setDetailId] = useState<string | null>(focusParam);
  const [formMode, setFormMode] = useState<FormMode>(newParam ? "add" : null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

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

  const countries = useMemo(
    () => Array.from(new Set(users.map((u) => u.country).filter(Boolean))).sort(),
    [users]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          (statusFilter === "all" || u.status === statusFilter) &&
          (countryFilter === "all" || u.country === countryFilter)
      ),
    [users, statusFilter, countryFilter]
  );

  const detailUser = users.find((u) => u.id === detailId) ?? null;
  const filtersActive = statusFilter !== "all" || countryFilter !== "all";

  // ---------- form ----------

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setFormMode("add");
  };

  const openEdit = (user: User) => {
    setEditId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      country: user.country,
      status: user.status,
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
      addUser({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        status: form.status,
      });
      toast({
        title: "User created",
        description: `${form.name.trim()} was added to the platform.`,
      });
    } else if (formMode === "edit" && editId) {
      updateUser(editId, {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        status: form.status,
      });
      toast({
        title: "User updated",
        description: `${form.name.trim()}'s profile was saved.`,
      });
    }
    setSaving(false);
    closeForm();
  };

  // ---------- row + bulk actions ----------

  const applyStatus = (ids: string[], status: UserStatus, clear: () => void) => {
    ids.forEach((id) => setUserStatus(id, status));
    toast({
      title: `${ids.length} user${ids.length === 1 ? "" : "s"} ${status === "active" ? "activated" : status === "inactive" ? "deactivated" : "suspended"}`,
      description: `Status set to ${status} for the selected users.`,
    });
    clear();
  };

  const handleBulkDelete = (ids: string[], clear: () => void) => {
    confirm({
      title: "Delete selected users",
      description: `Permanently delete ${ids.length} selected user${ids.length === 1 ? "" : "s"}? This cannot be undone.`,
      confirmLabel: "Delete users",
      onConfirm: () => {
        ids.forEach((id) => deleteUser(id));
        toast({
          title: "Users deleted",
          description: `${ids.length} user${ids.length === 1 ? "" : "s"} were removed from the platform.`,
        });
        clear();
      },
    });
  };

  const handleDelete = (user: User) => {
    confirm({
      title: "Delete user",
      description: `Permanently delete ${user.name}? This cannot be undone.`,
      confirmLabel: "Delete user",
      onConfirm: () => {
        deleteUser(user.id);
        if (detailId === user.id) setDetailId(null);
        toast({
          title: "User deleted",
          description: `${user.name} was removed from the platform.`,
        });
      },
    });
  };

  const handleExportCsv = () => {
    const headers = [
      "Name",
      "Email",
      "Company",
      "Phone",
      "Country",
      "Status",
      "Role",
      "Inquiries",
      "Created",
      "Last Active",
    ];
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = filteredUsers.map((u) =>
      [
        u.name,
        u.email,
        u.company,
        u.phone,
        u.country,
        u.status,
        u.role,
        String(u.inquiriesCount),
        u.createdAt,
        u.lastActive,
      ]
        .map(escape)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stioos-users-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Export complete",
      description: `${filteredUsers.length} user${filteredUsers.length === 1 ? "" : "s"} exported to CSV.`,
    });
  };

  // ---------- columns ----------

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        key: "user",
        header: "User",
        render: (u) => (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-500 to-slate-700 text-xs font-bold text-white">
              {initialsOf(u.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{u.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
            </span>
          </div>
        ),
      },
      {
        key: "company",
        header: "Company",
        hideBelow: "md",
        render: (u) => <span className="text-sm text-muted-foreground">{u.company || "—"}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (u) => <EntityStatusBadge status={u.status} />,
      },
      {
        key: "role",
        header: "Role",
        hideBelow: "lg",
        render: (u) => (
          <StatusBadge tone="gray" dot={false} className="capitalize">
            {u.role}
          </StatusBadge>
        ),
      },
      {
        key: "inquiriesCount",
        header: "Inquiries",
        hideBelow: "sm",
        sortable: true,
        sortValue: (u) => u.inquiriesCount,
        render: (u) => <span className="text-sm font-medium text-foreground">{u.inquiriesCount}</span>,
      },
      {
        key: "country",
        header: "Country",
        hideBelow: "lg",
        render: (u) => <span className="text-sm text-muted-foreground">{u.country || "—"}</span>,
      },
      {
        key: "createdAt",
        header: "Created",
        hideBelow: "xl",
        sortable: true,
        sortValue: (u) => Date.parse(u.createdAt) || 0,
        render: (u) => (
          <span className="text-sm text-muted-foreground">
            {format(new Date(u.createdAt), "d MMM yyyy")}
          </span>
        ),
      },
      {
        key: "lastActive",
        header: "Last Active",
        hideBelow: "xl",
        sortable: true,
        sortValue: (u) => Date.parse(u.lastActive) || 0,
        render: (u) => (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(u.lastActive), { addSuffix: true })}
          </span>
        ),
      },
    ],
    []
  );

  const rowActions = (u: User) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${u.name}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => setDetailId(u.id)}>
          <Eye className="h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openEdit(u)}>
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setUserStatus(u.id, "active")} disabled={u.status === "active"}>
          <UserCheck className="h-4 w-4" /> Activate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setUserStatus(u.id, "inactive")} disabled={u.status === "inactive"}>
          <UserX className="h-4 w-4" /> Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setUserStatus(u.id, "suspended")} disabled={u.status === "suspended"}>
          <Ban className="h-4 w-4" /> Suspend
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete(u)}
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
        title="User Management"
        description="Marketplace buyers and members, their status, and engagement."
        actions={
          <>
            <Button variant="outline" onClick={handleExportCsv}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </>
        }
      />

      <DataTable
        data={filteredUsers}
        columns={columns}
        searchKeys={["name", "email", "company"]}
        searchPlaceholder="Search users by name, email, or company…"
        pageSize={8}
        selectable
        selected={selectedIds}
        onSelectedChange={setSelectedIds}
        bulkActions={(ids, clear) => (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyStatus(ids, "active", clear)}
            >
              <CheckCheck className="h-3.5 w-3.5" /> Activate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyStatus(ids, "inactive", clear)}
            >
              <UserX className="h-3.5 w-3.5" /> Deactivate
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkDelete(ids, clear)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </>
        )}
        toolbar={
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filtersActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setCountryFilter("all");
                }}
              >
                Clear
              </Button>
            )}
          </>
        }
        onRowClick={(u) => setDetailId(u.id)}
        rowActions={rowActions}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-foreground">No users found</p>
            <p className="text-sm text-muted-foreground">
              {filtersActive
                ? "Try clearing the status or country filters."
                : "Try adjusting your search."}
            </p>
          </div>
        }
      />

      {/* ---------- Detail sheet ---------- */}
      <Sheet open={!!detailUser} onOpenChange={(o) => !o && setDetailId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {detailUser && (
            <>
              <SheetHeader className="pb-0">
                <SheetTitle asChild>
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 text-base font-bold text-white">
                      {initialsOf(detailUser.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-bold tracking-tight text-foreground">
                        {detailUser.name}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {detailUser.email}
                      </span>
                    </span>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  User profile, engagement, and account controls.
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
                      <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>
                        {detailUser.company ||
                          (detailUser.registrationType === "professional"
                            ? "Independent / Self-employed"
                            : "Independent")}
                      </span>
                    </p>
                    {detailUser.registrationType && (
                      <p className="flex items-center gap-2.5">
                        {detailUser.registrationType === "company" ? (
                          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span>
                          {detailUser.registrationType === "company"
                            ? "Company / Organization"
                            : "Professional / Individual"}
                          <span className="text-xs text-muted-foreground"> · registration</span>
                        </span>
                      </p>
                    )}
                    <p className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{detailUser.phone || "—"}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{detailUser.country || "—"}</span>
                    </p>
                    {detailUser.accountType && (
                      <p className="flex items-center gap-2.5">
                        <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          {detailUser.accountType}
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            · {detailUser.registrationType === "professional"
                              ? "professional type"
                              : "company type"}
                          </span>
                        </span>
                      </p>
                    )}
                    {detailUser.profession && (
                      <p className="flex items-center gap-2.5">
                        <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          {detailUser.profession}
                          <span className="text-xs text-muted-foreground"> · profession</span>
                        </span>
                      </p>
                    )}
                    {detailUser.companySize && (
                      <p className="flex items-center gap-2.5">
                        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          {detailUser.companySize}
                          <span className="text-xs text-muted-foreground"> · company size</span>
                        </span>
                      </p>
                    )}
                    {detailUser.intent && (
                      <p className="flex items-center gap-2.5">
                        <Target className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          {detailUser.intent}
                          <span className="text-xs text-muted-foreground"> · intent</span>
                        </span>
                      </p>
                    )}
                    {detailUser.intentTimeline && (
                      <p className="flex items-center gap-2.5">
                        <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          {detailUser.intentTimeline}
                          <span className="text-xs text-muted-foreground"> · expected start</span>
                        </span>
                      </p>
                    )}
                    {detailUser.registrationSource && (
                      <p className="text-xs text-muted-foreground">
                        Registered via{" "}
                        <span className="font-medium text-foreground">
                          {detailUser.registrationSource === "lead-modal"
                            ? "conversion CTA (lead modal)"
                            : detailUser.registrationSource === "signup-page"
                              ? "buyer signup page"
                              : detailUser.registrationSource}
                        </span>
                      </p>
                    )}
                    <p className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>
                        Member since {format(new Date(detailUser.createdAt), "d MMMM yyyy")} · Last
                        active{" "}
                        {formatDistanceToNow(new Date(detailUser.lastActive), { addSuffix: true })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Engagement */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-card p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Inquiries
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                      {detailUser.inquiriesCount}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Account Type
                    </p>
                    <p className="mt-1 text-sm font-semibold capitalize text-foreground">
                      {detailUser.role}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="rounded-lg border bg-card p-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Account Status
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <EntityStatusBadge status={detailUser.status} />
                    <span className="flex-1" />
                    {detailUser.status !== "active" && (
                      <Button size="sm" variant="outline" onClick={() => setUserStatus(detailUser.id, "active")}>
                        <UserCheck className="h-4 w-4" /> Activate
                      </Button>
                    )}
                    {detailUser.status !== "inactive" && (
                      <Button size="sm" variant="outline" onClick={() => setUserStatus(detailUser.id, "inactive")}>
                        <UserX className="h-4 w-4" /> Deactivate
                      </Button>
                    )}
                    {detailUser.status !== "suspended" && (
                      <Button size="sm" variant="outline" onClick={() => setUserStatus(detailUser.id, "suspended")}>
                        <Ban className="h-4 w-4" /> Suspend
                      </Button>
                    )}
                  </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-lg border border-red-600/30 bg-red-500/5 p-4 dark:bg-red-500/10">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
                    <AlertTriangle className="h-3.5 w-3.5" /> Danger Zone
                  </p>
                  <p className="mt-1.5 text-xs text-red-700/80">
                    Deleting this user removes their profile and history from the platform.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleDelete(detailUser)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete user
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
            <SheetTitle>{formMode === "add" ? "Add User" : "Edit User"}</SheetTitle>
            <SheetDescription>
              {formMode === "add"
                ? "Create a marketplace user account."
                : "Update this user's profile and status."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 pb-8">
            <div className="space-y-1.5">
              <Label htmlFor="user-name">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Daniel Osei"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@company.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-company">Company</Label>
              <Input
                id="user-company"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="e.g. Vertex Build Group"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="user-phone">Phone</Label>
                <Input
                  id="user-phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="user-country">Country</Label>
                <Input
                  id="user-country"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  placeholder="e.g. United States"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as UserStatus }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Globe2 className="h-3 w-3" />
                Suspended users cannot submit inquiries or access gated content.
              </p>
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
                "Create user"
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

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersContent />
    </Suspense>
  );
}
