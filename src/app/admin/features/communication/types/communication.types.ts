export type TargetType = 'all' | 'plan_based' | 'specific_orgs' | 'role_based';
export type AnnouncementChannel = 'in_app' | 'email' | 'sms';
export type AnnouncementUrgency = 'normal' | 'high';
export type AnnouncementStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled';
export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export interface Announcement {
  announcement_id: string;
  title: string;
  message_body: string;
  target_type: TargetType;
  target_criteria: string; // JSON string
  channels: AnnouncementChannel[];
  urgency: AnnouncementUrgency;
  status: AnnouncementStatus;
  scheduled_at: string | null;
  recurrence: RecurrenceType | null;
  sent_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type TemplateCategory = 'welcome' | 'password_reset' | 'subscription_expiring' | 'payment_failed' | 'plan_changed' | 'account_suspended';
export type TemplateChannel = 'email' | 'sms';

export interface NotificationTemplate {
  template_id: string;
  template_name: string;
  category: TemplateCategory;
  channel: TemplateChannel;
  subject_line: string;
  body_html: string;
  body_text: string;
  available_variables: string[];
  language_code: string;
  is_active: boolean;
  last_edited_by: string;
  last_edited_at: string;
  version_number: number;
}

export interface TemplateVersionHistory {
  version_id: string;
  template_id: string;
  body_html: string;
  body_text: string;
  subject_line: string;
  edited_by: string;
  edited_at: string;
}

export type NotificationTypeEnum = 'security_alert' | 'billing_failure' | 'feature_update' | 'maintenance_notice';
export type MinimumRequiredChannel = 'email' | 'in_app' | 'none';

export interface PlatformNotificationPolicy {
  notification_type: NotificationTypeEnum;
  name: string;
  description: string;
  is_mandatory: boolean;
  minimum_required_channel: MinimumRequiredChannel;
  default_channels: AnnouncementChannel[];
}

export interface OrgNotificationPreference {
  org_id: string;
  notification_type: NotificationTypeEnum;
  email_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  frequency: 'instant' | 'daily_digest' | 'weekly_digest';
}
