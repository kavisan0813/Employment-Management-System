export type UserRole =
  | "Platform Admin"
  | "Super Admin"
  | "HR Manager"
  | "Finance"
  | "IT"
  | "Manager"
  | "Team Lead"
  | "Employee";

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
  IT: {
    label: "IT",
    color: "#0EA5E9",
    bg: "rgba(14,165,233,0.1)",
  },
  Manager: {
    label: "Manager",
    color: "#F59E0B", // Amber accent
    bg: "rgba(245,158,11,0.1)",
  },
  "Team Lead": {
    label: "Team Lead",
    color: "#3B82F6", // Blue accent
    bg: "rgba(59,130,246,0.1)",
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
  IT: "/dashboard",
  Manager: "/dashboard",
  "Team Lead": "/dashboard",
  Employee: "/dashboard",
};
