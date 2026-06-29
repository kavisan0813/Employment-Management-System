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
    | "subscriptions"
    | "revenue"
    | "custom"
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
  };
}
