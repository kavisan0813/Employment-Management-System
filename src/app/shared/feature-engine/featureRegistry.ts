/**
 * ─────────────────────────────────────────────────────────────────
 *  FEATURE REGISTRY
 *
 *  Canonical catalog of all feature keys, module metadata, and
 *  minimum subscription plan entitlements for NexusHR EMS.
 * ─────────────────────────────────────────────────────────────────
 */

export type SubscriptionPlan = "Starter" | "Growth" | "Enterprise";

export type FeatureCategory = "Core" | "Beta" | "Experimental" | "Deprecated";

export interface FeatureDefinition {
  key: string;
  name: string;
  description: string;
  category: FeatureCategory;
  minimumPlan: SubscriptionPlan;
  defaultEnabled: boolean;
  modulePath?: string;
}

/**
 * Plan hierarchy level: Starter (1) < Growth (2) < Enterprise (3)
 */
export const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  Starter: 1,
  Growth: 2,
  Enterprise: 3,
};

/**
 * Helper to check if a plan meets or exceeds the required minimum plan.
 */
export function planMeetsRequirement(
  currentPlan: SubscriptionPlan,
  minimumPlan: SubscriptionPlan,
): boolean {
  return (
    (PLAN_HIERARCHY[currentPlan] ?? 1) >= (PLAN_HIERARCHY[minimumPlan] ?? 1)
  );
}

/**
 * Stable Feature Keys catalog
 */
export const FEATURE_KEYS = {
  // Core Modules (Starter+)
  EMPLOYEES: "employees",
  DEPARTMENTS: "departments",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  DOCUMENTS: "documents",
  DIRECTORY: "directory",
  PROFILE: "profile",
  SUPPORT: "support",

  // Mid-tier Modules (Growth+)
  RECRUITMENT: "recruitment",
  ONBOARDING: "onboarding",
  OFFBOARDING: "offboarding",
  SCHEDULE: "schedule",
  PERFORMANCE: "performance",
  EXPENSES: "expenses",
  ASSETS: "assets",
  REPORTS: "reports",
  ANNOUNCEMENTS: "announcements",
  GOALS: "goals",

  // Enterprise Modules (Enterprise)
  PAYROLL: "payroll",
  TRAINING: "training",
  SETTLEMENTS: "settlements",
  AUDIT_LOGS: "audit_logs",
  MANAGE_ACCOUNT: "manage_account",

  // Advanced / System Capabilities
  AI_SCHEDULING: "ai_scheduling",
  BULK_IMPORT_V2: "bulk_import_v2",
  MFA_ENFORCE_ALL: "mfa_enforce_all",
  ADVANCED_GEO_ANALYTICS: "advanced_geo_analytics",
  CUSTOM_SSO_PORTAL: "custom_sso_portal",
  SLACK_NOTIFS_INTEGRATION: "slack_notifs_integration",
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];

/**
 * Canonical Feature Registry catalog
 */
export const FEATURE_REGISTRY: Record<FeatureKey, FeatureDefinition> = {
  // ── Starter Level Features ─────────────────────────────────────
  [FEATURE_KEYS.EMPLOYEES]: {
    key: FEATURE_KEYS.EMPLOYEES,
    name: "Employee Management",
    description: "Core employee profiles, directory, and organizational structure.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/employees",
  },
  [FEATURE_KEYS.DEPARTMENTS]: {
    key: FEATURE_KEYS.DEPARTMENTS,
    name: "Department Management",
    description: "Department hierarchy and team structure configuration.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/departments",
  },
  [FEATURE_KEYS.ATTENDANCE]: {
    key: FEATURE_KEYS.ATTENDANCE,
    name: "Attendance Tracking",
    description: "Timesheets, clock-in/out records, and attendance logs.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/attendance",
  },
  [FEATURE_KEYS.LEAVE]: {
    key: FEATURE_KEYS.LEAVE,
    name: "Leave & Time Off",
    description: "Leave balances, application submissions, and manager approvals.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/leave",
  },
  [FEATURE_KEYS.DOCUMENTS]: {
    key: FEATURE_KEYS.DOCUMENTS,
    name: "Document Management",
    description: "Employee document storage, verification, and file repository.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/documents",
  },
  [FEATURE_KEYS.DIRECTORY]: {
    key: FEATURE_KEYS.DIRECTORY,
    name: "Company Directory",
    description: "Searchable employee directory and contact cards.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/directory",
  },
  [FEATURE_KEYS.PROFILE]: {
    key: FEATURE_KEYS.PROFILE,
    name: "User Profile & Self Service",
    description: "Personal employee profile management and workspace.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/profile",
  },
  [FEATURE_KEYS.SUPPORT]: {
    key: FEATURE_KEYS.SUPPORT,
    name: "Help & Support Tickets",
    description: "Support ticket creation and helpdesk knowledge base.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
    modulePath: "/support",
  },

  // ── Growth Level Features ──────────────────────────────────────
  [FEATURE_KEYS.RECRUITMENT]: {
    key: FEATURE_KEYS.RECRUITMENT,
    name: "Recruitment & Applicant Tracking",
    description: "Job postings, applicant pipelines, and interview scheduling.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/recruitment",
  },
  [FEATURE_KEYS.ONBOARDING]: {
    key: FEATURE_KEYS.ONBOARDING,
    name: "Employee Onboarding",
    description: "New hire onboarding workflows, task lists, and candidate portals.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/onboarding",
  },
  [FEATURE_KEYS.OFFBOARDING]: {
    key: FEATURE_KEYS.OFFBOARDING,
    name: "Employee Offboarding",
    description: "Exit workflows, department clearances, and document verification.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/offboarding",
  },
  [FEATURE_KEYS.SCHEDULE]: {
    key: FEATURE_KEYS.SCHEDULE,
    name: "Shift & Work Scheduling",
    description: "Roster planning, shift assignments, and coverage scheduling.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/schedule",
  },
  [FEATURE_KEYS.PERFORMANCE]: {
    key: FEATURE_KEYS.PERFORMANCE,
    name: "Performance Reviews & Appraisals",
    description: "Performance review cycles, 360 feedback, and rating rubrics.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/performance",
  },
  [FEATURE_KEYS.EXPENSES]: {
    key: FEATURE_KEYS.EXPENSES,
    name: "Expense Management",
    description: "Employee expense submissions, receipts, and multi-tier approvals.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/expenses",
  },
  [FEATURE_KEYS.ASSETS]: {
    key: FEATURE_KEYS.ASSETS,
    name: "Asset Allocation & Cost Tracking",
    description: "Hardware and asset assignment, inventory, and cost reporting.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/asset-management",
  },
  [FEATURE_KEYS.REPORTS]: {
    key: FEATURE_KEYS.REPORTS,
    name: "HR & Analytics Reports",
    description: "HR, headcount, attendance, and departmental analytics reports.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/reports",
  },
  [FEATURE_KEYS.ANNOUNCEMENTS]: {
    key: FEATURE_KEYS.ANNOUNCEMENTS,
    name: "Company Announcements",
    description: "Broadcast announcements and organizational news banners.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/announcements",
  },
  [FEATURE_KEYS.GOALS]: {
    key: FEATURE_KEYS.GOALS,
    name: "Goals & OKRs Tracking",
    description: "Organizational, team, and individual goal tracking.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
    modulePath: "/goals",
  },

  // ── Enterprise Level Features ──────────────────────────────────
  [FEATURE_KEYS.PAYROLL]: {
    key: FEATURE_KEYS.PAYROLL,
    name: "Payroll Processing & Payslips",
    description: "Automated payroll processing, salary structures, and payslips.",
    category: "Core",
    minimumPlan: "Enterprise",
    defaultEnabled: true,
    modulePath: "/payroll",
  },
  [FEATURE_KEYS.TRAINING]: {
    key: FEATURE_KEYS.TRAINING,
    name: "Learning & Development Training",
    description: "Training course catalog, learning tracks, and certifications.",
    category: "Core",
    minimumPlan: "Enterprise",
    defaultEnabled: true,
    modulePath: "/training",
  },
  [FEATURE_KEYS.SETTLEMENTS]: {
    key: FEATURE_KEYS.SETTLEMENTS,
    name: "Full & Final Financial Settlements",
    description: "F&F settlement calculations, severance, and clearance audit.",
    category: "Core",
    minimumPlan: "Enterprise",
    defaultEnabled: true,
    modulePath: "/finance/settlements",
  },
  [FEATURE_KEYS.AUDIT_LOGS]: {
    key: FEATURE_KEYS.AUDIT_LOGS,
    name: "Security & System Audit Logs",
    description: "Immutable security event tracking, data access, and admin logs.",
    category: "Core",
    minimumPlan: "Enterprise",
    defaultEnabled: true,
    modulePath: "/audit-logs",
  },
  [FEATURE_KEYS.MANAGE_ACCOUNT]: {
    key: FEATURE_KEYS.MANAGE_ACCOUNT,
    name: "Multi-Account Admin Management",
    description: "Super admin multi-tenant organization account management.",
    category: "Core",
    minimumPlan: "Enterprise",
    defaultEnabled: true,
    modulePath: "/admin/manage-account",
  },

  // ── System / Beta Capabilities ─────────────────────────────────
  [FEATURE_KEYS.AI_SCHEDULING]: {
    key: FEATURE_KEYS.AI_SCHEDULING,
    name: "AI Assistant Co-Pilot",
    description: "Gemini AI-powered smart scheduling and automated routing.",
    category: "Beta",
    minimumPlan: "Enterprise",
    defaultEnabled: true,
  },
  [FEATURE_KEYS.BULK_IMPORT_V2]: {
    key: FEATURE_KEYS.BULK_IMPORT_V2,
    name: "Excel/CSV Bulk Importer Core v2",
    description: "Asynchronous background import processing up to 50k records.",
    category: "Core",
    minimumPlan: "Starter",
    defaultEnabled: true,
  },
  [FEATURE_KEYS.MFA_ENFORCE_ALL]: {
    key: FEATURE_KEYS.MFA_ENFORCE_ALL,
    name: "Mandatory Unified MFA",
    description: "Enforces multi-factor authentication locks across all users.",
    category: "Core",
    minimumPlan: "Enterprise",
    defaultEnabled: false,
  },
  [FEATURE_KEYS.ADVANCED_GEO_ANALYTICS]: {
    key: FEATURE_KEYS.ADVANCED_GEO_ANALYTICS,
    name: "Spatial Localization Engine",
    description: "GPS clock-in verification and spatial location analytics.",
    category: "Experimental",
    minimumPlan: "Enterprise",
    defaultEnabled: false,
  },
  [FEATURE_KEYS.CUSTOM_SSO_PORTAL]: {
    key: FEATURE_KEYS.CUSTOM_SSO_PORTAL,
    name: "Federated SAML 2.0 Portals",
    description: "White-labeled SAML SSO integration (Okta, Azure AD).",
    category: "Core",
    minimumPlan: "Enterprise",
    defaultEnabled: true,
  },
  [FEATURE_KEYS.SLACK_NOTIFS_INTEGRATION]: {
    key: FEATURE_KEYS.SLACK_NOTIFS_INTEGRATION,
    name: "Slack Interactive Alerts",
    description: "Real-time Slack notifications for approvals and alerts.",
    category: "Core",
    minimumPlan: "Growth",
    defaultEnabled: true,
  },
};
