import {
  Announcement,
  TargetType,
  AnnouncementChannel,
  AnnouncementUrgency,
  RecurrenceType,
  TemplateCategory,
  NotificationTemplate,
  TemplateVersionHistory,
  PlatformNotificationPolicy,
  NotificationTypeEnum,
  MinimumRequiredChannel,
  OrgNotificationPreference,
} from "../types/communication.types";

// ==========================================
// MOCK DATA
// ==========================================

let announcements: Announcement[] = [
  {
    announcement_id: "ann-001",
    title: "Platform Maintenance Notice",
    message_body:
      "<p>The platform will be down for maintenance on Sunday at 2 AM UTC.</p>",
    target_type: "all",
    target_criteria: "[]",
    channels: ["in_app", "email"],
    urgency: "high",
    status: "sent",
    scheduled_at: null,
    recurrence: "none",
    sent_at: "2026-06-25T10:00:00Z",
    created_by: "super_admin_1",
    created_at: "2026-06-24T10:00:00Z",
    updated_at: "2026-06-24T10:00:00Z",
  },
  {
    announcement_id: "ann-002",
    title: "New Feature: Custom Roles",
    message_body:
      "<p>You can now create custom roles for your organization.</p>",
    target_type: "plan_based",
    target_criteria: '["enterprise"]',
    channels: ["in_app"],
    urgency: "normal",
    status: "scheduled",
    scheduled_at: "2026-07-01T10:00:00Z",
    recurrence: "none",
    sent_at: null,
    created_by: "super_admin_1",
    created_at: "2026-06-28T10:00:00Z",
    updated_at: "2026-06-28T10:00:00Z",
  },
];

const templates: NotificationTemplate[] = [
  {
    template_id: "tpl-001",
    template_name: "Welcome Email",
    category: "welcome",
    channel: "email",
    subject_line: "Welcome to the Platform, {{user_name}}!",
    body_html:
      "<h1>Welcome to {{company_name}}</h1><p>Hi {{user_name}}, we are glad to have you.</p>",
    body_text:
      "Welcome to {{company_name}}\nHi {{user_name}}, we are glad to have you.",
    available_variables: ["user_name", "company_name", "login_url"],
    language_code: "en",
    is_active: true,
    last_edited_by: "super_admin_1",
    last_edited_at: "2026-01-01T10:00:00Z",
    version_number: 1,
  },
  {
    template_id: "tpl-002",
    template_name: "Password Reset",
    category: "password_reset",
    channel: "email",
    subject_line: "Reset your password",
    body_html:
      '<h2>Password Reset Request</h2><p>Click <a href="{{reset_url}}">here</a> to reset.</p>',
    body_text:
      "Password Reset Request\nVisit {{reset_url}} to reset your password.",
    available_variables: ["user_name", "reset_url"],
    language_code: "en",
    is_active: true,
    last_edited_by: "system",
    last_edited_at: "2026-01-01T10:00:00Z",
    version_number: 1,
  },
  {
    template_id: "tpl-003",
    template_name: "Subscription Expiring Notice",
    category: "subscription_expiring",
    channel: "email",
    subject_line: "Your subscription expires in {{days_left}} days",
    body_html:
      "<h2>Subscription Alert</h2><p>Hi {{admin_name}}, your {{plan_name}} plan expires on {{expiry_date}}.</p>",
    body_text: "Your {{plan_name}} plan expires on {{expiry_date}}.",
    available_variables: [
      "company_name",
      "admin_name",
      "plan_name",
      "expiry_date",
      "days_left",
    ],
    language_code: "en",
    is_active: true,
    last_edited_by: "system",
    last_edited_at: "2026-01-01T10:00:00Z",
    version_number: 1,
  },
  {
    template_id: "tpl-004",
    template_name: "Payment Failed",
    category: "payment_failed",
    channel: "email",
    subject_line: "Payment Failed for {{company_name}}",
    body_html:
      "<h2>Payment Issue</h2><p>We could not process your payment for {{amount}}.</p>",
    body_text:
      "Payment of {{amount}} failed. Please update your billing details.",
    available_variables: [
      "company_name",
      "admin_name",
      "amount",
      "billing_url",
    ],
    language_code: "en",
    is_active: true,
    last_edited_by: "system",
    last_edited_at: "2026-01-01T10:00:00Z",
    version_number: 1,
  },
  {
    template_id: "tpl-005",
    template_name: "Plan Upgrade/Downgrade",
    category: "plan_changed",
    channel: "email",
    subject_line: "Your plan has been updated to {{new_plan}}",
    body_html:
      "<h2>Plan Changed</h2><p>Your subscription is now on the {{new_plan}} plan.</p>",
    body_text: "Your subscription is now on the {{new_plan}} plan.",
    available_variables: ["company_name", "new_plan", "old_plan"],
    language_code: "en",
    is_active: true,
    last_edited_by: "system",
    last_edited_at: "2026-01-01T10:00:00Z",
    version_number: 1,
  },
  {
    template_id: "tpl-006",
    template_name: "Account Suspended Notice",
    category: "account_suspended",
    channel: "email",
    subject_line: "URGENT: Account Suspended",
    body_html:
      "<h2>Account Suspended</h2><p>Your account {{company_name}} has been suspended. Reason: {{reason}}</p>",
    body_text: "Account Suspended for {{company_name}}. Reason: {{reason}}",
    available_variables: [
      "company_name",
      "admin_name",
      "reason",
      "support_email",
    ],
    language_code: "en",
    is_active: true,
    last_edited_by: "system",
    last_edited_at: "2026-01-01T10:00:00Z",
    version_number: 1,
  },
];

const templateVersions: TemplateVersionHistory[] = [
  {
    version_id: "v-001",
    template_id: "tpl-001",
    subject_line: "Welcome to the Platform!",
    body_html: "<h1>Welcome!</h1>",
    body_text: "Welcome!",
    edited_by: "system",
    edited_at: "2025-12-01T10:00:00Z",
  },
];

let policies: PlatformNotificationPolicy[] = [
  {
    notification_type: "security_alert",
    name: "Security Alerts",
    description:
      "Critical security notices regarding platform vulnerabilities or breaches.",
    is_mandatory: true,
    minimum_required_channel: "email",
    default_channels: ["email", "in_app"],
  },
  {
    notification_type: "billing_failure",
    name: "Billing Failures",
    description: "Notifications when a subscription payment fails.",
    is_mandatory: true,
    minimum_required_channel: "email",
    default_channels: ["email"],
  },
  {
    notification_type: "feature_update",
    name: "Feature Updates",
    description: "Announcements about new platform features.",
    is_mandatory: false,
    minimum_required_channel: "none",
    default_channels: ["in_app"],
  },
];

// Helper to simulate async delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// BROADCAST ANNOUNCEMENTS API
// ==========================================

export const communicationService = {
  async createAnnouncement(
    title: string,
    messageBody: string,
    targetType: TargetType,
    targetCriteria: string,
    channels: AnnouncementChannel[],
    urgency: AnnouncementUrgency,
    scheduledAt: string | null,
    recurrence: RecurrenceType | null,
  ): Promise<Announcement> {
    await delay(600);
    const newAnn: Announcement = {
      announcement_id: `ann-${Date.now()}`,
      title,
      message_body: messageBody,
      target_type: targetType,
      target_criteria: targetCriteria,
      channels,
      urgency,
      status: "draft",
      scheduled_at: scheduledAt,
      recurrence,
      sent_at: null,
      created_by: "Current User",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    announcements = [newAnn, ...announcements];
    return newAnn;
  },

  async getEstimatedRecipientCount(
    targetType: TargetType,
    targetCriteria: string,
    channels: AnnouncementChannel[],
  ) {
    await delay(400);
    // Mock calculation
    const orgCount =
      targetType === "all" ? 1240 : targetType === "plan_based" ? 450 : 12;
    const userCount = orgCount * 35;
    const estimatedSmsCost = channels.includes("sms") ? userCount * 0.05 : 0;
    return { orgCount, userCount, estimatedSmsCost };
  },

  async previewAnnouncement(
    announcementId: string,
    channel: AnnouncementChannel,
  ) {
    await delay(300);
    const ann = announcements.find((a) => a.announcement_id === announcementId);
    if (!ann) throw new Error("Announcement not found");
    if (channel === "sms")
      return `[${ann.urgency === "high" ? "URGENT" : "NOTICE"}] ${ann.title}\n\n(Text content stripped from HTML for SMS preview)`;
    return `<div style="font-family:sans-serif; padding:20px;"><h2>${ann.title}</h2><div>${ann.message_body}</div></div>`;
  },

  async sendTestAnnouncement(announcementId: string, contactInfo: string) {
    await delay(800);
    console.log(`Test announcement ${announcementId} sent to ${contactInfo}`);
    return true;
  },

  async sendAnnouncement(announcementId: string) {
    await delay(1000); // simulate queueing
    announcements = announcements.map((a) => {
      if (a.announcement_id === announcementId) {
        return {
          ...a,
          status: a.scheduled_at ? "scheduled" : "sent",
          sent_at: a.scheduled_at ? null : new Date().toISOString(),
        };
      }
      return a;
    });
    return true;
  },

  async cancelScheduledAnnouncement(announcementId: string) {
    await delay(500);
    announcements = announcements.map((a) => {
      if (a.announcement_id === announcementId && a.status === "scheduled") {
        return { ...a, status: "cancelled" };
      }
      return a;
    });
    return true;
  },

  async getAnnouncementHistory(filters: {
    status?: string;
    dateRange?: string;
    createdBy?: string;
    page?: number;
    limit?: number;
  }) {
    await delay(600);
    let filtered = [...announcements];
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((a) => a.status === filters.status);
    }
    const limit = filters.limit || 10;
    const page = filters.page || 1;
    const start = (page - 1) * limit;

    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    };
  },

  async getDeliveryStatus() {
    await delay(400);
    return {
      email: { sent: 1500, delivered: 1480, failed: 20, opened: 850 },
      in_app: { sent: 1500, delivered: 1500, failed: 0, opened: 1100 },
      sms: { sent: 0, delivered: 0, failed: 0, opened: 0 },
    };
  },

  // ==========================================
  // NOTIFICATION TEMPLATES API
  // ==========================================

  async getTemplatesByCategory(category: TemplateCategory) {
    await delay(400);
    return templates.filter((t) => t.category === category);
  },

  async updateTemplate(
    templateId: string,
    data: { subjectLine: string; bodyHtml: string; bodyText: string },
  ) {
    await delay(700);
    const tplIndex = templates.findIndex((t) => t.template_id === templateId);
    if (tplIndex === -1) throw new Error("Template not found");

    const tpl = templates[tplIndex];

    // Create version history snapshot
    templateVersions.push({
      version_id: `v-${Date.now()}`,
      template_id: tpl.template_id,
      subject_line: tpl.subject_line,
      body_html: tpl.body_html,
      body_text: tpl.body_text,
      edited_by: tpl.last_edited_by,
      edited_at: tpl.last_edited_at,
    });

    templates[tplIndex] = {
      ...tpl,
      subject_line: data.subjectLine,
      body_html: data.bodyHtml,
      body_text: data.bodyText,
      last_edited_by: "Current User",
      last_edited_at: new Date().toISOString(),
      version_number: tpl.version_number + 1,
    };

    return templates[tplIndex];
  },

  async previewTemplate(
    templateId: string,
    sampleData: Record<string, string>,
  ) {
    await delay(300);
    const tpl = templates.find((t) => t.template_id === templateId);
    if (!tpl) throw new Error("Template not found");
    let html = tpl.body_html;
    for (const [key, value] of Object.entries(sampleData)) {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return html;
  },

  async sendTestTemplate(templateId: string, testEmail: string) {
    await delay(800);
    console.log(`Test template ${templateId} sent to ${testEmail}`);
    return true;
  },

  async revertToVersion(templateId: string, versionId: string) {
    await delay(600);
    const version = templateVersions.find((v) => v.version_id === versionId);
    if (!version) throw new Error("Version not found");

    return this.updateTemplate(templateId, {
      subjectLine: version.subject_line,
      bodyHtml: version.body_html,
      bodyText: version.body_text,
    });
  },

  async getTemplateVersionHistory(templateId: string) {
    await delay(400);
    return templateVersions
      .filter((v) => v.template_id === templateId)
      .sort(
        (a, b) =>
          new Date(b.edited_at).getTime() - new Date(a.edited_at).getTime(),
      );
  },

  validateTemplateVariables(bodyHtml: string, allowedVariables: string[]) {
    const matches = bodyHtml.match(/{{(.*?)}}/g);
    if (!matches) return { valid: true, invalidVars: [] };

    const usedVars = matches.map((m) => m.replace(/{{|}}/g, "").trim());
    const invalidVars = usedVars.filter((v) => !allowedVariables.includes(v));

    return {
      valid: invalidVars.length === 0,
      invalidVars,
    };
  },

  async resetTemplateToDefault(templateId: string) {
    await delay(600);
    return this.updateTemplate(templateId, {
      subjectLine: "Default Subject",
      bodyHtml: "<p>This is the default body.</p>",
      bodyText: "This is the default body.",
    });
  },

  // ==========================================
  // NOTIFICATION SETTINGS API
  // ==========================================

  async getPlatformNotificationPolicies() {
    await delay(500);
    return [...policies];
  },

  async updatePlatformPolicy(
    notificationType: NotificationTypeEnum,
    data: {
      isMandatory: boolean;
      minimumRequiredChannel: MinimumRequiredChannel;
      defaultChannels: AnnouncementChannel[];
    },
  ) {
    await delay(800);
    policies = policies.map((p) => {
      if (p.notification_type === notificationType) {
        return {
          ...p,
          is_mandatory: data.isMandatory,
          minimum_required_channel: data.minimumRequiredChannel,
          default_channels: data.defaultChannels,
        };
      }
      return p;
    });
    return true;
  },

  async getOrgNotificationOverrides(
    orgId: string,
  ): Promise<OrgNotificationPreference[]> {
    await delay(400);
    return [
      {
        org_id: orgId,
        notification_type: "feature_update",
        email_enabled: false,
        sms_enabled: false,
        in_app_enabled: true,
        frequency: "weekly_digest",
      },
    ];
  },

  async getNotificationTypeUsageStats() {
    await delay(500);
    return {
      totalOrgs: 1240,
      enabledEmail: 1100,
      enabledInApp: 1240,
      enabledSms: 45,
    };
  },
};
