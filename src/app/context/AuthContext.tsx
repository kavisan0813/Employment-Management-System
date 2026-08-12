import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import type { RoleAssignment } from "../shared/permission-engine/roles";
import { UserRole } from "./auth.config";
export type { UserRole };

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

  const value = useMemo(
    () => ({ user, isLoggedIn: !!user, login, logout, hasAccess }),
    [user, login, logout, hasAccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
