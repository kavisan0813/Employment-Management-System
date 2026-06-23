/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoginLog {
  id: string;
  user: string;
  email: string;
  organization: string;
  role: string;
  loginTime: string;
  logoutTime: string | null;
  ipAddress: string;
  device: string; // e.g. "Windows", "macOS", "iPhone"
  browser: string; // e.g. "Chrome", "Safari", "Firefox"
  status: "Success" | "Failed";
  failureReason?: string; // "Invalid Password", "MFA Verification Failed", "Account Locked"
}

export interface ActivityLog {
  description?: string;
  id: string;
  timestamp: string;
  user: string;
  email: string;
  organization: string;
  role: string;
  action:
    | "Create"
    | "Update"
    | "Delete"
    | "Approve"
    | "Reject"
    | "Upload"
    | "Download"
    | "Export";
  module:
    | "Employee"
    | "Leave"
    | "Payroll"
    | "Billing"
    | "Announcements"
    | "Features"
    | "Roles"
    | "Settings"
    | "Tickets";
  details: string;
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  user: string;
  email: string;
  organization: string;
  action: string; // e.g. "Employee Salary Updated"
  target: string; // e.g. "Salary", "MFA Status"
  oldValue: string;
  newValue: string;
  ipAddress: string;
}

export interface SecurityEventLog {
  id: string;
  detectedAt: string;
  type:
    | "Failed Login Spike"
    | "New Device Login"
    | "Impossible Travel"
    | "MFA Disabled"
    | "Account Locked"
    | "Suspicious IP";
  organization: string | null;
  actor: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Pending" | "Resolved";
  details: string;
  ipAddress: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  user: string; // "System" or admin email
  organization: string | null;
  errorCode: string; // e.g. "ERR_500_DB", "API_AUTH_FAIL"
  message: string;
  severity: "Warning" | "Error" | "Fatal";
  path: string; // e.g. "/api/payroll/export", "/admin/subscriptions"
  stackTrace: string;
}

export interface ExportLog {
  id: string;
  timestamp: string;
  user: string;
  organization: string;
  module: string; // e.g. "Employee Directory", "Payroll Ledger"
  recordsCount: number;
  format: "CSV" | "Excel" | "PDF" | "JSON";
  status: "Success" | "Failed" | "Processing";
  ipAddress: string;
}

export interface LogRetentionPolicy {
  retentionDays: number; // 90, 365, 2555 (7 years), etc.
  archiveEnabled: boolean;
  immutableLock: boolean; // SOC2 Compliant lock
  complianceStandard: "SOC2" | "ISO27018" | "GDPR" | "Custom";
}

export interface LogsStats {
  totalLogins: number;
  loginSuccessRate: number;
  activeSessions: number;
  criticalSecurityEvents: number;
  errorRateToday: number;
  totalExportsCount: number;
}
