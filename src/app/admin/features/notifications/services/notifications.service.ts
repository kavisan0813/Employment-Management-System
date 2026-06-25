/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NotificationState,
  NotificationHistoryItem,
} from "../types/notifications.types";

const INITIAL_STATE: NotificationState = {
  systemAlerts: [
    {
      id: "sys-001",
      alertName: "High CPU Core Load Warning",
      severity: "warning",
      value: "95% CPU Load",
      description:
        "App Cluster instance Node-04 CPU utilization has crossed safety parameters (90% threshold limit).",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      acknowledged: false,
    },
    {
      id: "sys-002",
      alertName: "Database Server Intermittent Disconnection",
      severity: "critical",
      value: "Lost connection",
      description:
        "Replica Set database partition lost heartbeat connection with server host. Automatic failover active.",
      timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 mins ago
      acknowledged: false,
    },
    {
      id: "sys-003",
      alertName: "AWS S3 Block Storage capacity warning",
      severity: "warning",
      value: "85% capacity reached",
      description:
        "Tenant file sharing storage block partition has exceeded 80% usage threshold limit.",
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      acknowledged: false,
    },
    {
      id: "sys-004",
      alertName: "Outbound SMTP relay socket failure",
      severity: "warning",
      value: "SMTP Auth Reject",
      description:
        "Failed client authentication handshake to smtp.emspro.com port 587. Platform email notifications queued.",
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      acknowledged: false,
    },
    {
      id: "sys-005",
      alertName: "Platform Database Auto-Backup Completed",
      severity: "info",
      value: "Success (3.2 GB snapshot)",
      description:
        "Encrypted daily incremental partition snapshot archive written successfully to S3 bucket Node-02.",
      timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      acknowledged: true,
    },
  ],
  expiryAlerts: [
    {
      id: "exp-001",
      orgName: "Acme Technologies India",
      expiryDate: "2026-07-23",
      daysLeft: 30,
      status: "active",
    },
    {
      id: "exp-002",
      orgName: "XYZ Limited Dubai",
      expiryDate: "2026-07-08",
      daysLeft: 15,
      status: "active",
    },
    {
      id: "exp-003",
      orgName: "Nexus Global Systems",
      expiryDate: "2026-06-30",
      daysLeft: 7,
      status: "critical",
    },
    {
      id: "exp-004",
      orgName: "Orion Biotech Labs",
      expiryDate: "2026-06-24",
      daysLeft: 1,
      status: "critical",
    },
    {
      id: "exp-005",
      orgName: "Alpha Capital Corp",
      expiryDate: "2026-06-22",
      daysLeft: 0,
      status: "expired",
    },
  ],
  failedPayments: [
    {
      id: "pay-001",
      orgName: "Acme Software India",
      invoiceId: "INV-0928",
      amount: "₹ 99,999.00",
      reason: "Gateway Transaction Timeout",
      date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: "pay-002",
      orgName: "SkyTech Digital UAE",
      invoiceId: "INV-0498",
      amount: "$ 150.00",
      reason: "Insufficient Balance Refusal",
      date: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: "pay-003",
      orgName: "Core HR Consultants",
      invoiceId: "INV-0887",
      amount: "€ 450.00",
      reason: "Expired Customer Card Profile",
      date: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: "pay-004",
      orgName: "Apex Retail Solutions",
      invoiceId: "INV-1102",
      amount: "₹ 12,500.00",
      reason: "UPI Authorization Timed Out",
      date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      resolved: true,
    },
    {
      id: "pay-005",
      orgName: "Zenith Corp Singapore",
      invoiceId: "INV-0099",
      amount: "S$ 2,300.00",
      reason: "Razorpay Processor Connection Failure",
      date: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
      resolved: false,
    },
  ],
  securityAlerts: [
    {
      id: "sec-001",
      userEmail: "admin@abc.com",
      failedAttempts: 10,
      location: "India / Mumbai",
      reason: "Multiple Failed Logins (Possible Brute Force Attack)",
      severity: "high",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      actionTaken: "none",
    },
    {
      id: "sec-002",
      userEmail: "ceo@orion.com",
      failedAttempts: 2,
      location: "USA / Dallas vs India / Kolkata",
      reason: "Suspicious Login Geological Location Change (Impossible Travel)",
      severity: "critical",
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
      actionTaken: "none",
    },
    {
      id: "sec-003",
      userEmail: "devops@nexus.com",
      failedAttempts: 1200,
      location: "Germany / Frankfurt Proxy Node",
      reason: "API Abuse Rate Limit Exceeded (1200 requests/minute)",
      severity: "high",
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      actionTaken: "warned",
    },
    {
      id: "sec-004",
      userEmail: "hr.executive@alpha.com",
      failedAttempts: 0,
      location: "India / Bangalore",
      reason:
        "HR Permission Override (Granted unauthorized Payroll access settings)",
      severity: "medium",
      timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      actionTaken: "none",
    },
    {
      id: "sec-005",
      userEmail: "system@root.ems",
      failedAttempts: 1,
      location: "UK / London Cluster Node",
      reason: "Admin Password Reset Cycle Initialized",
      severity: "low",
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      actionTaken: "locked",
    },
  ],
  templates: [
    {
      id: "tpl-001",
      type: "welcome",
      subject: "Welcome to EMS Pro Platform",
      emailBody:
        "Hi {{user_name}},\n\nYour tenant dashboard is set up for {{org_name}}. Access self service controls here.",
      smsBody: "Welcome to EMS Pro! Your tenant dashboard is ready.",
      whatsappBody:
        "Hello {{user_name}}! Welcome to EMS Pro. We have successfully setup your tenant space for {{org_name}}.",
    },
    {
      id: "tpl-002",
      type: "billingFailed",
      subject: "Action Required: Billing Payment Failed for {{org_name}}",
      emailBody:
        "Dear Admin,\n\nWe attempted to debit subscription fee INV-{{invoice_id}} but the transaction failed. Please check payment profiles.",
      smsBody:
        "Subscription payment failed for {{org_name}}. Please verify billing profiles.",
      whatsappBody:
        "Alert: Payment transaction failed for {{org_name}}. Invoice ID: INV-{{invoice_id}}. Please update your card.",
    },
    {
      id: "tpl-003",
      type: "expiry",
      subject:
        "Subscription Renewal Notice: {{days}} Days Left for {{org_name}}",
      emailBody:
        "Dear Client,\n\nYour subscription at EMS Pro platform will expire in {{days}} days. Please renew to prevent service freeze.",
      smsBody:
        "SaaS Warning: Subscription expires in {{days}} days for {{org_name}}.",
      whatsappBody:
        "Reminder: Subscription expires in {{days}} days for {{org_name}}. Renew today.",
    },
    {
      id: "tpl-004",
      type: "securityAlert",
      subject: "Security Alert: Suspicious Login Detected",
      emailBody:
        "Warning: Suspicious access attempt detected for your email address: {{user_email}} at {{location}}.",
      smsBody:
        "EMS Alert: Suspicious login details detected for {{user_email}}.",
      whatsappBody:
        "Security Alert: Suspicious login location detected for user {{user_email}} at {{location}}.",
    },
  ],
  history: [
    {
      id: "hst-001",
      date: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      alertName: "Security Alert: suspicious geological travel",
      channel: "Email",
      status: "Sent",
    },
    {
      id: "hst-002",
      date: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      alertName: "System Alert: DB failover connection",
      channel: "Push",
      status: "Delivered",
    },
    {
      id: "hst-003",
      date: new Date(Date.now() - 3600 * 1000).toISOString(),
      alertName: "Subscription Expiry Notice (7 Days)",
      channel: "Email",
      status: "Sent",
    },
    {
      id: "hst-004",
      date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      alertName: "Failed Payment Invoice alert (Acme Tech)",
      channel: "SMS",
      status: "Failed",
    },
    {
      id: "hst-005",
      date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      alertName: "Daily Server Backup completed",
      channel: "WhatsApp",
      status: "Delivered",
    },
  ],
  settings: {
    systemAlerts: { email: true, sms: false, push: true },
    subscriptionExpiry: { email: true, sms: true, push: false },
    failedPayments: { email: true, sms: false, push: true },
    securityAlerts: { email: true, sms: true, push: true },
  },
};

const STORAGE_KEY = "platform_superadmin_notifications";

export const notificationsService = {
  loadData(): NotificationState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
    } catch (e) {
      console.error("Failed to load notifications from storage", e);
    }
    return INITIAL_STATE;
  },

  saveData(state: NotificationState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  // Actions simulators
  retryPayment(
    state: NotificationState,
    id: string,
  ): Promise<{ success: boolean; state: NotificationState; logs: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedPayments = state.failedPayments.map((p) => {
          if (p.id === id) {
            return { ...p, resolved: true };
          }
          return p;
        });

        const target = state.failedPayments.find((p) => p.id === id);
        const invoice = target ? target.invoiceId : "INV-Unknown";
        const org = target ? target.orgName : "Org-Unknown";

        // Add history log
        const newHistoryItem: NotificationHistoryItem = {
          id: `hst-payment-${Date.now()}`,
          date: new Date().toISOString(),
          alertName: `Payment Retried & Resolved successfully: Invoice ${invoice} (${org})`,
          channel: "Email",
          status: "Sent",
        };

        const newState = {
          ...state,
          failedPayments: updatedPayments,
          history: [newHistoryItem, ...state.history],
        };

        notificationsService.saveData(newState);
        resolve({
          success: true,
          state: newState,
          logs: `Retrying payment invoice ${invoice} via gateway... Charged card successfully. Status: RESOLVED.`,
        });
      }, 1500);
    });
  },

  sendRenewalReminder(
    state: NotificationState,
    id: string,
  ): Promise<{ success: boolean; state: NotificationState }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const target = state.expiryAlerts.find((a) => a.id === id);
        const orgName = target ? target.orgName : "Tenant";
        const daysLeft = target ? target.daysLeft : 0;

        const updatedExpiry = state.expiryAlerts.map((a) => {
          if (a.id === id) {
            return { ...a, status: "notified" as any };
          }
          return a;
        });

        // Add history dispatch log
        const newHistoryItems: NotificationHistoryItem[] = [
          {
            id: `hst-rem-${Date.now()}-1`,
            date: new Date().toISOString(),
            alertName: `Subscription Expiry Notice sent to ${orgName} (${daysLeft} Days left)`,
            channel: "Email",
            status: "Sent",
          },
          {
            id: `hst-rem-${Date.now()}-2`,
            date: new Date().toISOString(),
            alertName: `Subscription Expiry SMS notice sent to ${orgName}`,
            channel: "SMS",
            status: "Delivered",
          },
        ];

        const newState = {
          ...state,
          expiryAlerts: updatedExpiry,
          history: [...newHistoryItems, ...state.history],
        };

        notificationsService.saveData(newState);
        resolve({
          success: true,
          state: newState,
        });
      }, 1000);
    });
  },

  acknowledgeSystemAlert(
    state: NotificationState,
    id: string,
  ): NotificationState {
    const updatedAlerts = state.systemAlerts.map((a) => {
      if (a.id === id) {
        return { ...a, acknowledged: true };
      }
      return a;
    });

    const newState = {
      ...state,
      systemAlerts: updatedAlerts,
    };

    notificationsService.saveData(newState);
    return newState;
  },

  takeSecurityAction(
    state: NotificationState,
    id: string,
    action: "warned" | "locked",
  ): NotificationState {
    const updatedAlerts = state.securityAlerts.map((a) => {
      if (a.id === id) {
        return { ...a, actionTaken: action };
      }
      return a;
    });

    const target = state.securityAlerts.find((a) => a.id === id);
    const user = target ? target.userEmail : "User";

    // Add notification logs
    const newHistoryItem: NotificationHistoryItem = {
      id: `hst-sec-${Date.now()}`,
      date: new Date().toISOString(),
      alertName: `Security Action: Account [${user}] status forced to ${action.toUpperCase()}`,
      channel: "Push",
      status: "Delivered",
    };

    const newState = {
      ...state,
      securityAlerts: updatedAlerts,
      history: [newHistoryItem, ...state.history],
    };

    notificationsService.saveData(newState);
    return newState;
  },
};
