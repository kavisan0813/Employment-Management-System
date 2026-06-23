/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from "../../../mockData";
import {
  LoginLog,
  ActivityLog,
  AuditTrail,
  SecurityEventLog,
  ErrorLog,
  ExportLog,
  LogRetentionPolicy,
  LogsStats,
} from "../types/logs.types";

export const LogsService = {
  // Login Logs
  getLoginLogs(): LoginLog[] {
    return db.loginLogs.get();
  },
  saveLoginLogs(logs: LoginLog[]): void {
    db.loginLogs.save(logs);
  },
  addLoginLog(log: Omit<LoginLog, "id" | "loginTime">): void {
    const logs = this.getLoginLogs();
    const newLog: LoginLog = {
      ...log,
      id: `login-${Date.now()}`,
      loginTime: new Date().toISOString(),
    };
    this.saveLoginLogs([newLog, ...logs]);
  },

  // Activity Logs
  getActivityLogs(): ActivityLog[] {
    return db.activityLogs.get();
  },
  saveActivityLogs(logs: ActivityLog[]): void {
    db.activityLogs.save(logs);
  },
  addActivityLog(log: Omit<ActivityLog, "id" | "timestamp">): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      ...log,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.saveActivityLogs([newLog, ...logs]);
  },

  // Audit Trails
  getAuditTrails(): AuditTrail[] {
    return db.auditTrails.get();
  },
  saveAuditTrails(trails: AuditTrail[]): void {
    db.auditTrails.save(trails);
  },
  addAuditTrail(trail: Omit<AuditTrail, "id" | "timestamp">): void {
    const trails = this.getAuditTrails();
    const newTrail: AuditTrail = {
      ...trail,
      id: `trail-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.saveAuditTrails([newTrail, ...trails]);
  },

  // Security Events
  getSecurityEventLogs(): SecurityEventLog[] {
    return db.securityEventLogs.get();
  },
  saveSecurityEventLogs(logs: SecurityEventLog[]): void {
    db.securityEventLogs.save(logs);
  },
  addSecurityEventLog(log: Omit<SecurityEventLog, "id" | "detectedAt">): void {
    const logs = this.getSecurityEventLogs();
    const newLog: SecurityEventLog = {
      ...log,
      id: `sec-${Date.now()}`,
      detectedAt: new Date().toISOString(),
    };
    this.saveSecurityEventLogs([newLog, ...logs]);
  },
  resolveSecurityEvent(
    id: string,
    status: "Resolved" | "Pending" | "Active",
  ): void {
    const logs = this.getSecurityEventLogs();
    const updated = logs.map((l) => (l.id === id ? { ...l, status } : l));
    this.saveSecurityEventLogs(updated);
  },

  // Error Logs
  getErrorLogs(): ErrorLog[] {
    return db.errorLogs.get();
  },
  saveErrorLogs(logs: ErrorLog[]): void {
    db.errorLogs.save(logs);
  },
  addErrorLog(log: Omit<ErrorLog, "id" | "timestamp">): void {
    const logs = this.getErrorLogs();
    const newLog: ErrorLog = {
      ...log,
      id: `err-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.saveErrorLogs([newLog, ...logs]);
  },

  // Export Logs
  getExportLogs(): ExportLog[] {
    return db.exportLogs.get();
  },
  saveExportLogs(logs: ExportLog[]): void {
    db.exportLogs.save(logs);
  },
  addExportLog(log: Omit<ExportLog, "id" | "timestamp">): void {
    const logs = this.getExportLogs();
    const newLog: ExportLog = {
      ...log,
      id: `exp-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.saveExportLogs([newLog, ...logs]);
  },

  // Retention Policy
  getRetentionPolicy(): LogRetentionPolicy {
    return db.logRetentionPolicy.get();
  },
  saveRetentionPolicy(policy: LogRetentionPolicy): void {
    db.logRetentionPolicy.save(policy);
  },

  // Summarize Statistics
  getStats(): LogsStats {
    const logins = this.getLoginLogs();
    const security = this.getSecurityEventLogs();
    const errors = this.getErrorLogs();
    const exportsList = this.getExportLogs();

    const totalLogins = logins.length;
    const successfulLogins = logins.filter(
      (l) => l.status === "Success",
    ).length;
    const loginSuccessRate =
      totalLogins > 0
        ? Math.round((successfulLogins / totalLogins) * 100)
        : 100;

    // Active sessions are successful logins with logoutTime = null and within last 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const activeSessions = logins.filter(
      (l) =>
        l.status === "Success" &&
        l.logoutTime === null &&
        new Date(l.loginTime).getTime() > oneDayAgo,
    ).length;

    const criticalSecurityEvents = security.filter(
      (s) => s.severity === "Critical" && s.status === "Active",
    ).length;

    // Error rate today is number of Error/Fatal logs in last 24 hours
    const errorRateToday = errors.filter(
      (e) =>
        (e.severity === "Error" || e.severity === "Fatal") &&
        new Date(e.timestamp).getTime() > oneDayAgo,
    ).length;

    const totalExportsCount = exportsList.length;

    return {
      totalLogins,
      loginSuccessRate,
      activeSessions,
      criticalSecurityEvents,
      errorRateToday,
      totalExportsCount,
    };
  },
};
