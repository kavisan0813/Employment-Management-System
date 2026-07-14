import { createContext, useContext, useState, ReactNode } from "react";
import type { RoleAssignment } from "../shared/permission-engine/roles";

export type UserRole =
  | "Platform Admin"
  | "Super Admin"
  | "HR Manager"
  | "Finance"
  | "Manager"
  | "Employee";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  organization?: string;
  organizationId?: string;
  /**
   * Multi-role assignments with scopes.
   * In production these come from the `user_role_assignments` table.
   * For backward compat, the permission engine falls back to
   * creating a mock assignment from `role` if this is empty.
   */
  roleAssignments?: RoleAssignment[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  /**
   * @deprecated Use `usePermission()` or `usePermissions()` from the
   * permission engine instead. This is kept temporarily for backward
   * compatibility during migration — always returns true now.
   */
  hasAccess: (path: string) => boolean;
}

export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; bg: string }
> = {
  "Platform Admin": {
    label: "Platform Admin",
    color: "#6366F1", // Indigo accent
    bg: "rgba(99,102,241,0.1)",
  },
  "Super Admin": {
    label: "Super Admin",
    color: "#8B5CF6", // Purple accent
    bg: "rgba(139,92,246,0.1)",
  },
  "HR Manager": {
    label: "HR Manager",
    color: "#00B87C", // Green accent
    bg: "rgba(0,184,124,0.1)",
  },
  Finance: {
    label: "Finance",
    color: "#0EA5E9", // Teal/Purple accent
    bg: "rgba(14,165,233,0.1)",
  },
  Manager: {
    label: "Manager",
    color: "#F59E0B", // Amber accent
    bg: "rgba(245,158,11,0.1)",
  },
  Employee: {
    label: "Employee",
    color: "#00B87C", // Green accent
    bg: "rgba(0,184,124,0.1)",
  },
};

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  "Platform Admin": "/platform-admin/dashboard",
  "Super Admin": "/dashboard",
  "HR Manager": "/dashboard",
  Finance: "/dashboard",
  Manager: "/dashboard",
  Employee: "/dashboard",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newUser: User) => {
    setUser(newUser);
    sessionStorage.setItem("user", JSON.stringify(newUser));
    sessionStorage.setItem("isLoggedIn", "true");
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isLoggedIn");
  };

  /**
   * @deprecated — Route access is now controlled by the permission engine.
   * This always returns true; the PermissionGuard in routes.tsx handles
   * the actual permission check. Kept for backward compatibility with
   * any code that still calls hasAccess().
   */
  const hasAccess = () => {
    if (!user) return false;
    // Permission checks are now handled by the permission engine.
    // This function always returns true for authenticated users,
    // because route-level permission gating is done by PermissionGuard.
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, logout, hasAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
