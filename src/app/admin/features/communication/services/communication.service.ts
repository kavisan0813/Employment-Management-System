/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommunicationState, Announcement, EmailTemplate, SmsTemplate, Broadcast, CommunicationLog, CommunicationSettings } from "../types/communication.types";

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Scheduled System Maintenance Outage",
    content: "Platform servers will undergo core security patches on 25-Dec-2026 between 10:00 PM and 12:00 AM UTC. Expect minor database latency cycles.",
    priority: "High",
    targetAudience: "Everyone",
    displayOption: "Dashboard Banner",
    status: "Active",
    createdAt: "2026-06-22T10:00:00Z"
  },
  {
    id: "ann-2",
    title: "New LMS Learning Recruitment Module Released",
    content: "We have shipped version 2.4 of the recruitment flow, containing auto-grading pipelines for applicant questionnaires.",
    priority: "Medium",
    targetAudience: "Enterprise Customers",
    displayOption: "Popup",
    status: "Active",
    createdAt: "2026-06-20T14:30:00Z"
  },
  {
    id: "ann-3",
    title: "Updated Annual Sick Leave Carryover Policy",
    content: "Platform HR parameters have been adjusted to automatically roll over up to 5 unused sick leaves to the next calendar cycle.",
    priority: "Critical",
    targetAudience: "Everyone",
    displayOption: "Email",
    status: "Inactive",
    createdAt: "2026-06-18T09:00:00Z"
  }
];

const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "temp-email-1",
    template_name: "Tenant Welcome Email onboarding",
    subject: "Welcome to EMS Platform!",
    body: "Hello {{name}},\n\nWelcome to EMS Platform. We are thrilled to help you manage {{organization}} successfully! You can invite your team members using your admin panel.\n\nBest Regards,\nEMS Platform Team",
    category: "Authentication",
    version: "1.0.2"
  },
  {
    id: "temp-email-2",
    template_name: "SLA Subscription Expiry warning",
    subject: "Subscription Warning Notice — Action Required",
    body: "Your subscription for {{organization}} is expiring in {{expiry_date}}. Please renew your license parameters to avoid active account lockouts.\n\nEMS Billing Team",
    category: "Billing",
    version: "1.1.0"
  },
  {
    id: "temp-email-3",
    template_name: "Security Credentials Password Reset",
    subject: "Reset your Password instructions",
    body: "Click here to reset your password credentials for employee account id {{employee_id}}.\n\nEMS Security Team",
    category: "Authentication",
    version: "1.0.0"
  },
  {
    id: "temp-email-4",
    template_name: "Employee Account Creation notification",
    subject: "Employee Dossier Profile Created",
    body: "Your corporate employee portal profile has been created successfully for {{name}} (ID: {{employee_id}}) under {{organization}}.\n\nEMS HR Services Team",
    category: "Employee",
    version: "1.0.1"
  }
];

const INITIAL_SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: "temp-sms-1",
    template_name: "OTP Login Verification",
    message: "Your OTP for EMS secure portal login is {{otp}}. Valid for exactly 5 minutes."
  },
  {
    id: "temp-sms-2",
    template_name: "Leave Request Approval notice",
    message: "Hello {{employee_name}}, your leave request for {{leave_date}} has been APPROVED successfully."
  },
  {
    id: "temp-sms-3",
    template_name: "Salary Disbursement Credit",
    message: "SaaS Payout Alert: Your salary for the current billing cycle has been credited successfully."
  }
];

const INITIAL_BROADCASTS: Broadcast[] = [
  {
    id: "brd-1",
    title: "New Recruitment LMS Launch Campaign",
    audience: "Enterprise Only",
    channel: "Email + SMS + Push",
    scheduledAt: "2026-06-22T08:00:00Z",
    status: "Sent",
    campaignName: "LMS Core Version 2.4"
  }
];

const INITIAL_LOGS: CommunicationLog[] = [
  {
    id: "log-c-1",
    type: "Email",
    recipient: "owner@acme.com",
    status: "Delivered",
    timestamp: "2026-06-23T04:30:00Z",
    details: "Onboarding Welcome Template sent to Acme Enterprise administrator."
  },
  {
    id: "log-c-2",
    type: "SMS",
    recipient: "+91 9988776655",
    status: "Failed",
    timestamp: "2026-06-23T04:32:00Z",
    details: "Carrier Gateway rejected OTP packet. Code: ERR_SMS_QUEUE."
  },
  {
    id: "log-c-3",
    type: "Push",
    recipient: "Sarah Connor (Cyberdyne)",
    status: "Viewed",
    timestamp: "2026-06-23T05:00:00Z",
    details: "Mobile device push token delivered successfully: LMS Release Notification."
  },
  {
    id: "log-c-4",
    type: "Email",
    recipient: "compliance@novamedia.co.uk",
    status: "Bounced",
    timestamp: "2026-06-22T14:10:00Z",
    details: "Inbound mailbox full: warning notification bounced."
  }
];

const INITIAL_SETTINGS: CommunicationSettings = {
  smtpHost: "smtp.mailtrap.io",
  smtpPort: 2525,
  smtpUser: "api_user_8829",
  senderEmail: "noreply@emsplatform.io",
  senderName: "EMS Platform Delivery Service",
  smsGateway: "Twilio SMS Gateway",
  smsApiKey: "SK_twilio_key_881923x019",
  fcmConfig: "apiKey: 'AIzaSyB_1928', authDomain: 'ems-platform.firebaseapp.com'"
};

export const communicationService = {
  loadData(): CommunicationState {
    const data = this.getStore<CommunicationState | null>("communication_module", null);
    if (data) {
      return data;
    }
    const seedState: CommunicationState = {
      announcements: INITIAL_ANNOUNCEMENTS,
      emailTemplates: INITIAL_EMAIL_TEMPLATES,
      smsTemplates: INITIAL_SMS_TEMPLATES,
      broadcasts: INITIAL_BROADCASTS,
      logs: INITIAL_LOGS,
      settings: INITIAL_SETTINGS
    };
    this.saveData(seedState);
    return seedState;
  },

  saveData(state: CommunicationState) {
    this.saveStore("communication_module", state);
  },

  getStore<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(`ems_${key}`);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      console.warn(`Error reading localStorage key ${key}`, e);
      return defaultVal;
    }
  },

  saveStore<T>(key: string, val: T) {
    try {
      localStorage.setItem(`ems_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error(`Error writing localStorage key ${key}`, e);
    }
  },

  addAnnouncement(state: CommunicationState, ann: Omit<Announcement, "id" | "createdAt">): CommunicationState {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const newState = {
      ...state,
      announcements: [newAnn, ...state.announcements]
    };
    this.saveData(newState);
    return newState;
  },

  toggleAnnouncement(state: CommunicationState, id: string): CommunicationState {
    const updated = state.announcements.map(ann => {
      if (ann.id === id) {
        return { ...ann, status: ann.status === "Active" ? "Inactive" : "Active" as any };
      }
      return ann;
    });
    const newState = { ...state, announcements: updated };
    this.saveData(newState);
    return newState;
  },

  deleteAnnouncement(state: CommunicationState, id: string): CommunicationState {
    const updated = state.announcements.filter(ann => ann.id !== id);
    const newState = { ...state, announcements: updated };
    this.saveData(newState);
    return newState;
  },

  saveEmailTemplate(state: CommunicationState, template: EmailTemplate): CommunicationState {
    const exists = state.emailTemplates.some(t => t.id === template.id);
    let updated;
    if (exists) {
      updated = state.emailTemplates.map(t => t.id === template.id ? template : t);
    } else {
      updated = [template, ...state.emailTemplates];
    }
    const newState = { ...state, emailTemplates: updated };
    this.saveData(newState);
    return newState;
  },

  saveSmsTemplate(state: CommunicationState, template: SmsTemplate): CommunicationState {
    const exists = state.smsTemplates.some(t => t.id === template.id);
    let updated;
    if (exists) {
      updated = state.smsTemplates.map(t => t.id === template.id ? template : t);
    } else {
      updated = [template, ...state.smsTemplates];
    }
    const newState = { ...state, smsTemplates: updated };
    this.saveData(newState);
    return newState;
  },

  sendBroadcastCampaign(
    state: CommunicationState, 
    title: string, 
    campaignName: string, 
    audience: string, 
    channels: string[],
    messageText: string
  ): { state: CommunicationState; logMsg: string } {
    const brdId = `brd-${Date.now()}`;
    const newBroadcast: Broadcast = {
      id: brdId,
      title,
      audience,
      channel: channels.join(" + "),
      scheduledAt: new Date().toISOString(),
      status: "Sent",
      campaignName
    };

    // Generate mock communication logs matching the campaign recipients
    // Let's create logs to show successful execution
    const newLogs: CommunicationLog[] = [];
    const recipients = [
      { email: "admin@acme.com", sms: "+1 555-010-2345", push: "John Admin" },
      { email: "billing@apex-corp.com", sms: "+44 20 7946 0958", push: "Apex Billing" },
      { email: "contact@stellar.io", sms: "+39 06 1234 5678", push: "Stellar Contact" }
    ];

    recipients.forEach((rec, idx) => {
      channels.forEach(ch => {
        const status = idx === 2 && ch === "SMS" ? "Failed" : ch === "Email" ? "Delivered" : "Viewed";
        newLogs.push({
          id: `log-campaign-${Date.now()}-${idx}-${ch}`,
          type: ch as any,
          recipient: ch === "Email" ? rec.email : ch === "SMS" ? rec.sms : rec.push,
          status,
          timestamp: new Date().toISOString(),
          details: `Campaign [${campaignName}] broadcast via ${ch}. Content preview: ${messageText.slice(0, 30)}...`
        });
      });
    });

    const newState = {
      ...state,
      broadcasts: [newBroadcast, ...state.broadcasts],
      logs: [...newLogs, ...state.logs]
    };
    this.saveData(newState);

    return {
      state: newState,
      logMsg: `Campaign [${campaignName}] sent successfully to ${recipients.length} segmented recipients via ${channels.join("/")}.`
    };
  },

  updateSettings(state: CommunicationState, settings: CommunicationSettings): CommunicationState {
    const newState = {
      ...state,
      settings
    };
    this.saveData(newState);
    return newState;
  }
};
