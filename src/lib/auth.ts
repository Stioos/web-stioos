/**
 * Shared auth-redirect helpers — used by both the /auth/login page and the
 * same-page LoginDrawer so every sign-in path resolves destinations the
 * same way.
 */

export type LoginRole = "buyer" | "member";

/**
 * Role-aware `next` resolution — honors ?next= ONLY when it targets the
 * signed-in role's own workspace (or a safe public path). Prevents stale
 * next params from hijacking a session into another role's area.
 */
export function resolveRedirect(
  roleRedirect: string | null,
  role?: LoginRole
): string {
  const fallback =
    role === "buyer"
      ? "/dashboard/buyer"
      : "/admin";

  if (
    !roleRedirect ||
    !roleRedirect.startsWith("/") ||
    roleRedirect.startsWith("//")
  ) {
    return fallback;
  }

  if (role === "buyer" && roleRedirect.startsWith("/dashboard/buyer")) {
    return roleRedirect;
  }
  if ((role === "member" || !role) && roleRedirect.startsWith("/admin")) {
    return roleRedirect;
  }
  // Safe public path — anything on the site that is not a cross-role workspace.
  if (
    !roleRedirect.startsWith("/dashboard") &&
    !roleRedirect.startsWith("/admin")
  ) {
    return roleRedirect;
  }
  return fallback;
}
