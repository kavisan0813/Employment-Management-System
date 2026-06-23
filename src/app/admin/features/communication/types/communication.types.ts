/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  targetAudience: string; // "Everyone" | "Specific Orgs" | "Plans"
  displayOption: string; // "Banner" | "Popup" | "Email" | "Push"
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  template_name: string;
  subject: string;
  body: string;
  category: "Authentication" | "Billing" | "Employee" | "Payroll" | "Leave" | "Recruitment";
  version: string;
}

export interface SmsTemplate {
  id: string;
  template_name: string;
  message: string;
}

export interface Broadcast {
  id: string;
  title: string;
  audience: string;
  channel: string;
  scheduledAt: string;
  status: "Sent" | "Scheduled";
  campaignName: string;
}

export interface CommunicationLog {
  id: string;
  type: "Email" | "SMS" | "Push";
  recipient: string;
  status: "Sent" | "Delivered" | "Failed" | "Opened" | "Clicked" | "Bounced" | "Viewed" | "Ignored";
  timestamp: string;
  details: string;
}

export interface CommunicationSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  senderEmail: string;
  senderName: string;
  smsGateway: string;
  smsApiKey: string;
  fcmConfig: string;
}

export interface CommunicationState {
  announcements: Announcement[];
  emailTemplates: EmailTemplate[];
  smsTemplates: SmsTemplate[];
  broadcasts: Broadcast[];
  logs: CommunicationLog[];
  settings: CommunicationSettings;
}
