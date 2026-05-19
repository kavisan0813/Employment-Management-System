import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole =
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
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasAccess: (path: string) => boolean;
}

export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; bg: string }
> = {
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
  "Super Admin": "/admin/dashboard",
  "HR Manager": "/hr/dashboard",
  Finance: "/finance/dashboard",
  Manager: "/manager/dashboard",
  Employee: "/employee/dashboard",
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

  const hasAccess = (path: string) => {
    if (!user) return false;
    
    // Super Admin has access to everything
    if (user.role === "Super Admin") return true;

    // Normalize path (remove trailing slash)
    const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

    if (user.role === "HR Manager") {
      const restricted = ["/settings/security", "/settings/integrations", "/settings/roles"];
      return !restricted.some(r => normalizedPath.startsWith(r));
    }

    if (user.role === "Finance") {
      const allowed = [
        "/",
        "/finance/dashboard",
        "/payroll",
        "/appraisal", // Increment approvals
        "/expenses",
        "/reports",
        "/attendance",
        "/leave",
        "/payslips",
        "/my-documents",
        "/employee/dashboard",
        "/employees", // View only handled in UI
        "/profile",
        "/settings",
        "/performance",
        "/goals",
        "/support",
      ];
      return allowed.some(p => normalizedPath === p || normalizedPath.startsWith(p + "/"));
    }

    if (user.role === "Manager") {
      const allowed = [
        "/",
        "/manager/dashboard",
        "/manager/my-dashboard",
        "/manager/my-attendance",
        "/manager/my-leaves",
        "/manager/my-payslips",
        "/manager/my-documents",
        "/manager/my-expenses",
        "/manager/my-goals",
        "/manager/my-performance",
        "/manager/notifications",
        "/manager/announcements",
        "/manager/directory",
        "/manager/support",
        "/manager/settings",
        "/employees", // My Team handled in UI
        "/attendance", // Team attendance
        "/schedule", // Team schedule
        "/leave", // Leave approvals
        "/performance", // Team performance
        "/appraisal", // Team appraisal
        "/training", // Assign training
        "/expenses", // Team expenses
        "/employee/dashboard",
        "/payslips",
        "/my-documents",
        "/goals",
        "/profile",
        "/support",
      ];
      return allowed.some(p => normalizedPath === p || normalizedPath.startsWith(p + "/"));
    }

    if (user.role === "Employee") {
      const allowed = [
        "/",
        "/employee/dashboard",
        "/profile",
        "/attendance",
        "/leave",
        "/payslips",
        "/my-documents",
        "/expenses",
        "/goals",
        "/performance",
        "/schedule",
        "/training",
        "/notifications",
        "/employees", // Team Directory (view only)
        "/support",
      ];
      return allowed.some(p => normalizedPath === p || normalizedPath.startsWith(p + "/"));
    }

    return true; // Default allow for demo
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
