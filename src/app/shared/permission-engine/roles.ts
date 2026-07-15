/**
 * ─────────────────────────────────────────────────────────────────
 *  ROLE TEMPLATES & ROLE ASSIGNMENTS
 *
 *  Defines the default permission set for each system role.
 *  In production these come from the `roles` + `role_permissions`
 *  + `user_role_assignments` tables. For the frontend demo they
 *  are seeded as static data here.
 *
 *  Key types:
 *  - RoleTemplate: a named role with its default permission keys
 *  - RoleAssignment: links a user to a role at a specific scope
 *  - ScopeType: how broadly the assignment applies
 * ─────────────────────────────────────────────────────────────────
 */

import { P } from "./permissions";

// ── Scope types ─────────────────────────────────────────────────
export type ScopeType = "organization" | "branch" | "department" | "team" | "self";

// ── Role assignment (mirrors user_role_assignments table) ───────
export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string; // references a RoleTemplate.id
  scopeType: ScopeType;
  scopeId: string | null; // null when scopeType === "organization"
  isActive: boolean;
  grantedAt: string;
  revokedAt: string | null;
}

// ── Role template (mirrors roles + role_permissions tables) ─────
export interface RoleTemplate {
  id: string;
  name: string;
  isSystemRole: boolean;
  /** The set of permission keys this role grants by default */
  permissions: readonly string[];
  /** Position in approval hierarchy (lower = higher authority) */
  hierarchyLevel: number;
}

// ── System role IDs (stable identifiers) ────────────────────────
export const ROLE_IDS = {
  PLATFORM_ADMIN: "role_platform_admin",
  SUPER_ADMIN: "role_super_admin",
  HR_MANAGER: "role_hr_manager",
  FINANCE_MANAGER: "role_finance_manager",
  DEPT_MANAGER: "role_dept_manager",
  TEAM_LEAD: "role_team_lead",
  EMPLOYEE: "role_employee",
} as const;

export type SystemRoleId = (typeof ROLE_IDS)[keyof typeof ROLE_IDS];

// ── Default role templates ──────────────────────────────────────
// These mirror the Module × Role Permission Matrix from the arch doc.
// In production, this seed data lives in the database.

export const ROLE_TEMPLATES: Record<SystemRoleId, RoleTemplate> = {
  /* ─── Platform Admin ─── */
  [ROLE_IDS.PLATFORM_ADMIN]: {
    id: ROLE_IDS.PLATFORM_ADMIN,
    name: "Platform Admin",
    isSystemRole: true,
    hierarchyLevel: 0,
    permissions: [
      P.PLATFORM_ADMIN_FULL,
      P.DASHBOARD_VIEW,
      P.EMPLOYEES_VIEW,
      P.DEPARTMENTS_VIEW,
      P.REPORTS_ANALYTICS,
      P.SETTINGS_FULL,
    ],
  },

  /* ─── Super Admin (Organization Owner) ─── */
  [ROLE_IDS.SUPER_ADMIN]: {
    id: ROLE_IDS.SUPER_ADMIN,
    name: "Super Admin",
    isSystemRole: true,
    hierarchyLevel: 1,
    permissions: [
      // Dashboard
      P.DASHBOARD_VIEW,
      // Employees — full
      P.EMPLOYEES_FULL,
      P.EMPLOYEES_VIEW,
      P.EMPLOYEES_MANAGE,
      P.EMPLOYEES_CREATE,
      // Departments — full
      P.DEPARTMENTS_FULL,
      P.DEPARTMENTS_VIEW,
      P.DEPARTMENTS_MANAGE,
      // Recruitment — full
      P.RECRUITMENT_FULL,
      P.RECRUITMENT_MANAGE,
      // Onboarding — full
      P.ONBOARDING_FULL,
      P.ONBOARDING_MANAGE,
      // Offboarding — full
      P.OFFBOARDING_FULL,
      P.OFFBOARDING_MANAGE,
      // Attendance — full
      P.ATTENDANCE_FULL,
      P.ATTENDANCE_VIEW,
      P.ATTENDANCE_MANAGE,
      P.ATTENDANCE_APPROVE,
      // Leave — full
      P.LEAVE_FULL,
      P.LEAVE_VIEW,
      P.LEAVE_MANAGE,
      P.LEAVE_APPROVE,
      // Performance — full
      P.PERFORMANCE_FULL,
      P.PERFORMANCE_VIEW,
      P.PERFORMANCE_REVIEW,
      // Training — full
      P.TRAINING_FULL,
      P.TRAINING_MANAGE,
      // Payroll — view
      P.PAYROLL_VIEW,
      // Expenses — view
      P.EXPENSES_VIEW,
      P.EXPENSES_FULL,
      // Assets — full
      P.ASSETS_FULL,
      P.ASSETS_VIEW,
      P.ASSETS_MANAGE,
      // Reports — all
      P.REPORTS_ALL,
      P.REPORTS_ORG,
      P.REPORTS_VIEW,
      // Documents — full
      P.DOCUMENTS_FULL,
      P.DOCUMENTS_VIEW,
      P.DOCUMENTS_MANAGE,
      // Settings — org-level
      P.SETTINGS_FULL,
      P.SETTINGS_MANAGE,
      // Schedule — full
      P.SCHEDULE_FULL,
      P.SCHEDULE_VIEW,
      P.SCHEDULE_MANAGE,
      // Appraisal — full
      P.APPRAISAL_FULL,
      P.APPRAISAL_VIEW,
      P.APPRAISAL_MANAGE,
      // Settlements — full
      P.SETTLEMENTS_FULL,
      P.SETTLEMENTS_VIEW,
      P.SETTLEMENTS_MANAGE,
      // Audit
      P.AUDIT_LOGS_FULL,
      P.AUDIT_LOGS_VIEW,
      // Notifications
      P.NOTIFICATIONS_MANAGE,
      P.NOTIFICATIONS_VIEW,
      // Announcements
      P.ANNOUNCEMENTS_MANAGE,
      P.ANNOUNCEMENTS_VIEW,
      // Support
      P.SUPPORT_VIEW,
      P.SUPPORT_SELF,
      // Goals
      P.GOALS_MANAGE,
      P.GOALS_VIEW,
      // Directory
      P.DIRECTORY_MANAGE,
      P.DIRECTORY_VIEW,
      // Profile
      P.PROFILE_VIEW,
      P.PROFILE_SELF,
      P.PROFILE_EDIT,
      // Manage Account
      P.MANAGE_ACCOUNT_VIEW,
      P.MANAGE_ACCOUNT_MANAGE,
    ],
  },

  /* ─── HR Manager ─── */
  [ROLE_IDS.HR_MANAGER]: {
    id: ROLE_IDS.HR_MANAGER,
    name: "HR Manager",
    isSystemRole: true,
    hierarchyLevel: 2,
    permissions: [
      P.DASHBOARD_VIEW,
      // Employees
      P.EMPLOYEES_VIEW,
      P.EMPLOYEES_MANAGE,
      P.EMPLOYEES_CREATE,
      // Departments
      P.DEPARTMENTS_VIEW,
      // Recruitment
      P.RECRUITMENT_FULL,
      P.RECRUITMENT_MANAGE,
      // Onboarding
      P.ONBOARDING_FULL,
      P.ONBOARDING_MANAGE,
      // Offboarding
      P.OFFBOARDING_MANAGE,
      // Attendance
      P.ATTENDANCE_VIEW,
      P.ATTENDANCE_MANAGE,
      P.ATTENDANCE_APPROVE,
      // Leave
      P.LEAVE_MANAGE,
      P.LEAVE_APPROVE,
      P.LEAVE_VIEW,
      // Performance
      P.PERFORMANCE_VIEW,
      P.PERFORMANCE_REVIEW,
      // Training
      P.TRAINING_MANAGE,
      // Payroll — view only
      P.PAYROLL_VIEW,
      // Expenses — Level 1
      P.EXPENSES_LEVEL_1,
      P.EXPENSES_VIEW,
      // Assets
      P.ASSETS_ASSIGN,
      P.ASSETS_VIEW,
      // Reports — HR
      P.REPORTS_HR,
      P.REPORTS_VIEW,
      // Documents
      P.DOCUMENTS_MANAGE,
      P.DOCUMENTS_VIEW,
      // Settings — profile
      P.SETTINGS_SELF,
      // Schedule
      P.SCHEDULE_MANAGE,
      P.SCHEDULE_VIEW,
      // Appraisal — view
      P.APPRAISAL_VIEW,
      // Notifications
      P.NOTIFICATIONS_MANAGE,
      P.NOTIFICATIONS_VIEW,
      // Announcements
      P.ANNOUNCEMENTS_MANAGE,
      P.ANNOUNCEMENTS_VIEW,
      // Support
      P.SUPPORT_VIEW,
      P.SUPPORT_SELF,
      // Goals
      P.GOALS_VIEW,
      // Directory
      P.DIRECTORY_VIEW,
      // Profile
      P.PROFILE_VIEW,
      P.PROFILE_SELF,
      // My Workspace
      P.MY_WORKSPACE_VIEW,
    ],
  },

  /* ─── Finance Manager ─── */
  [ROLE_IDS.FINANCE_MANAGER]: {
    id: ROLE_IDS.FINANCE_MANAGER,
    name: "Finance Manager",
    isSystemRole: true,
    hierarchyLevel: 2,
    permissions: [
      P.DASHBOARD_VIEW,
      // Employees — view
      P.EMPLOYEES_VIEW,
      // Departments — view
      P.DEPARTMENTS_VIEW,
      // Onboarding — finance setup
      P.ONBOARDING_FINANCE_SETUP,
      // Attendance — view
      P.ATTENDANCE_VIEW,
      P.ATTENDANCE_SELF,
      // Leave — view
      P.LEAVE_VIEW,
      P.LEAVE_SELF,
      P.LEAVE_APPLY,
      // Performance — view
      P.PERFORMANCE_VIEW,
      P.PERFORMANCE_SELF,
      // Payroll — full
      P.PAYROLL_FULL,
      P.PAYROLL_VIEW,
      P.PAYROLL_MANAGE,
      P.PAYROLL_PAYSLIPS,
      // Expenses — final approval
      P.EXPENSES_FINAL_APPROVAL,
      P.EXPENSES_VIEW,
      P.EXPENSES_SUBMIT,
      // Assets — view cost
      P.ASSETS_VIEW_COST,
      P.ASSETS_VIEW,
      // Reports — finance
      P.REPORTS_FINANCE,
      P.REPORTS_VIEW,
      // Documents — self
      P.DOCUMENTS_SELF,
      P.DOCUMENTS_VIEW,
      // Settings — profile
      P.SETTINGS_SELF,
      // Schedule — self
      P.SCHEDULE_SELF,
      P.SCHEDULE_VIEW,
      // Appraisal — finance approvals
      P.APPRAISAL_APPROVE,
      P.APPRAISAL_VIEW,
      // Settlements — full
      P.SETTLEMENTS_FULL,
      P.SETTLEMENTS_VIEW,
      P.SETTLEMENTS_MANAGE,
      // Audit
      P.AUDIT_LOGS_VIEW,
      // Notifications
      P.NOTIFICATIONS_VIEW,
      // Support
      P.SUPPORT_SELF,
      // Goals
      P.GOALS_SELF,
      P.GOALS_VIEW,
      // Directory
      P.DIRECTORY_VIEW,
      // Profile
      P.PROFILE_VIEW,
      P.PROFILE_SELF,
      // My Workspace
      P.MY_WORKSPACE_VIEW,
    ],
  },

  /* ─── Department Manager / Team Lead ─── */
  [ROLE_IDS.DEPT_MANAGER]: {
    id: ROLE_IDS.DEPT_MANAGER,
    name: "Manager",
    isSystemRole: true,
    hierarchyLevel: 3,
    permissions: [
      P.DASHBOARD_VIEW,
      // Employees — team view
      P.EMPLOYEES_VIEW_TEAM,
      P.EMPLOYEES_VIEW,
      // Departments — own dept
      P.DEPARTMENTS_VIEW,
      // Recruitment — interview
      P.RECRUITMENT_INTERVIEW,
      // Attendance — approve team
      P.ATTENDANCE_APPROVE_TEAM,
      P.ATTENDANCE_SELF,
      P.ATTENDANCE_VIEW,
      // Leave — approve team / recommend
      P.LEAVE_APPROVE_TEAM,
      P.LEAVE_RECOMMEND,
      P.LEAVE_SELF,
      P.LEAVE_APPLY,
      P.LEAVE_VIEW,
      // Performance — review team
      P.PERFORMANCE_REVIEW_TEAM,
      P.PERFORMANCE_SELF,
      P.PERFORMANCE_VIEW,
      // Training — assign / recommend
      P.TRAINING_ASSIGN,
      P.TRAINING_RECOMMEND,
      P.TRAINING_LEARN,
      // Expenses — approve team
      P.EXPENSES_APPROVE_TEAM,
      P.EXPENSES_SUBMIT,
      P.EXPENSES_VIEW,
      // Assets — view team
      P.ASSETS_VIEW_TEAM,
      P.ASSETS_VIEW,
      P.ASSETS_SELF,
      // Reports — team
      P.REPORTS_TEAM,
      P.REPORTS_VIEW,
      // Documents — self
      P.DOCUMENTS_SELF,
      // Settings — profile
      P.SETTINGS_SELF,
      // Schedule — team
      P.SCHEDULE_VIEW_TEAM,
      P.SCHEDULE_SELF,
      P.SCHEDULE_VIEW,
      // Appraisal — team
      P.APPRAISAL_VIEW,
      P.APPRAISAL_MANAGE,
      // Notifications
      P.NOTIFICATIONS_VIEW,
      // Announcements
      P.ANNOUNCEMENTS_VIEW,
      // Support
      P.SUPPORT_SELF,
      // Goals
      P.GOALS_SELF,
      P.GOALS_MANAGE,
      P.GOALS_VIEW,
      // Directory
      P.DIRECTORY_VIEW,
      // Profile
      P.PROFILE_VIEW,
      P.PROFILE_SELF,
      // My Workspace
      P.MY_WORKSPACE_VIEW,
      // Onboarding — team view
      P.ONBOARDING_MANAGE,
      // Offboarding — exit tasks
      P.OFFBOARDING_MANAGE,
      // Payslips
      P.PAYROLL_PAYSLIPS,
    ],
  },

  /* ─── Team Lead (alias — uses same as dept_manager for now) ─── */
  [ROLE_IDS.TEAM_LEAD]: {
    id: ROLE_IDS.TEAM_LEAD,
    name: "Team Lead",
    isSystemRole: true,
    hierarchyLevel: 4,
    permissions: [
      P.DASHBOARD_VIEW,
      P.EMPLOYEES_VIEW_TEAM,
      P.EMPLOYEES_VIEW,
      P.ATTENDANCE_APPROVE_TEAM,
      P.ATTENDANCE_SELF,
      P.ATTENDANCE_VIEW,
      P.LEAVE_RECOMMEND,
      P.LEAVE_SELF,
      P.LEAVE_APPLY,
      P.LEAVE_VIEW,
      P.PERFORMANCE_REVIEW_TEAM,
      P.PERFORMANCE_SELF,
      P.PERFORMANCE_VIEW,
      P.TRAINING_RECOMMEND,
      P.TRAINING_LEARN,
      P.EXPENSES_APPROVE_TEAM,
      P.EXPENSES_SUBMIT,
      P.ASSETS_VIEW_TEAM,
      P.ASSETS_SELF,
      P.REPORTS_TEAM,
      P.REPORTS_VIEW,
      P.DOCUMENTS_SELF,
      P.SETTINGS_SELF,
      P.SCHEDULE_VIEW_TEAM,
      P.SCHEDULE_SELF,
      P.SCHEDULE_VIEW,
      P.NOTIFICATIONS_VIEW,
      P.SUPPORT_SELF,
      P.GOALS_SELF,
      P.GOALS_VIEW,
      P.DIRECTORY_VIEW,
      P.PROFILE_VIEW,
      P.PROFILE_SELF,
      P.MY_WORKSPACE_VIEW,
      P.PAYROLL_PAYSLIPS,
    ],
  },

  /* ─── Employee ─── */
  [ROLE_IDS.EMPLOYEE]: {
    id: ROLE_IDS.EMPLOYEE,
    name: "Employee",
    isSystemRole: true,
    hierarchyLevel: 5,
    permissions: [
      P.DASHBOARD_VIEW,
      P.EMPLOYEES_SELF,
      P.ATTENDANCE_SELF,
      P.LEAVE_APPLY,
      P.LEAVE_SELF,
      P.PERFORMANCE_SELF,
      P.TRAINING_LEARN,
      P.EXPENSES_SUBMIT,
      P.ASSETS_SELF,
      P.DOCUMENTS_SELF,
      P.SETTINGS_SELF,
      P.SCHEDULE_SELF,
      P.SCHEDULE_VIEW,
      P.NOTIFICATIONS_VIEW,
      P.SUPPORT_SELF,
      P.GOALS_SELF,
      P.GOALS_VIEW,
      P.DIRECTORY_VIEW,
      P.PROFILE_SELF,
      P.PROFILE_VIEW,
      P.MY_WORKSPACE_VIEW,
      P.PAYROLL_PAYSLIPS,
      P.REPORTS_SELF,
      P.RECRUITMENT_APPLY,
      P.ONBOARDING_COMPLETE_TASKS,
      P.ONBOARDING_SELF,
      P.ANNOUNCEMENTS_VIEW,
    ],
  },
};

// ── Map legacy role names → role IDs ────────────────────────────
// Used during migration to translate the old `user.role` string
// into a role template lookup.
export const LEGACY_ROLE_MAP: Record<string, SystemRoleId> = {
  "Platform Admin": ROLE_IDS.PLATFORM_ADMIN,
  "Super Admin": ROLE_IDS.SUPER_ADMIN,
  "HR Manager": ROLE_IDS.HR_MANAGER,
  Finance: ROLE_IDS.FINANCE_MANAGER,
  Manager: ROLE_IDS.DEPT_MANAGER,
  "Team Lead": ROLE_IDS.TEAM_LEAD,
  Employee: ROLE_IDS.EMPLOYEE,
};

// ── Hierarchy for approval routing ──────────────────────────────
export const ROLE_HIERARCHY: SystemRoleId[] = [
  ROLE_IDS.PLATFORM_ADMIN,
  ROLE_IDS.SUPER_ADMIN,
  ROLE_IDS.HR_MANAGER,
  ROLE_IDS.FINANCE_MANAGER,
  ROLE_IDS.DEPT_MANAGER,
  ROLE_IDS.TEAM_LEAD,
  ROLE_IDS.EMPLOYEE,
];

/**
 * Resolve the effective permission set from a list of role assignments.
 * Takes the union of all permissions from all active role assignments.
 */
export function resolvePermissions(
  assignments: RoleAssignment[],
): Set<string> {
  const permissions = new Set<string>();

  for (const assignment of assignments) {
    if (!assignment.isActive) continue;

    const template = ROLE_TEMPLATES[assignment.roleId as SystemRoleId];
    if (!template) continue;

    for (const perm of template.permissions) {
      permissions.add(perm);
    }
  }

  return permissions;
}

/**
 * Create a mock role assignment for demo/migration purposes.
 * Used to translate the legacy single-role system into multi-role assignments.
 */
export function createMockAssignment(
  userId: string,
  roleId: SystemRoleId,
  scopeType: ScopeType = "organization",
  scopeId: string | null = null,
): RoleAssignment {
  return {
    id: `ra-${roleId}-${userId}`,
    userId,
    roleId,
    scopeType,
    scopeId,
    isActive: true,
    grantedAt: new Date().toISOString(),
    revokedAt: null,
  };
}
