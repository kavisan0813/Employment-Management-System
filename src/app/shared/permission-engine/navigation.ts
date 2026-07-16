/**
 * ─────────────────────────────────────────────────────────────────
 *  DATA-DRIVEN SIDEBAR NAVIGATION
 *
 *  One flat navigation tree. Each item declares what permission
 *  is required to see it. The Sidebar iterates this tree and
 *  renders only the items the user's resolved permissions include.
 *
 *  This replaces the 5 hardcoded `if/else` role blocks that
 *  were previously in Sidebar.tsx.
 * ─────────────────────────────────────────────────────────────────
 */

import {
  Users,
  CalendarCheck,
  IndianRupee,
  Briefcase,
  BarChart3,
  Home,
  Lock,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { P } from "./permissions";

// ── Types ───────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
  /** Permission key(s) required to see this item. If empty, always visible. */
  requiredPermission?: string | string[];
  disabled?: boolean;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  /** If set, group header is a direct link (no sub-items) */
  path?: string;
  /** Sub-items within this group */
  items?: NavItem[];
  /** Permission required for the entire group. If omitted, group is visible if any child item is visible. */
  requiredPermission?: string | string[];
}

// ── Helper: check if a user has a required permission ───────────
export function hasRequiredPermission(
  userPermissions: Set<string>,
  required: string | string[] | undefined,
): boolean {
  if (!required) return true; // no requirement = always visible
  if (typeof required === "string") return userPermissions.has(required);
  // Array: user needs ANY of the listed permissions
  return required.some((p) => userPermissions.has(p));
}

/**
 * Filter the full navigation tree to only items the user can see.
 * Returns a new array with groups/items removed if the user lacks permission.
 */
export function filterNavigation(
  groups: NavGroup[],
  userPermissions: Set<string>,
): NavGroup[] {
  return groups
    .map((group) => {
      // Check group-level permission
      if (
        group.requiredPermission &&
        !hasRequiredPermission(userPermissions, group.requiredPermission)
      ) {
        return null;
      }

      // If group has sub-items, filter them
      if (group.items) {
        const filteredItems = group.items.filter((item) =>
          hasRequiredPermission(userPermissions, item.requiredPermission),
        );
        // If no items remain visible, hide the entire group
        if (filteredItems.length === 0) return null;
        return { ...group, items: filteredItems };
      }

      return group;
    })
    .filter((g): g is NavGroup => g !== null);
}

// ── The full navigation tree ────────────────────────────────────
// Every possible sidebar item for every role, annotated with
// the permission required to see it. The Sidebar component calls
// filterNavigation() with the user's resolved permission set.

export const FULL_NAVIGATION: NavGroup[] = [
  // ━━━ Home ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "Home",
    icon: Home,
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        requiredPermission: P.DASHBOARD_VIEW,
      },
    ],
  },

  // ━━━ Common Pages ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "Common Pages",
    icon: Lock,
    items: [
      {
        label: "Roles & Permissions",
        path: "/roles-permissions",
        requiredPermission: [P.ROLES_VIEW, P.ROLES_MANAGE, P.ROLES_FULL],
      },
    ],
  },

  // ━━━ Reports & Analytics ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "Reports",
    icon: BarChart3,
    items: [
      {
        label: "Reports & Analytics",
        path: "/reports",
        requiredPermission: [
          P.REPORTS_ALL,
          P.REPORTS_ORG,
          P.REPORTS_HR,
          P.REPORTS_FINANCE,
          P.REPORTS_TEAM,
          P.REPORTS_DEPT,
          P.REPORTS_VIEW,
        ],
      },
    ],
  },

  // ━━━ Team Management ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "Team Management",
    icon: Users,
    items: [
      {
        label: "Employees",
        path: "/employees",
        requiredPermission: [
          P.EMPLOYEES_FULL,
          P.EMPLOYEES_MANAGE,
          P.EMPLOYEES_VIEW,
          P.EMPLOYEES_VIEW_TEAM,
          P.EMPLOYEES_VIEW_DEPT,
        ],
      },
      {
        label: "Departments",
        path: "/departments",
        requiredPermission: [
          P.DEPARTMENTS_FULL,
          P.DEPARTMENTS_MANAGE,
          P.DEPARTMENTS_VIEW,
        ],
      },
      {
        label: "Recruitment",
        path: "/recruitment",
        requiredPermission: [
          P.RECRUITMENT_FULL,
          P.RECRUITMENT_MANAGE,
          P.RECRUITMENT_INTERVIEW,
        ],
      },
      {
        label: "Onboarding",
        path: "/onboarding",
        requiredPermission: [
          P.ONBOARDING_FULL,
          P.ONBOARDING_MANAGE,
        ],
      },
      {
        label: "Offboarding",
        path: "/offboarding",
        requiredPermission: [
          P.OFFBOARDING_FULL,
          P.OFFBOARDING_MANAGE,
        ],
      },
    ],
  },

  // ━━━ HR Operations ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "HR Operations",
    icon: CalendarCheck,
    items: [
      {
        label: "Attendance",
        path: "/attendance",
        requiredPermission: [
          P.ATTENDANCE_FULL,
          P.ATTENDANCE_MANAGE,
          P.ATTENDANCE_APPROVE,
          P.ATTENDANCE_APPROVE_TEAM,
          P.ATTENDANCE_APPROVE_DEPT,
        ],
      },
      {
        label: "Schedule",
        path: "/schedule",
        requiredPermission: [
          P.SCHEDULE_FULL,
          P.SCHEDULE_MANAGE,
          P.SCHEDULE_VIEW_TEAM,
        ],
      },
      {
        label: "Leave Management",
        path: "/leave",
        requiredPermission: [
          P.LEAVE_FULL,
          P.LEAVE_MANAGE,
          P.LEAVE_APPROVE,
          P.LEAVE_APPROVE_TEAM,
          P.LEAVE_APPROVE_DEPT,
        ],
      },
      {
        label: "Performance",
        path: "/performance",
        requiredPermission: [
          P.PERFORMANCE_FULL,
          P.PERFORMANCE_VIEW,
          P.PERFORMANCE_REVIEW,
          P.PERFORMANCE_REVIEW_TEAM,
          P.PERFORMANCE_REVIEW_DEPT,
        ],
      },
      {
        label: "Training",
        path: "/training",
        requiredPermission: [
          P.TRAINING_FULL,
          P.TRAINING_MANAGE,
          P.TRAINING_ASSIGN,
        ],
      },
      {
        label: "Documents",
        path: "/documents",
        requiredPermission: [
          P.DOCUMENTS_FULL,
          P.DOCUMENTS_MANAGE,
        ],
      },
    ],
  },

  // ━━━ Finance & Payroll ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "Finance & Payroll",
    icon: IndianRupee,
    items: [
      {
        label: "Payroll",
        path: "/payroll",
        requiredPermission: [
          P.PAYROLL_FULL,
          P.PAYROLL_VIEW,
          P.PAYROLL_MANAGE,
        ],
      },
      {
        label: "Expenses",
        path: "/expenses",
        requiredPermission: [
          P.EXPENSES_FULL,
          P.EXPENSES_FINAL_APPROVAL,
          P.EXPENSES_LEVEL_1,
          P.EXPENSES_APPROVE_TEAM,
          P.EXPENSES_APPROVE_DEPT,
          P.EXPENSES_VIEW,
        ],
      },
      {
        label: "Asset Management",
        path: "/asset-management",
        requiredPermission: [
          P.ASSETS_FULL,
          P.ASSETS_MANAGE,
          P.ASSETS_VIEW_COST,
        ],
      },
      {
        label: "Finance Clearance & F&F",
        path: "/finance/settlements",
        requiredPermission: [
          P.OFFBOARDING_FINANCE_MANAGE,
          P.SETTLEMENTS_FULL,
          P.SETTLEMENTS_MANAGE,
          P.SETTLEMENTS_VIEW,
        ],
      },
      {
        label: "Increment & Appraisal",
        path: "/appraisal",
        requiredPermission: [
          P.APPRAISAL_FULL,
          P.APPRAISAL_MANAGE,
          P.APPRAISAL_APPROVE,
          P.APPRAISAL_VIEW,
        ],
      },
      {
        label: "Audit Logs",
        path: "/settings/audit-logs",
        requiredPermission: [P.AUDIT_LOGS_FULL, P.AUDIT_LOGS_VIEW],
      },
    ],
  },

  // ━━━ Account Management (Super Admin) ━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "Account Management",
    icon: Lock,
    items: [
      {
        label: "Manage Account",
        path: "/admin/manage-account",
        requiredPermission: [P.MANAGE_ACCOUNT_VIEW, P.MANAGE_ACCOUNT_MANAGE],
      },
    ],
  },

  // ━━━ My Workspace (Self-Service) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "My Workspace",
    icon: Briefcase,
    requiredPermission: P.MY_WORKSPACE_VIEW,
    items: [
      {
        label: "My Dashboard",
        path: "/dashboard",
        requiredPermission: P.MY_WORKSPACE_VIEW,
      },
      {
        label: "My Attendance",
        path: "/employee/attendance",
        requiredPermission: P.ATTENDANCE_SELF,
      },
      {
        label: "My Leaves",
        path: "/employee/leave",
        requiredPermission: [P.LEAVE_SELF, P.LEAVE_APPLY],
      },
      {
        label: "My Payslips",
        path: "/payslips",
        requiredPermission: P.PAYROLL_PAYSLIPS,
      },
      {
        label: "My Schedule",
        path: "/employee/schedule",
        requiredPermission: [P.SCHEDULE_SELF, P.SCHEDULE_VIEW],
      },
      {
        label: "My Performance",
        path: "/employee/performance",
        requiredPermission: P.PERFORMANCE_SELF,
      },
      {
        label: "My Training",
        path: "/training",
        requiredPermission: P.TRAINING_LEARN,
      },
      {
        label: "My Documents",
        path: "/my-documents",
        requiredPermission: P.DOCUMENTS_SELF,
      },
      {
        label: "My Expenses",
        path: "/expenses",
        requiredPermission: P.EXPENSES_SUBMIT,
      },
      {
        label: "My Assets",
        path: "/my-assets",
        requiredPermission: P.ASSETS_SELF,
      },
      {
        label: "My Goals",
        path: "/goals",
        requiredPermission: [P.GOALS_SELF, P.GOALS_VIEW],
      },
      {
        label: "My Exit",
        path: "/my-exit",
        requiredPermission: P.MY_WORKSPACE_VIEW,
      },
      {
        label: "My Profile",
        path: "/profile",
        requiredPermission: P.PROFILE_SELF,
      },
      {
        label: "Support Ticket",
        path: "/support",
        requiredPermission: P.SUPPORT_SELF,
      },
    ],
  },

  // ━━━ Onboarding Journey (New Joinee) ━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "My Journey",
    icon: Sprout,
    requiredPermission: P.ONBOARDING_COMPLETE_TASKS,
    items: [
      {
        label: "🌱 My Onboarding",
        path: "/my-onboarding",
        requiredPermission: P.ONBOARDING_COMPLETE_TASKS,
      },
      {
        label: "My Profile",
        path: "/profile",
        requiredPermission: P.PROFILE_SELF,
      },
      {
        label: "My Documents",
        path: "/my-documents",
        requiredPermission: P.DOCUMENTS_SELF,
      },
      {
        label: "My Training",
        path: "/training",
        requiredPermission: P.TRAINING_LEARN,
      },
    ],
  },
];
