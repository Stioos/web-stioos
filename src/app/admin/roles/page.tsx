"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ModuleKey, PermissionAction, PermissionMatrix, Role } from "@/types";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Copy,
  Eye,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "marketplace", label: "Marketplace" },
  { key: "services", label: "Services" },
  { key: "categories", label: "Categories" },
  { key: "subcategories", label: "Subcategories" },
  { key: "featured", label: "Featured" },
  { key: "orders", label: "Orders" },
  { key: "homepage", label: "Homepage" },
  { key: "pages", label: "Pages" },
  { key: "industries", label: "Industries" },
  { key: "insights", label: "Insights" },
  { key: "resources", label: "Resources" },
  { key: "faqs", label: "FAQs" },
  { key: "users", label: "Users" },
  { key: "admins", label: "Admins" },
  { key: "roles", label: "Roles" },
  { key: "permissions", label: "Permissions" },
  { key: "inquiries", label: "Inquiries" },
  { key: "notifications", label: "Notifications" },
  { key: "activity", label: "Activity" },
  { key: "settings", label: "Settings" },
  { key: "branding", label: "Branding" },
  { key: "navigation", label: "Navigation" },
];

interface RoleFormState {
  name: string;
  description: string;
  viewModules: ModuleKey[];
}

function emptyMatrix(viewModules: ModuleKey[]): PermissionMatrix {
  return Object.fromEntries(
    MODULES.map(({ key }) => [
      key,
      (viewModules.includes(key) ? ["view"] : []) as PermissionAction[],
    ])
  ) as unknown as PermissionMatrix;
}

function RolesContent() {
  const { toast } = useToast();
  const { confirm, close: closeConfirm, state: confirmState } = useConfirmDialog();

  const roles = useAppStore((s) => s.roles);
  const admins = useAppStore((s) => s.admins);
  const addRole = useAppStore((s) => s.addRole);
  const updateRole = useAppStore((s) => s.updateRole);
  const deleteRole = useAppStore((s) => s.deleteRole);
  const cloneRole = useAppStore((s) => s.cloneRole);

  // ?new=1 — read via useSearchParams (Suspense-wrapped below), re-applied on
  // param change using the render-time state adjustment pattern
  const params = useSearchParams();
  const newParam = params.get("new") === "1";

  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(newParam ? "add" : null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<RoleFormState>({ name: "", description: "", viewModules: [] });
  const [errors, setErrors] = useState<Partial<Record<"name", string>>>({});
  const [saving, setSaving] = useState(false);

  const [renderedNew, setRenderedNew] = useState(newParam);
  if (newParam !== renderedNew) {
    setRenderedNew(newParam);
    if (newParam) openAdd();
  }

  const stats = useMemo(() => {
    const map = new Map<string, { users: number; permissions: number; modules: number }>();
    roles.forEach((role) => {
      const permissionCount = Object.values(role.permissions).reduce(
        (sum, acts) => sum + (acts as PermissionAction[]).length,
        0
      );
      const moduleCount = Object.values(role.permissions).filter(
        (acts) => (acts as PermissionAction[]).length > 0
      ).length;
      map.set(role.id, {
        users: admins.filter((a) => a.roleId === role.id).length,
        permissions: permissionCount,
        modules: moduleCount,
      });
    });
    return map;
  }, [roles, admins]);

  function openAdd() {
    setForm({ name: "", description: "", viewModules: [] });
    setErrors({});
    setDialogMode("add");
  }

  function openEdit(role: Role) {
    setEditId(role.id);
    setForm({
      name: role.name,
      description: role.description,
      viewModules: MODULES.filter(({ key }) =>
        (role.permissions[key] ?? []).includes("view")
      ).map(({ key }) => key),
    });
    setErrors({});
    setDialogMode("edit");
  }

  function closeDialog() {
    setDialogMode(null);
    setEditId(null);
    setForm({ name: "", description: "", viewModules: [] });
    setErrors({});
  }

  const toggleModule = (key: ModuleKey) => {
    setForm((f) => ({
      ...f,
      viewModules: f.viewModules.includes(key)
        ? f.viewModules.filter((m) => m !== key)
        : [...f.viewModules, key],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setErrors({ name: "Role name is required." });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    if (dialogMode === "add") {
      addRole({
        name: form.name.trim(),
        description: form.description.trim(),
        permissions: emptyMatrix(form.viewModules),
      });
      toast({
        title: "Role created",
        description: `"${form.name.trim()}" now has view access to ${form.viewModules.length} module${form.viewModules.length === 1 ? "" : "s"}.`,
      });
    } else if (dialogMode === "edit" && editId) {
      const existing = roles.find((r) => r.id === editId);
      if (existing) {
        // Preserve all non-view actions; sync view per checklist
        const nextMatrix = Object.fromEntries(
          MODULES.map(({ key }) => {
            const rest = (existing.permissions[key] ?? []).filter((a) => a !== "view");
            return [key, form.viewModules.includes(key) ? ["view", ...rest] : rest];
          })
        ) as unknown as PermissionMatrix;
        updateRole(editId, {
          name: form.name.trim(),
          description: form.description.trim(),
          permissions: nextMatrix,
        });
      }
      toast({
        title: "Role updated",
        description: `"${form.name.trim()}" was saved successfully.`,
      });
    }
    setSaving(false);
    closeDialog();
  };

  const handleClone = (role: Role) => {
    const copy = cloneRole(role.id);
    toast({
      title: "Role cloned",
      description: `"${copy?.name ?? role.name}" was created with the same permissions.`,
    });
  };

  const handleDelete = (role: Role) => {
    if (role.isSystem) {
      toast({
        title: "System roles cannot be deleted",
        description: `"${role.name}" is protected because the platform depends on it.`,
        variant: "destructive",
      });
      return;
    }
    const assigned = admins.filter((a) => a.roleId === role.id).length;
    if (assigned > 0) {
      toast({
        title: "Role is still assigned",
        description: `Reassign ${assigned} admin${assigned === 1 ? "" : "s"} using this role before deleting it.`,
        variant: "destructive",
      });
      return;
    }
    confirm({
      title: "Delete role",
      description: `Permanently delete "${role.name}"? This cannot be undone.`,
      confirmLabel: "Delete role",
      onConfirm: () => {
        deleteRole(role.id);
        toast({
          title: "Role deleted",
          description: `"${role.name}" was removed from the platform.`,
        });
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Define what each type of administrator can see and do across the platform."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => {
          const stat = stats.get(role.id) ?? { users: 0, permissions: 0, modules: 0 };
          return (
            <div
              key={role.id}
              className="flex flex-col rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-foreground">{role.name}</h2>
                    <p className="text-[11px] text-muted-foreground">
                      Created {formatDistanceToNow(new Date(role.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {role.isSystem && (
                  <Badge variant="outline" className="shrink-0 border-amber-600/40 text-[10px] text-amber-700 dark:text-amber-400">
                    System
                  </Badge>
                )}
              </div>

              <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                {role.description || "No description provided."}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3">
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {stat.users}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Users
                  </p>
                </div>
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                    <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                    {stat.permissions}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Permissions
                  </p>
                </div>
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    {stat.modules}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Modules
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mt-auto flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(role)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleClone(role)}>
                  <Copy className="h-3.5 w-3.5" />
                  Clone
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/permissions?role=${role.id}`}>
                    <Eye className="h-3.5 w-3.5" />
                    View permissions
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-8 w-8 text-red-600 hover:bg-destructive/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  aria-label={`Delete role ${role.name}`}
                  onClick={() => handleDelete(role)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Create Role" : "Edit Role"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "add"
                ? "Define a new role and pick which modules it can view. Finer permissions can be tuned later."
                : "Update the role's identity and view access. Other action permissions are preserved."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role-name"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  if (errors.name) setErrors({});
                }}
                placeholder="e.g. Regional Manager"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What is this role responsible for?"
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Module view access</Label>
              <p className="text-xs text-muted-foreground">
                Checked modules get the <span className="font-medium text-foreground">view</span>{" "}
                permission. Create starts from an empty matrix.
              </p>
              <div className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto rounded-lg border p-3 sm:grid-cols-3">
                {MODULES.map(({ key, label }) => {
                  const checked = form.viewModules.includes(key);
                  return (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleModule(key)} />
                      <span className={checked ? "font-medium text-foreground" : "text-muted-foreground"}>
                        {label}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {form.viewModules.length} of {MODULES.length} modules selected
              </p>
            </div>

            {dialogMode === "edit" && editId && roles.find((r) => r.id === editId)?.isSystem && (
              <p className="flex items-start gap-2 rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:text-amber-300 dark:ring-amber-500/30">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                This is a system role. You can rename it, but review changes carefully — admins
                depend on these permissions.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : dialogMode === "add" ? (
                "Create role"
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog state={confirmState} onClose={closeConfirm} />
    </div>
  );
}

export default function RolesPage() {
  return (
    <Suspense fallback={null}>
      <RolesContent />
    </Suspense>
  );
}
