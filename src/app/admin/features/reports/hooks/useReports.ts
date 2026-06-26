/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ReportsState } from "../types/reports.types";
import { reportsService } from "../services/reports.service";
import { pushAuditLog } from "../../../mockData";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function useReports() {
  const [state, setState] = useState<ReportsState>(() =>
    reportsService.loadData(),
  );
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "organizations"
    | "employees"
    | "attendance"
    | "subscriptions"
    | "revenue"
    | "usage"
    | "custom"
    | "scheduled"
    | "exports"
    | "executive"
  >("dashboard");

  // Alert State
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "info" | "error" | "warning"
  >("success");

  // Search filter for Exports history
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Report Builder State
  const [customFilters, setCustomFilters] = useState({
    orgId: "all",
    dateRange: "30d",
    plan: "all",
    industry: "all",
  });
  const [customReportResult, setCustomReportResult] = useState<any[]>([]);

  // Scheduled Report Form State
  const [schedTemplateId, setSchedTemplateId] = useState("temp-5");
  const [schedFrequency, setSchedFrequency] = useState<
    "Daily" | "Weekly" | "Monthly"
  >("Monthly");
  const [schedEmail, setSchedEmail] = useState("");

  // Trigger temporary feedback banner
  const triggerAlert = (
    msg: string,
    type: "success" | "info" | "error" | "warning" = "success",
  ) => {
    setAlertMsg(msg);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  // Compile Custom Report Preview
  const handleCompileCustomReport = () => {
    const data = reportsService.queryCustomReport(customFilters);
    setCustomReportResult(data);
    triggerAlert(
      "Dynamic query compiled successfully. Renders live dataset preview.",
      "success",
    );
    pushAuditLog(
      "custom_report.compiled",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      {
        org: customFilters.orgId,
        plan: customFilters.plan,
        industry: customFilters.industry,
      },
    );
  };

  // Create manual document export
  const handleCreateExport = (
    reportName: string,
    exportType: "PDF" | "CSV" | "Excel",
  ) => {
    const result = reportsService.createExport(state, reportName, exportType);
    setState(result.state);
    triggerAlert(result.log, "success");
    pushAuditLog(
      "report.exported",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { report_name: reportName, export_type: exportType },
    );
  };

  // Remove generated export file from log
  const handleDeleteExport = (id: string) => {
    const newState = reportsService.deleteExport(state, id);
    setState(newState);
    triggerAlert(
      "Export record removed from the download logs database.",
      "info",
    );
  };

  // Register a new automated email report schedule
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedEmail.trim()) {
      triggerAlert("Please enter a valid recipient email address.", "error");
      return;
    }

    const template = state.templates.find((t) => t.id === schedTemplateId);
    const reportName = template ? template.name : "Custom Scheduled Report";

    const newState = reportsService.addSchedule(state, {
      templateId: schedTemplateId,
      reportName,
      frequency: schedFrequency,
      email: schedEmail,
    });

    setState(newState);
    setSchedEmail("");
    triggerAlert(
      `Schedules successfully configured: dispatching ${schedFrequency} to ${schedEmail}.`,
      "success",
    );
    pushAuditLog(
      "report_schedule.created",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { report_name: reportName, frequency: schedFrequency, email: schedEmail },
    );
  };

  // Toggle schedule status (Active/Suspended)
  const handleToggleSchedule = (id: string) => {
    const newState = reportsService.toggleSchedule(state, id);
    setState(newState);
    const target = newState.schedules.find((s) => s.id === id);
    triggerAlert(
      `Schedule automation status set to ${target?.active ? "ACTIVE" : "SUSPENDED"}.`,
      target?.active ? "success" : "warning",
    );
    pushAuditLog(
      "report_schedule.status_updated",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { schedule_id: id, active_status: target?.active ? "true" : "false" },
    );
  };

  // Delete schedule entry
  const handleDeleteSchedule = (id: string) => {
    const newState = reportsService.deleteSchedule(state, id);
    setState(newState);
    triggerAlert("Report automation schedule deleted successfully.", "info");
  };

  return {
    state,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
    searchQuery,
    setSearchQuery,
    customFilters,
    setCustomFilters,
    customReportResult,
    setCustomReportResult,
    schedTemplateId,
    setSchedTemplateId,
    schedFrequency,
    setSchedFrequency,
    schedEmail,
    setSchedEmail,
    triggerAlert,
    handleCompileCustomReport,
    handleCreateExport,
    handleDeleteExport,
    handleCreateSchedule,
    handleToggleSchedule,
    handleDeleteSchedule,
  };
}
