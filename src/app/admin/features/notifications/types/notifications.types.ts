/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemAlert {
  id: string;
  alertName: string;
  severity: "info" | "warning" | "critical";
  value: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface SubscriptionExpiryAlert {
  id: string;
  orgName: string;
  expiryDate: string;
  daysLeft: number;
  status: "active" | "notified" | "critical" | "expired";
}

export interface FailedPaymentAlert {
  id: string;
  orgName: string;
  invoiceId: string;
  amount: string;
  reason: string;
  date: string;
  resolved: boolean;
}

export interface SecurityAlert {
  id: string;
  userEmail: string;
  failedAttempts: number;
  location: string;
  reason: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  actionTaken: "none" | "warned" | "locked";
}

export interface NotificationTemplate {
  id: string;
  type: "welcome" | "billingFailed" | "expiry" | "securityAlert";
  subject: string;
  emailBody: string;
  smsBody: string;
  whatsappBody: string;
}

export interface NotificationHistoryItem {
  id: string;
  date: string;
  alertName: string;
  channel: "In-App" | "Email" | "SMS" | "WhatsApp" | "Push";
  status: "Sent" | "Delivered" | "Failed";
}

export interface NotificationSettings {
  systemAlerts: { email: boolean; sms: boolean; push: boolean };
  subscriptionExpiry: { email: boolean; sms: boolean; push: boolean };
  failedPayments: { email: boolean; sms: boolean; push: boolean };
  securityAlerts: { email: boolean; sms: boolean; push: boolean };
}

export interface NotificationState {
  systemAlerts: SystemAlert[];
  expiryAlerts: SubscriptionExpiryAlert[];
  failedPayments: FailedPaymentAlert[];
  securityAlerts: SecurityAlert[];
  templates: NotificationTemplate[];
  history: NotificationHistoryItem[];
  settings: NotificationSettings;
}
