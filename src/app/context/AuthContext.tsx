import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole =
  | "Super Admin"
  | "HR Admin"
  | "Manager"
  | "Employee"
  | "Payroll Admin"
  | "Recruiter";

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
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  "HR Admin": {
    label: "HR Admin",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
  },
  Manager: { label: "Manager", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  Employee: {
    label: "Employee",
    color: "#64748B",
    bg: "rgba(100,116,139,0.1)",
  },
  "Payroll Admin": {
    label: "Payroll Admin",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
  },
  Recruiter: {
    label: "Recruiter",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
  },
};

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  "Super Admin": "/",
  "HR Admin": "/",
  Manager: "/",
  Employee: "/",
  "Payroll Admin": "/payroll",
  Recruiter: "/recruitment",
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
    // Simple path-based access control based on roles
    // In a real app, this would be more complex
    if (user.role === "Super Admin") return true;
    if (user.role === "HR Admin") return true;

    if (user.role === "Employee") {
      const allowed = [
        "/",
        "/attendance",
        "/leave",
        "/expenses",
        "/payroll",
        "/self-service",
        "/reimbursement-history",
        "/expense-policy",
        "/expense-support",
        "/profile",
        "/notifications",
        "/training",
        "/my-documents",
        "/employees",
        "/performance",
        "/schedule",
        "/goals",
        "/documents",
        "/support",
        "/hr-requests",
        "/regularization-history",
        "/my-notifications",
      ];
      return allowed.some((p) => path === p || path.startsWith(p + "/"));
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
