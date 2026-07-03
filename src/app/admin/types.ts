/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Status and Standard Enums ---
export type EntityStatus =
  | "Active"
  | "Inactive"
  | "Pending"
  | "Suspended"
  | "Trial"
  | "Expired";

// --- Module 2: Organizations ---
export interface Organization {
  id: string;
  name: string;
  code?: string;
  domain: string;
  logoUrl?: string;
  status: EntityStatus;
  plan:
    | "Trial"
    | "Basic"
    | "Professional"
    | "Enterprise"
    | "Starter"
    | "Growth";
  userCount: number;
  seatLimit: number;
  mrr: number;
  industry: string;
  region: string;
  ownerEmail: string;
  phone?: string;
  website?: string;
  registrationNumber?: string;
  gstNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  storageUsedGB?: number;
  storageAllocatedGB?: number;
  enabledModules?: string[];
  joinedAt: string;
  lastActiveAt: string;
  trialEndsAt?: string;
}

// --- Module 3: Global Users ---
export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: "Active" | "Inactive" | "Pending" | "Suspended" | "Pending Invite";
  role: string;
  organization: string;
  organizationId: string;
  lastLoginAt: string;
  mfaEnabled: boolean;
  joinedAt: string;
  password?: string;
}

// --- Module 4: Subscriptions ---
export interface Subscription {
  id: string;
  organization: string;
  organizationId: string;
  plan: "Starter" | "Growth" | "Enterprise";
  status: EntityStatus; // Inactive = cancelled
  billingCycle: "Monthly" | "Annual";
  amount: number;
  currency: string;
  startDate: string;
  renewalDate: string | null;
  paymentMethodLast4: string | null;
  failedPaymentCount: number;
}

// --- Module 5: Feature Management ---
export interface FeatureFlag {
  id: string;
  key: string; // e.g. "ai_scheduling", "bulk_import_v2"
  name: string;
  description: string;
  category: "Core" | "Beta" | "Experimental" | "Deprecated";
  status: "Active" | "Inactive"; // Active = flag exists, Inactive = archived
  defaultState: boolean; // on/off for new orgs
  rolloutPct: number; // 0-100
  enabledPlans: ("Starter" | "Growth" | "Enterprise")[];
  enabledOrgIds: string[]; // org overrides
  createdAt: string;
  updatedAt: string;
}

// --- Module 6: Role Templates ---
export interface PermissionRule {
  module: string;
  actions: ("view" | "create" | "edit" | "delete" | "approve")[];
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  scope: "Platform" | "Organization";
  status: "Active" | "Inactive";
  permissions: PermissionRule[];
  assignedOrgCount: number;
  isSystemDefault: boolean;
  updatedAt: string;
}

// --- Module 7: Integrations ---
export interface Integration {
  id: string;
  name: string;
  provider: string; // e.g. "Okta", "Slack", "ADP"
  category:
    | "SSO"
    | "Communication"
    | "Payroll"
    | "Calendar"
    | "Storage"
    | "Analytics";
  status: "Active" | "Inactive" | "Pending";
  connectedOrgCount: number;
  iconUrl?: string;
  authType: "OAuth2" | "API Key" | "SAML";
  lastSyncAt: string | null;
  healthStatus: "Healthy" | "Degraded" | "Down";
}

// --- Module 8: API Management ---
export interface ApiKey {
  id: string;
  label: string;
  organization: string;
  organizationId: string;
  keyPrefix: string; // only show first 8 characters
  scopes: string[];
  status: "Active" | "Inactive" | "Suspended";
  rateLimitPerMin: number;
  requestsToday: number;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface WebhookEndpoint {
  id: string;
  organization: string;
  organizationId: string;
  url: string;
  events: string[];
  status: "Active" | "Inactive";
  lastDeliveryStatus: "Success" | "Failed" | "Pending";
  lastDeliveredAt: string | null;
}

// --- Module 9: Reports ---
export interface ReportMetric {
  label: string;
  value: string;
  pct: number;
}

export interface TrendSeries {
  title: string;
  points: { x: string; y: number }[];
}

// --- Module 10: Audit Logs ---
/* export interface AuditLogEntry {
  action?: string;
  id: string;
  event: string; // e.g. "user.login", "org.plan_upgrade"
  eventCategory: "Auth" | "Billing" | "Admin Action" | "Data" | "Security";
  actor: string; // email or "System"
  actorType: "platform_admin" | "org_admin" | "user" | "system";
  organization: string | null;
  ipAddress: string;
  userAgent: string;
  result: "Active" | "Pending" | "Inactive"; // Active = success, Pending = in progress, Inactive = failed
  metadata: Record<string, string>;
  timestamp: string;
} */

// --- Module 11: Support Tickets ---
export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  organization: string;
  organizationId: string;
  submittedBy: string;
  status: "Active" | "Pending" | "Inactive"; // Active=open, Pending=awaiting reply, Inactive=resolved
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedTo: string | null; // Agent name
  createdAt: string;
  updatedAt: string;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  tags: string[];
  csatScore?: number;
  csatComment?: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  author: string;
  authorType: "customer" | "agent";
  body: string;
  createdAt: string;
}

// --- Module 12: Announcements ---
export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "All tenants" | "Specific plan" | "Specific organizations";
  audiencePlan?: "Starter" | "Growth" | "Enterprise";
  audienceOrgIds?: string[];
  status: "Active" | "Pending" | "Inactive"; // Active=published, Pending=scheduled, Inactive=draft
  state: "Draft" | "Scheduled" | "Published";
  publishAt: string | null;
  expiresAt: string | null;
  displayStyle: "Banner" | "Modal" | "Notification Center Only";
  createdBy: string;
  viewCount: number;
  date: string;
}

// --- Module 13: Email Templates ---
export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  category: "Onboarding" | "Billing" | "Security" | "Engagement" | "System";
  subject: string;
  bodyHtml: string;
  status: "Active" | "Inactive";
  variables: string[];
  lastEditedBy: string;
  updatedAt: string;
  sentLast30Days: number;
}

// --- Module 14: Notifications ---
export interface NotificationRule {
  id: string;
  name: string;
  triggerEvent: string;
  category: "Billing" | "Security" | "Support" | "System";
  channels: ("In-App" | "Email" | "SMS" | "Slack")[];
  recipientType: "Platform Admins" | "Org Admins" | "Affected User";
  status: "Active" | "Inactive";
  throttle: string;
  updatedAt: string;
}

// --- Module 15: Backup & Restore ---
export interface BackupSnapshot {
  id: string;
  type: "Automatic" | "Manual";
  status: "Active" | "Pending" | "Inactive"; // Active=completed, Pending=in-progress, Inactive=failed
  sizeGb: number;
  createdAt: string;
  retentionExpiresAt: string;
  triggeredBy: string;
}

export interface BackupSchedule {
  frequency: "Daily" | "Weekly" | "Monthly";
  retentionDays: number;
  time: string;
  enabled: boolean;
}

// --- Module 16: Branding ---
export interface BrandingConfig {
  scope: "Platform Default" | "Organization Override";
  organizationId?: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  customDomain: string | null;
  domainVerified: boolean;
  emailFromName: string;
  updatedAt: string;
}

// --- Module 17: Security ---
export interface SecurityPolicy {
  passwordMinLength: number;
  passwordRequireSymbol: boolean;
  passwordRequireNumber: boolean;
  passwordExpiryDays: number | null;
  mfaEnforcement: "Optional" | "Required for Admins" | "Required for All";
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  ipAllowlist: { id: string; label: string; cidr: string; addedAt: string }[];
  ssoEnforced: boolean;
}

export interface SecurityEvent {
  id: string;
  type:
    | "Failed Login Spike"
    | "New Device Login"
    | "Impossible Travel"
    | "MFA Disabled";
  organization: string | null;
  actor: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Pending" | "Inactive";
  detectedAt: string;
}

// --- Module 18: AI Settings ---
export interface AiFeatureToggle {
  id: string;
  key: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  enabledPlans: ("Starter" | "Growth" | "Enterprise")[];
  confidenceThreshold: number;
  dataRetentionDays: number;
}

export interface AiUsageStat {
  feature: string;
  callsLast30Days: number;
  avgLatencyMs: number;
  estimatedCost: number;
}

// --- Module 19: Settings ---
export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  defaultTimezone: string;
  defaultLocale: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Support Lead" | "Billing Admin" | "Read Only";
  status: "Active" | "Inactive" | "Pending";
  lastLoginAt: string | null;
  invitedAt: string;
}

// --- Dashboard Module ---
export interface DashboardStatsCache {
  stat_id: string;
  total_companies: number;
  active_subscriptions: number;
  trial_companies: number;
  expired_companies: number;
  suspended_companies: number;
  mrr_total: number;
  arr_total: number;
  new_signups_this_month: number;
  new_signups_today: number;
  active_companies_count: number;
  at_risk_companies_count: number;
  inactive_companies_count: number;
  total_employees_platform_wide: number;
  calculated_at: string;
}

export interface DailySnapshot {
  snapshot_date: string;
  total_companies: number;
  mrr_total: number;
  new_signups: number;
  active_companies_count: number;
  total_employees: number;
}
