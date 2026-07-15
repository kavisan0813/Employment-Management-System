/**
 * ─────────────────────────────────────────────────────────────────
 *  PERMISSION CONTEXT
 *
 *  React context that resolves the effective permission set for
 *  the currently logged-in user. Wraps the entire app.
 *
 *  The resolved permission set is the union of all permissions
 *  from all active role assignments. Every component uses this
 *  via the `usePermission()` hook — never by checking role names.
 * ─────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  resolvePermissions,
  createMockAssignment,
  LEGACY_ROLE_MAP,
  ROLE_IDS,
  ROLE_TEMPLATES,
  type RoleAssignment,
  type SystemRoleId,
  type ScopeType,
} from "./roles";
import { permissionKey } from "./permissions";

// ── Context shape ───────────────────────────────────────────────
interface PermissionContextValue {
  /** Set of all permission keys the current user holds */
  permissions: Set<string>;
  /** Active role assignments for the current user */
  roleAssignments: RoleAssignment[];
  /** Check a single permission */
  hasPermission: (module: string, action: string) => boolean;
  /** Check a single permission by its pre-built key */
  hasPermissionKey: (key: string) => boolean;
  /** Check if user has ANY of the given permission keys */
  hasAnyPermission: (keys: string[]) => boolean;
  /** Check if user has ALL of the given permission keys */
  hasAllPermissions: (keys: string[]) => boolean;
  /** The primary role name (for display/backward compat) */
  primaryRoleName: string;
  /** All active role names (for display) */
  activeRoleNames: string[];
}

const PermissionContext = createContext<PermissionContextValue | undefined>(
  undefined,
);

// ── Provider ────────────────────────────────────────────────────
export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const { permissions, roleAssignments } = useMemo(() => {
    if (!user) {
      return {
        permissions: new Set<string>(),
        roleAssignments: [] as RoleAssignment[],
      };
    }

    // If the user already has roleAssignments (future: from API),
    // use them directly. Otherwise, create mock assignments from
    // the legacy single-role field for backward compatibility.
    let assignments: RoleAssignment[];

    if (user.roleAssignments && user.roleAssignments.length > 0) {
      assignments = user.roleAssignments;
    } else {
      // Legacy migration: translate the old `user.role` string
      const roleId = LEGACY_ROLE_MAP[user.role];
      if (roleId) {
        let defaultScope: ScopeType = "organization";
        if (roleId === ROLE_IDS.TEAM_LEAD) {
          defaultScope = "team";
        } else if (roleId === ROLE_IDS.EMPLOYEE) {
          defaultScope = "self";
        }
        assignments = [createMockAssignment(user.email, roleId, defaultScope)];
      } else {
        // Fallback to employee
        assignments = [createMockAssignment(user.email, ROLE_IDS.EMPLOYEE, "self")];
      }
    }

    return {
      permissions: resolvePermissions(assignments),
      roleAssignments: assignments,
    };
  }, [user]);

  const value = useMemo<PermissionContextValue>(() => {
    const hasPermissionKey = (key: string) => permissions.has(key);
    const hasPermission = (module: string, action: string) =>
      permissions.has(permissionKey(module, action));
    const hasAnyPermission = (keys: string[]) =>
      keys.some((k) => permissions.has(k));
    const hasAllPermissions = (keys: string[]) =>
      keys.every((k) => permissions.has(k));

    // Derive role names from active assignments
    const activeRoleNames = roleAssignments
      .filter((a) => a.isActive)
      .map((a) => {
        const template = ROLE_TEMPLATES[a.roleId as SystemRoleId];
        return template?.name ?? a.roleId;
      });

    return {
      permissions,
      roleAssignments,
      hasPermission,
      hasPermissionKey,
      hasAnyPermission,
      hasAllPermissions,
      primaryRoleName: activeRoleNames[0] ?? "Employee",
      activeRoleNames,
    };
  }, [permissions, roleAssignments]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

// ── Consumer hook ───────────────────────────────────────────────
export function usePermissions(): PermissionContextValue {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
}
