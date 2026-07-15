/**
 * ─────────────────────────────────────────────────────────────────
 *  PERMISSION CATALOG
 *
 *  Every gated action in the application is represented as a
 *  (module, action) pair. No file in the codebase should contain
 *  `role === "HR Manager"` or similar — instead it should check
 *  `usePermission("employees", "manage")`.
 *
 *  Adding a new feature gate = adding one constant here, then one
 *  row in the role-permission seed. Zero new screens required.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Canonical module identifiers ────────────────────────────────
export const MODULES = {
  DASHBOARD: "dashboard",
  EMPLOYEES: "employees",
  DEPARTMENTS: "departments",
  RECRUITMENT: "recruitment",
  ONBOARDING: "onboarding",
  OFFBOARDING: "offboarding",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  PERFORMANCE: "performance",
  TRAINING: "training",
  PAYROLL: "payroll",
  EXPENSES: "expenses",
  ASSETS: "assets",
  REPORTS: "reports",
  DOCUMENTS: "documents",
  SETTINGS: "settings",
  AUDIT_LOGS: "audit_logs",
  SCHEDULE: "schedule",
  APPRAISAL: "appraisal",
  SETTLEMENTS: "settlements",
  NOTIFICATIONS: "notifications",
  SUPPORT: "support",
  ANNOUNCEMENTS: "announcements",
  GOALS: "goals",
  DIRECTORY: "directory",
  PROFILE: "profile",
  MY_WORKSPACE: "my_workspace",
  MANAGE_ACCOUNT: "manage_account",
  PLATFORM_ADMIN: "platform_admin",
  ROLES: "roles",
} as const;

export type ModuleId = (typeof MODULES)[keyof typeof MODULES];

// ── Canonical action identifiers ────────────────────────────────
export const ACTIONS = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  MANAGE: "manage", // full CRUD
  APPROVE: "approve",
  REJECT: "reject",
  EXPORT: "export",
  ASSIGN: "assign",
  SELF: "self", // self-service (own data only)
  FULL: "full", // unrestricted access
  VIEW_TEAM: "view_team",
  VIEW_DEPT: "view_dept",
  APPROVE_TEAM: "approve_team",
  APPROVE_DEPT: "approve_dept",
  REVIEW: "review",
  REVIEW_TEAM: "review_team",
  REVIEW_DEPT: "review_dept",
  RECOMMEND: "recommend",
  APPLY: "apply",
  SUBMIT: "submit",
  LEARN: "learn",
  PAYSLIPS: "payslips",
  FINANCE_SETUP: "finance_setup",
  COMPLETE_TASKS: "complete_tasks",
  INTERVIEW: "interview",
  LEVEL_1: "level_1",
  FINAL_APPROVAL: "final_approval",
  VIEW_COST: "view_cost",
  LIMITED: "limited",
  ANALYTICS: "analytics",
  HR_REPORTS: "hr_reports",
  FINANCE_REPORTS: "finance_reports",
  DEPT_REPORTS: "dept_reports",
  TEAM_REPORTS: "team_reports",
  SELF_REPORTS: "self_reports",
  ORG_REPORTS: "org_reports",
  ALL_REPORTS: "all_reports",
} as const;

export type ActionId = (typeof ACTIONS)[keyof typeof ACTIONS];

// ── Permission key helper ───────────────────────────────────────
/**
 * Produces a stable, comparable key: `"employees:manage"`.
 * This is what gets stored in the resolved permission set.
 */
export function permissionKey(module: string, action: string): string {
  return `${module}:${action}`;
}

// ── Pre-built permission keys (convenience constants) ───────────
// These are the most commonly checked permissions in the UI.
export const P = {
  // Dashboard
  DASHBOARD_VIEW: permissionKey(MODULES.DASHBOARD, ACTIONS.VIEW),

  // Employees
  EMPLOYEES_VIEW: permissionKey(MODULES.EMPLOYEES, ACTIONS.VIEW),
  EMPLOYEES_MANAGE: permissionKey(MODULES.EMPLOYEES, ACTIONS.MANAGE),
  EMPLOYEES_CREATE: permissionKey(MODULES.EMPLOYEES, ACTIONS.CREATE),
  EMPLOYEES_SELF: permissionKey(MODULES.EMPLOYEES, ACTIONS.SELF),
  EMPLOYEES_VIEW_TEAM: permissionKey(MODULES.EMPLOYEES, ACTIONS.VIEW_TEAM),
  EMPLOYEES_VIEW_DEPT: permissionKey(MODULES.EMPLOYEES, ACTIONS.VIEW_DEPT),
  EMPLOYEES_FULL: permissionKey(MODULES.EMPLOYEES, ACTIONS.FULL),

  // Departments
  DEPARTMENTS_VIEW: permissionKey(MODULES.DEPARTMENTS, ACTIONS.VIEW),
  DEPARTMENTS_MANAGE: permissionKey(MODULES.DEPARTMENTS, ACTIONS.MANAGE),
  DEPARTMENTS_FULL: permissionKey(MODULES.DEPARTMENTS, ACTIONS.FULL),

  // Recruitment
  RECRUITMENT_MANAGE: permissionKey(MODULES.RECRUITMENT, ACTIONS.MANAGE),
  RECRUITMENT_FULL: permissionKey(MODULES.RECRUITMENT, ACTIONS.FULL),
  RECRUITMENT_INTERVIEW: permissionKey(MODULES.RECRUITMENT, ACTIONS.INTERVIEW),
  RECRUITMENT_APPLY: permissionKey(MODULES.RECRUITMENT, ACTIONS.APPLY),

  // Onboarding
  ONBOARDING_MANAGE: permissionKey(MODULES.ONBOARDING, ACTIONS.MANAGE),
  ONBOARDING_FULL: permissionKey(MODULES.ONBOARDING, ACTIONS.FULL),
  ONBOARDING_FINANCE_SETUP: permissionKey(MODULES.ONBOARDING, ACTIONS.FINANCE_SETUP),
  ONBOARDING_COMPLETE_TASKS: permissionKey(MODULES.ONBOARDING, ACTIONS.COMPLETE_TASKS),
  ONBOARDING_SELF: permissionKey(MODULES.ONBOARDING, ACTIONS.SELF),

  // Offboarding
  OFFBOARDING_VIEW: permissionKey(MODULES.OFFBOARDING, ACTIONS.VIEW),
  OFFBOARDING_MANAGE: permissionKey(MODULES.OFFBOARDING, ACTIONS.MANAGE),
  OFFBOARDING_FULL: permissionKey(MODULES.OFFBOARDING, ACTIONS.FULL),
  OFFBOARDING_CLEARANCE_MANAGER: "offboarding.clearance.manager",
  OFFBOARDING_CLEARANCE_IT: "offboarding.clearance.it",
  OFFBOARDING_CLEARANCE_FINANCE: "offboarding.clearance.finance",
  OFFBOARDING_CLEARANCE_HR: "offboarding.clearance.hr",
  OFFBOARDING_CLEARANCE_ADMIN: "offboarding.clearance.admin",
  OFFBOARDING_DOCUMENTS_VERIFY: "offboarding.documents.verify",
  OFFBOARDING_FINANCE_MANAGE: "offboarding.finance.manage",
  OFFBOARDING_COMPLETE: "offboarding.complete",

  // Attendance
  ATTENDANCE_VIEW: permissionKey(MODULES.ATTENDANCE, ACTIONS.VIEW),

  // Roles
  ROLES_VIEW: permissionKey(MODULES.ROLES, ACTIONS.VIEW),
  ROLES_MANAGE: permissionKey(MODULES.ROLES, ACTIONS.MANAGE),
  ROLES_FULL: permissionKey(MODULES.ROLES, ACTIONS.FULL),
  ATTENDANCE_MANAGE: permissionKey(MODULES.ATTENDANCE, ACTIONS.MANAGE),
  ATTENDANCE_APPROVE: permissionKey(MODULES.ATTENDANCE, ACTIONS.APPROVE),
  ATTENDANCE_SELF: permissionKey(MODULES.ATTENDANCE, ACTIONS.SELF),
  ATTENDANCE_APPROVE_TEAM: permissionKey(MODULES.ATTENDANCE, ACTIONS.APPROVE_TEAM),
  ATTENDANCE_APPROVE_DEPT: permissionKey(MODULES.ATTENDANCE, ACTIONS.APPROVE_DEPT),
  ATTENDANCE_FULL: permissionKey(MODULES.ATTENDANCE, ACTIONS.FULL),

  // Leave
  LEAVE_MANAGE: permissionKey(MODULES.LEAVE, ACTIONS.MANAGE),
  LEAVE_APPROVE: permissionKey(MODULES.LEAVE, ACTIONS.APPROVE),
  LEAVE_VIEW: permissionKey(MODULES.LEAVE, ACTIONS.VIEW),
  LEAVE_SELF: permissionKey(MODULES.LEAVE, ACTIONS.SELF),
  LEAVE_APPLY: permissionKey(MODULES.LEAVE, ACTIONS.APPLY),
  LEAVE_APPROVE_TEAM: permissionKey(MODULES.LEAVE, ACTIONS.APPROVE_TEAM),
  LEAVE_APPROVE_DEPT: permissionKey(MODULES.LEAVE, ACTIONS.APPROVE_DEPT),
  LEAVE_RECOMMEND: permissionKey(MODULES.LEAVE, ACTIONS.RECOMMEND),
  LEAVE_FULL: permissionKey(MODULES.LEAVE, ACTIONS.FULL),

  // Performance
  PERFORMANCE_VIEW: permissionKey(MODULES.PERFORMANCE, ACTIONS.VIEW),
  PERFORMANCE_REVIEW: permissionKey(MODULES.PERFORMANCE, ACTIONS.REVIEW),
  PERFORMANCE_SELF: permissionKey(MODULES.PERFORMANCE, ACTIONS.SELF),
  PERFORMANCE_REVIEW_TEAM: permissionKey(MODULES.PERFORMANCE, ACTIONS.REVIEW_TEAM),
  PERFORMANCE_REVIEW_DEPT: permissionKey(MODULES.PERFORMANCE, ACTIONS.REVIEW_DEPT),
  PERFORMANCE_FULL: permissionKey(MODULES.PERFORMANCE, ACTIONS.FULL),

  // Training
  TRAINING_MANAGE: permissionKey(MODULES.TRAINING, ACTIONS.MANAGE),
  TRAINING_ASSIGN: permissionKey(MODULES.TRAINING, ACTIONS.ASSIGN),
  TRAINING_RECOMMEND: permissionKey(MODULES.TRAINING, ACTIONS.RECOMMEND),
  TRAINING_LEARN: permissionKey(MODULES.TRAINING, ACTIONS.LEARN),
  TRAINING_FULL: permissionKey(MODULES.TRAINING, ACTIONS.FULL),

  // Payroll
  PAYROLL_VIEW: permissionKey(MODULES.PAYROLL, ACTIONS.VIEW),
  PAYROLL_FULL: permissionKey(MODULES.PAYROLL, ACTIONS.FULL),
  PAYROLL_MANAGE: permissionKey(MODULES.PAYROLL, ACTIONS.MANAGE),
  PAYROLL_PAYSLIPS: permissionKey(MODULES.PAYROLL, ACTIONS.PAYSLIPS),

  // Expenses
  EXPENSES_VIEW: permissionKey(MODULES.EXPENSES, ACTIONS.VIEW),
  EXPENSES_SUBMIT: permissionKey(MODULES.EXPENSES, ACTIONS.SUBMIT),
  EXPENSES_APPROVE: permissionKey(MODULES.EXPENSES, ACTIONS.APPROVE),
  EXPENSES_APPROVE_TEAM: permissionKey(MODULES.EXPENSES, ACTIONS.APPROVE_TEAM),
  EXPENSES_APPROVE_DEPT: permissionKey(MODULES.EXPENSES, ACTIONS.APPROVE_DEPT),
  EXPENSES_LEVEL_1: permissionKey(MODULES.EXPENSES, ACTIONS.LEVEL_1),
  EXPENSES_FINAL_APPROVAL: permissionKey(MODULES.EXPENSES, ACTIONS.FINAL_APPROVAL),
  EXPENSES_FULL: permissionKey(MODULES.EXPENSES, ACTIONS.FULL),

  // Assets
  ASSETS_VIEW: permissionKey(MODULES.ASSETS, ACTIONS.VIEW),
  ASSETS_MANAGE: permissionKey(MODULES.ASSETS, ACTIONS.MANAGE),
  ASSETS_ASSIGN: permissionKey(MODULES.ASSETS, ACTIONS.ASSIGN),
  ASSETS_SELF: permissionKey(MODULES.ASSETS, ACTIONS.SELF),
  ASSETS_VIEW_COST: permissionKey(MODULES.ASSETS, ACTIONS.VIEW_COST),
  ASSETS_VIEW_TEAM: permissionKey(MODULES.ASSETS, ACTIONS.VIEW_TEAM),
  ASSETS_VIEW_DEPT: permissionKey(MODULES.ASSETS, ACTIONS.VIEW_DEPT),
  ASSETS_FULL: permissionKey(MODULES.ASSETS, ACTIONS.FULL),

  // Reports
  REPORTS_VIEW: permissionKey(MODULES.REPORTS, ACTIONS.VIEW),
  REPORTS_ALL: permissionKey(MODULES.REPORTS, ACTIONS.ALL_REPORTS),
  REPORTS_ORG: permissionKey(MODULES.REPORTS, ACTIONS.ORG_REPORTS),
  REPORTS_HR: permissionKey(MODULES.REPORTS, ACTIONS.HR_REPORTS),
  REPORTS_FINANCE: permissionKey(MODULES.REPORTS, ACTIONS.FINANCE_REPORTS),
  REPORTS_DEPT: permissionKey(MODULES.REPORTS, ACTIONS.DEPT_REPORTS),
  REPORTS_TEAM: permissionKey(MODULES.REPORTS, ACTIONS.TEAM_REPORTS),
  REPORTS_SELF: permissionKey(MODULES.REPORTS, ACTIONS.SELF_REPORTS),
  REPORTS_ANALYTICS: permissionKey(MODULES.REPORTS, ACTIONS.ANALYTICS),

  // Documents
  DOCUMENTS_MANAGE: permissionKey(MODULES.DOCUMENTS, ACTIONS.MANAGE),
  DOCUMENTS_SELF: permissionKey(MODULES.DOCUMENTS, ACTIONS.SELF),
  DOCUMENTS_VIEW: permissionKey(MODULES.DOCUMENTS, ACTIONS.VIEW),
  DOCUMENTS_FULL: permissionKey(MODULES.DOCUMENTS, ACTIONS.FULL),

  // Settings
  SETTINGS_MANAGE: permissionKey(MODULES.SETTINGS, ACTIONS.MANAGE),
  SETTINGS_LIMITED: permissionKey(MODULES.SETTINGS, ACTIONS.LIMITED),
  SETTINGS_SELF: permissionKey(MODULES.SETTINGS, ACTIONS.SELF),
  SETTINGS_FULL: permissionKey(MODULES.SETTINGS, ACTIONS.FULL),

  // Schedule
  SCHEDULE_MANAGE: permissionKey(MODULES.SCHEDULE, ACTIONS.MANAGE),
  SCHEDULE_SELF: permissionKey(MODULES.SCHEDULE, ACTIONS.SELF),
  SCHEDULE_VIEW: permissionKey(MODULES.SCHEDULE, ACTIONS.VIEW),
  SCHEDULE_VIEW_TEAM: permissionKey(MODULES.SCHEDULE, ACTIONS.VIEW_TEAM),
  SCHEDULE_FULL: permissionKey(MODULES.SCHEDULE, ACTIONS.FULL),

  // Appraisal / Increment
  APPRAISAL_MANAGE: permissionKey(MODULES.APPRAISAL, ACTIONS.MANAGE),
  APPRAISAL_VIEW: permissionKey(MODULES.APPRAISAL, ACTIONS.VIEW),
  APPRAISAL_APPROVE: permissionKey(MODULES.APPRAISAL, ACTIONS.APPROVE),
  APPRAISAL_FULL: permissionKey(MODULES.APPRAISAL, ACTIONS.FULL),

  // F&F Settlements
  SETTLEMENTS_VIEW: permissionKey(MODULES.SETTLEMENTS, ACTIONS.VIEW),
  SETTLEMENTS_MANAGE: permissionKey(MODULES.SETTLEMENTS, ACTIONS.MANAGE),
  SETTLEMENTS_FULL: permissionKey(MODULES.SETTLEMENTS, ACTIONS.FULL),

  // Audit Logs
  AUDIT_LOGS_VIEW: permissionKey(MODULES.AUDIT_LOGS, ACTIONS.VIEW),
  AUDIT_LOGS_FULL: permissionKey(MODULES.AUDIT_LOGS, ACTIONS.FULL),

  // Notifications
  NOTIFICATIONS_VIEW: permissionKey(MODULES.NOTIFICATIONS, ACTIONS.VIEW),
  NOTIFICATIONS_MANAGE: permissionKey(MODULES.NOTIFICATIONS, ACTIONS.MANAGE),

  // Support
  SUPPORT_VIEW: permissionKey(MODULES.SUPPORT, ACTIONS.VIEW),
  SUPPORT_SELF: permissionKey(MODULES.SUPPORT, ACTIONS.SELF),

  // Announcements
  ANNOUNCEMENTS_VIEW: permissionKey(MODULES.ANNOUNCEMENTS, ACTIONS.VIEW),
  ANNOUNCEMENTS_MANAGE: permissionKey(MODULES.ANNOUNCEMENTS, ACTIONS.MANAGE),

  // Goals
  GOALS_VIEW: permissionKey(MODULES.GOALS, ACTIONS.VIEW),
  GOALS_SELF: permissionKey(MODULES.GOALS, ACTIONS.SELF),
  GOALS_MANAGE: permissionKey(MODULES.GOALS, ACTIONS.MANAGE),

  // Directory
  DIRECTORY_VIEW: permissionKey(MODULES.DIRECTORY, ACTIONS.VIEW),
  DIRECTORY_MANAGE: permissionKey(MODULES.DIRECTORY, ACTIONS.MANAGE),

  // Profile
  PROFILE_VIEW: permissionKey(MODULES.PROFILE, ACTIONS.VIEW),
  PROFILE_SELF: permissionKey(MODULES.PROFILE, ACTIONS.SELF),
  PROFILE_EDIT: permissionKey(MODULES.PROFILE, ACTIONS.EDIT),

  // My Workspace (self-service)
  MY_WORKSPACE_VIEW: permissionKey(MODULES.MY_WORKSPACE, ACTIONS.VIEW),

  // Manage Account (Super Admin)
  MANAGE_ACCOUNT_VIEW: permissionKey(MODULES.MANAGE_ACCOUNT, ACTIONS.VIEW),
  MANAGE_ACCOUNT_MANAGE: permissionKey(MODULES.MANAGE_ACCOUNT, ACTIONS.MANAGE),

  // Platform Admin (SaaS owner)
  PLATFORM_ADMIN_FULL: permissionKey(MODULES.PLATFORM_ADMIN, ACTIONS.FULL),
} as const;

export type PermissionKey = (typeof P)[keyof typeof P];
