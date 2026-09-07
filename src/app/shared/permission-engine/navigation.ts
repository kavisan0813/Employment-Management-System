/**
 * ─────────────────────────────────────────────────────────────────
 *  DATA-DRIVEN SIDEBAR NAVIGATION
 *
 *  One flat navigation tree. Each item declares what permission
 *  and feature key is required to see it. The Sidebar iterates this
 *  tree and renders only the items that pass both permission and
 *  feature checks.
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
  Building2,
  type LucideIcon,
} from "lucide-react";
import { P } from "./permissions";
import { FEATURE_KEYS, type FeatureKey } from "../feature-engine/featureRegistry";

// ── Types ───────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  path: string;
  /** Permission key(s) required to see this item. If empty, always visible. */
  requiredPermission?: string | string[];
  /** Feature key required to see this item */
  featureKey?: FeatureKey;
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
  /** Feature key required for the entire group */
  featureKey?: FeatureKey;
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
 * Evaluates both Permission AND Feature enablement.
 */
export function filterNavigation(
  groups: NavGroup[],
  userPermissions: Set<string>,
  isFeatureEnabled?: (featureKey: string) => boolean,
): NavGroup[] {
  return groups
    .map((group) => {
      // Check group-level feature & permission
      if (
        group.featureKey &&
        isFeatureEnabled &&
        !isFeatureEnabled(group.featureKey)
      ) {
        return null;
      }
      if (
        group.requiredPermission &&
        !hasRequiredPermission(userPermissions, group.requiredPermission)
      ) {
        return null;
      }

      // If group has sub-items, filter them
      if (group.items) {
        const filteredItems = group.items.filter((item) => {
          if (
            item.featureKey &&
            isFeatureEnabled &&
            !isFeatureEnabled(item.featureKey)
          ) {
            return false;
          }
          return hasRequiredPermission(userPermissions, item.requiredPermission);
        });
        // If no items remain visible, hide the entire group
        if (filteredItems.length === 0) return null;
        return { ...group, items: filteredItems };
      }

      return group;
    })
    .filter((g): g is NavGroup => g !== null);
}

// ── The full navigation tree ────────────────────────────────────

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
        featureKey: FEATURE_KEYS.REPORTS,
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
        featureKey: FEATURE_KEYS.EMPLOYEES,
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
        featureKey: FEATURE_KEYS.DEPARTMENTS,
        requiredPermission: [
          P.DEPARTMENTS_FULL,
          P.DEPARTMENTS_MANAGE,
          P.DEPARTMENTS_VIEW,
        ],
      },
      {
        label: "Recruitment",
        path: "/recruitment",
        featureKey: FEATURE_KEYS.RECRUITMENT,
        requiredPermission: [
          P.RECRUITMENT_FULL,
          P.RECRUITMENT_MANAGE,
          P.RECRUITMENT_INTERVIEW,
        ],
      },
      {
        label: "Onboarding",
        path: "/onboarding",
        featureKey: FEATURE_KEYS.ONBOARDING,
        requiredPermission: [P.ONBOARDING_FULL, P.ONBOARDING_MANAGE],
      },
      {
        label: "Offboarding",
        path: "/offboarding",
        featureKey: FEATURE_KEYS.OFFBOARDING,
        requiredPermission: [
          P.OFFBOARDING_FULL,
          P.OFFBOARDING_MANAGE,
          P.OFFBOARDING_VIEW,
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
        featureKey: FEATURE_KEYS.ATTENDANCE,
        requiredPermission: [
          P.ATTENDANCE_FULL,
          P.ATTENDANCE_MANAGE,
          P.ATTENDANCE_APPROVE,
          P.ATTENDANCE_APPROVE_TEAM,
          P.ATTENDANCE_APPROVE_DEPT,
        ],
      },
      {
        label: "Schedule Management",
        path: "/schedule",
        featureKey: FEATURE_KEYS.SCHEDULE,
        requiredPermission: [
          P.SCHEDULE_FULL,
          P.SCHEDULE_MANAGE,
          P.SCHEDULE_VIEW_TEAM,
        ],
      },
      {
        label: "Leave Management",
        path: "/leave",
        featureKey: FEATURE_KEYS.LEAVE,
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
        featureKey: FEATURE_KEYS.PERFORMANCE,
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
        featureKey: FEATURE_KEYS.TRAINING,
        requiredPermission: [
          P.TRAINING_FULL,
          P.TRAINING_MANAGE,
          P.TRAINING_ASSIGN,
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
        featureKey: FEATURE_KEYS.PAYROLL,
        requiredPermission: [P.PAYROLL_FULL, P.PAYROLL_VIEW, P.PAYROLL_MANAGE],
      },
      {
        label: "Expenses",
        path: "/expenses",
        featureKey: FEATURE_KEYS.EXPENSES,
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
        featureKey: FEATURE_KEYS.ASSETS,
        requiredPermission: [
          P.ASSETS_FULL,
          P.ASSETS_MANAGE,
          P.ASSETS_VIEW_COST,
          P.ASSETS_VIEW,
        ],
      },
      {
        label: "Finance Clearance & F&F",
        path: "/finance/settlements",
        featureKey: FEATURE_KEYS.SETTLEMENTS,
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
        featureKey: FEATURE_KEYS.PERFORMANCE,
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
        featureKey: FEATURE_KEYS.AUDIT_LOGS,
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
        featureKey: FEATURE_KEYS.MANAGE_ACCOUNT,
        requiredPermission: [P.MANAGE_ACCOUNT_VIEW, P.MANAGE_ACCOUNT_MANAGE],
      },
      {
        label: "Organization Management",
        path: "/admin/organizations",
        featureKey: FEATURE_KEYS.MANAGE_ACCOUNT,
        requiredPermission: [P.MANAGE_ACCOUNT_MANAGE, P.MANAGE_ACCOUNT_VIEW],
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
        featureKey: FEATURE_KEYS.ATTENDANCE,
        requiredPermission: P.ATTENDANCE_SELF,
      },
      {
        label: "My Leaves",
        path: "/employee/leave",
        featureKey: FEATURE_KEYS.LEAVE,
        requiredPermission: [P.LEAVE_SELF, P.LEAVE_APPLY],
      },
      {
        label: "My Payslips",
        path: "/payslips",
        featureKey: FEATURE_KEYS.PAYROLL,
        requiredPermission: P.PAYROLL_PAYSLIPS,
      },
      {
        label: "My Schedule",
        path: "/employee/schedule",
        featureKey: FEATURE_KEYS.SCHEDULE,
        requiredPermission: [P.SCHEDULE_SELF, P.SCHEDULE_VIEW],
      },
      {
        label: "My Performance",
        path: "/employee/performance",
        featureKey: FEATURE_KEYS.PERFORMANCE,
        requiredPermission: P.PERFORMANCE_SELF,
      },
      {
        label: "My Training",
        path: "/training",
        featureKey: FEATURE_KEYS.TRAINING,
        requiredPermission: P.TRAINING_LEARN,
      },
      {
        label: "My Expenses",
        path: "/expenses",
        featureKey: FEATURE_KEYS.EXPENSES,
        requiredPermission: P.EXPENSES_SUBMIT,
      },
      {
        label: "My Assets",
        path: "/my-assets",
        featureKey: FEATURE_KEYS.ASSETS,
        requiredPermission: P.ASSETS_SELF,
      },
      {
        label: "My Goals",
        path: "/goals",
        featureKey: FEATURE_KEYS.GOALS,
        requiredPermission: [P.GOALS_SELF, P.GOALS_VIEW],
      },
      {
        label: "My Exit",
        path: "/my-exit",
        featureKey: FEATURE_KEYS.OFFBOARDING,
        requiredPermission: P.MY_WORKSPACE_VIEW,
      },
      {
        label: "Support Ticket",
        path: "/support",
        featureKey: FEATURE_KEYS.SUPPORT,
        requiredPermission: P.SUPPORT_SELF,
      },
    ],
  },

  // ━━━ Onboarding Journey (New Joinee) ━━━━━━━━━━━━━━━━━━━━━━━━
  {
    label: "My Journey",
    icon: Sprout,
    featureKey: FEATURE_KEYS.ONBOARDING,
    requiredPermission: P.ONBOARDING_COMPLETE_TASKS,
    items: [
      {
        label: "🌱 My Onboarding",
        path: "/my-onboarding",
        featureKey: FEATURE_KEYS.ONBOARDING,
        requiredPermission: P.ONBOARDING_COMPLETE_TASKS,
      },
      {
        label: "My Training",
        path: "/training",
        featureKey: FEATURE_KEYS.TRAINING,
        requiredPermission: P.TRAINING_LEARN,
      },
    ],
  },
];
