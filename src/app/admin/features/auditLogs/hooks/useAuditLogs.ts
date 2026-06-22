/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { LogsService } from "../services/logs.service";
import {
  LoginLog,
  ActivityLog,
  AuditTrail,
  SecurityEventLog,
  ErrorLog,
  ExportLog,
  LogRetentionPolicy,
  LogsStats
} from "../types/logs.types";

export function useAuditLogs() {
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventLog[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [exportLogs, setExportLogs] = useState<ExportLog[]>([]);
  const [retentionPolicy, setRetentionPolicy] = useState<LogRetentionPolicy>({
    retentionDays: 365,
    archiveEnabled: true,
    immutableLock: false,
    complianceStandard: "SOC2"
  });
  const [stats, setStats] = useState<LogsStats>({
    totalLogins: 0,
    loginSuccessRate: 100,
    activeSessions: 0,
    criticalSecurityEvents: 0,
    errorRateToday: 0,
    totalExportsCount: 0
  });

  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL"); // Used for Login & Export logs status
  const [selectedSeverity, setSelectedSeverity] = useState("ALL"); // Used for Error & Security logs
  const [selectedModule, setSelectedModule] = useState("ALL"); // Used for Activity logs
  const [selectedAction, setSelectedAction] = useState("ALL"); // Used for Activity logs
  const [dateRange, setDateRange] = useState("ALL"); // "ALL", "TODAY", "WEEK"

  const reloadData = useCallback(() => {
    setLoading(true);
    try {
      const loginData = LogsService.getLoginLogs();
      const activityData = LogsService.getActivityLogs();
      const trailData = LogsService.getAuditTrails();
      const securityData = LogsService.getSecurityEventLogs();
      const errorData = LogsService.getErrorLogs();
      const exportData = LogsService.getExportLogs();
      const policyData = LogsService.getRetentionPolicy();
      const statsData = LogsService.getStats();

      setLoginLogs(loginData);
      setActivityLogs(activityData);
      setAuditTrails(trailData);
      setSecurityEvents(securityData);
      setErrorLogs(errorData);
      setExportLogs(exportData);
      setRetentionPolicy(policyData);
      setStats(statsData);
    } catch (e) {
      console.error("Failed to load audit logs from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Actions
  const resolveSecurityEvent = useCallback((id: string, status: "Resolved" | "Pending" | "Active") => {
    LogsService.resolveSecurityEvent(id, status);
    reloadData();
  }, [reloadData]);

  const updateRetentionPolicy = useCallback((policy: LogRetentionPolicy) => {
    LogsService.saveRetentionPolicy(policy);
    reloadData();
  }, [reloadData]);

  const purgeAuditTrail = useCallback(() => {
    alert("Compliance Lock Active:\nFederally compliant SOC2 controls prevent administrative deletion or truncation of the active logging ledger.");
  }, []);

  // Filter helper functions
  const filterByDate = useCallback((timestamp: string) => {
    if (dateRange === "ALL") return true;
    const logTime = new Date(timestamp).getTime();
    const now = Date.now();
    if (dateRange === "TODAY") {
      return now - logTime <= 24 * 60 * 60 * 1000;
    }
    if (dateRange === "WEEK") {
      return now - logTime <= 7 * 24 * 60 * 60 * 1000;
    }
    return true;
  }, [dateRange]);

  // Get unique organizations for drop down filter
  const organizations = Array.from(
    new Set([
      ...loginLogs.map(l => l.organization),
      ...activityLogs.map(a => a.organization),
      ...auditTrails.map(t => t.organization),
      ...securityEvents.filter(s => s.organization !== null).map(s => s.organization as string),
      ...exportLogs.map(e => e.organization)
    ].filter(Boolean))
  );

  return {
    loginLogs,
    activityLogs,
    auditTrails,
    securityEvents,
    errorLogs,
    exportLogs,
    retentionPolicy,
    stats,
    loading,
    organizations,

    // Filter states
    searchQuery,
    setSearchQuery,
    selectedOrg,
    setSelectedOrg,
    selectedStatus,
    setSelectedStatus,
    selectedSeverity,
    setSelectedSeverity,
    selectedModule,
    setSelectedModule,
    selectedAction,
    setSelectedAction,
    dateRange,
    setDateRange,

    // Actions
    resolveSecurityEvent,
    updateRetentionPolicy,
    purgeAuditTrail,
    refresh: reloadData,
    filterByDate
  };
}
