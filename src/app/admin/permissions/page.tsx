"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ModuleKey, PermissionAction, PermissionMatrix } from "@/types";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info, Loader2, RotateCcw, Save, ShieldCheck } from "lucide-react";

const ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete", "publish", "manage"];

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

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  publish: "Publish",
  manage: "Manage",
};

function PermissionsContent() {
  const { toast } = useToast();

  const roles = useAppStore((s) => s.roles);
  const updateRolePermissions = useAppStore((s) => s.updateRolePermissions);

  // ?role= — read via useSearchParams (Suspense-wrapped below), re-applied on
  // param change using the render-time state adjustment pattern
  const params = useSearchParams();
  const roleParam = params.get("role");

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(roleParam);
  const [renderedRoleParam, setRenderedRoleParam] = useState<string | null>(roleParam);
  if (roleParam !== renderedRoleParam) {
    setRenderedRoleParam(roleParam);
    if (roleParam && roles.some((r) => r.id === roleParam)) {
      setSelectedRoleId(roleParam);
    }
  }

  const [matrix, setMatrix] = useState<PermissionMatrix | null>(null);
  const [syncedKey, setSyncedKey] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) ?? roles[0] ?? null,
    [roles, selectedRoleId]
  );

  // Sync local working copy whenever the selected role (or its stored
  // permissions) changes — render-time adjustment also re-syncs after save
  const rolePermsKey = selectedRole ? JSON.stringify(selectedRole.permissions) : "";
  if (selectedRole && rolePermsKey !== syncedKey) {
    setSyncedKey(rolePermsKey);
    setMatrix(JSON.parse(JSON.stringify(selectedRole.permissions)) as PermissionMatrix);
  }

  const isSuper = selectedRole?.slug === "super-admin";

  const granted = useMemo(
    () =>
      matrix
        ? Object.values(matrix).reduce((sum, acts) => sum + (acts as PermissionAction[]).length, 0)
        : 0,
    [matrix]
  );
  const total = MODULES.length * ACTIONS.length;
  const dirty = !!matrix && !!selectedRole && rolePermsKey !== JSON.stringify(matrix);

  // ---------- mutation helpers ----------

  const setCell = (m: ModuleKey, a: PermissionAction, on: boolean) => {
    setMatrix((prev) => {
      if (!prev) return prev;
      const current = prev[m] ?? [];
      return {
        ...prev,
        [m]: on ? (current.includes(a) ? current : [...current, a]) : current.filter((x) => x !== a),
      };
    });
  };

  const setModuleAll = (m: ModuleKey, on: boolean) => {
    setMatrix((prev) => {
      if (!prev) return prev;
      return { ...prev, [m]: on ? [...ACTIONS] : [] };
    });
  };

  const setActionAll = (a: PermissionAction, on: boolean) => {
    setMatrix((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      MODULES.forEach(({ key }) => {
        const current = prev[key] ?? [];
        next[key] = on
          ? current.includes(a)
            ? current
            : [...current, a]
          : current.filter((x) => x !== a);
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRole || !matrix) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateRolePermissions(selectedRole.id, matrix);
    setSaving(false);
    toast({
      title: `Permissions updated for ${selectedRole.name}`,
      description: `${granted} of ${total} permissions are now granted to this role.`,
    });
  };

  const handleReset = () => {
    if (!selectedRole) return;
    setMatrix(JSON.parse(JSON.stringify(selectedRole.permissions)) as PermissionMatrix);
  };

  const cellChecked = (m: ModuleKey, a: PermissionAction) => !!matrix?.[m]?.includes(a);
  const moduleAllState = (m: ModuleKey): boolean | "indeterminate" => {
    if (!matrix) return false;
    const acts = matrix[m] ?? [];
    if (acts.length === 0) return false;
    if (acts.length === ACTIONS.length) return true;
    return "indeterminate";
  };
  const actionAllState = (a: PermissionAction): boolean | "indeterminate" => {
    if (!matrix) return false;
    const withAction = MODULES.filter(({ key }) => (matrix[key] ?? []).includes(a)).length;
    if (withAction === 0) return false;
    if (withAction === MODULES.length) return true;
    return "indeterminate";
  };

  return (
    <div>
      <PageHeader
        title="Permissions"
        description="Fine-tune exactly what each role can do across every platform module."
        actions={
          <>
            <Button variant="outline" onClick={handleReset} disabled={!dirty || saving}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!dirty || isSuper || saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
          </>
        }
      />

      {/* Role selector toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Editing role
          </span>
          <Select
            value={selectedRole?.id ?? ""}
            onValueChange={(v) => setSelectedRoleId(v)}
          >
            <SelectTrigger className="w-[230px]">
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
        </div>

        <StatusBadge tone={granted === total ? "green" : granted === 0 ? "gray" : "blue"}>
          {granted} of {total} permissions granted
        </StatusBadge>

        <span className="min-w-0 flex-1" />

        {dirty && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Unsaved changes
          </span>
        )}
      </div>

      {isSuper && (
        <Alert className="mb-4 border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-xs text-amber-800">
            <span className="font-semibold">Super Admin always has full access.</span> This matrix is
            shown read-only and cannot be edited.
          </AlertDescription>
        </Alert>
      )}

      {/* Permission matrix */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="w-[260px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Module
              </TableHead>
              {ACTIONS.map((a) => (
                <TableHead key={a} className="text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Checkbox
                      checked={actionAllState(a)}
                      onCheckedChange={(c) => setActionAll(a, c === true)}
                      disabled={isSuper || !matrix}
                      aria-label={`Select all ${a} permissions`}
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {ACTION_LABELS[a]}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODULES.map(({ key, label }, idx) => (
              <TableRow key={key} className={idx % 2 === 1 ? "bg-muted/20" : undefined}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={moduleAllState(key)}
                      onCheckedChange={(c) => setModuleAll(key, c === true)}
                      disabled={isSuper || !matrix}
                      aria-label={`Toggle all actions for ${label}`}
                    />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    {isSuper && (
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                    )}
                  </div>
                </TableCell>
                {ACTIONS.map((a) => (
                  <TableCell key={a} className="text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={cellChecked(key, a)}
                        onCheckedChange={(c) => setCell(key, a, c === true)}
                        disabled={isSuper || !matrix}
                        aria-label={`${ACTION_LABELS[a]} permission for ${label}`}
                        className={cn(isSuper && "opacity-90")}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Tip: use a column header checkbox to grant an action across all modules, or a row checkbox
        to grant every action for one module. Changes apply after you save.
      </p>
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <Suspense fallback={null}>
      <PermissionsContent />
    </Suspense>
  );
}
