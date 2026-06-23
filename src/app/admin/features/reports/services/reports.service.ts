/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReportsState, ReportTemplate, ReportSchedule, ReportExport } from "../types/reports.types";

const INITIAL_TEMPLATES: ReportTemplate[] = [
  {
    id: "temp-1",
    name: "Organization Summary & Growth Report",
    module: "Organizations",
    description: "Evaluates active vs suspended tenant metrics, country splits, and sign-up velocity statistics."
  },
  {
    id: "temp-2",
    name: "Employee Demographics & Attrition Statistics",
    module: "Employees",
    description: "Renders headcount distribution by department, employment type, gender splits, and attrition indices."
  },
  {
    id: "temp-3",
    name: "Attendance Compliance & Overtime Log",
    module: "Attendance",
    description: "Aggregates daily attendance summaries, overtime hours, late comers list, and branch metrics."
  },
  {
    id: "temp-4",
    name: "Subscription Trial & Renewal Analytics",
    module: "Subscriptions",
    description: "Evaluates conversion ratios from trial to paid accounts, plans distribution, and expiring subscriptions warning lists."
  },
  {
    id: "temp-5",
    name: "Revenue Performance Ledger (MRR/ARR)",
    module: "Revenue",
    description: "Tracks MRR and ARR growth curves, plan-wise revenue, refunds log, and outstanding balances."
  },
  {
    id: "temp-6",
    name: "SaaS Diagnostic & API Volume Analytics",
    module: "System Usage",
    description: "Provides DAU/WAU/MAU ratios, average API latency levels, storage logs, and system error summaries."
  }
];

const INITIAL_SCHEDULES: ReportSchedule[] = [
  {
    id: "sch-1",
    templateId: "temp-5",
    reportName: "Revenue Performance Ledger (MRR/ARR)",
    frequency: "Monthly",
    email: "ceo@ems.io",
    active: true
  },
  {
    id: "sch-2",
    templateId: "temp-1",
    reportName: "Organization Summary & Growth Report",
    frequency: "Weekly",
    email: "ops-manager@ems.io",
    active: true
  }
];

const INITIAL_EXPORTS: ReportExport[] = [
  {
    id: "exp-101",
    reportName: "mrr_revenue_q1_25",
    exportType: "PDF",
    generatedAt: "2026-06-20T10:15:30Z",
    size: "1.4 MB",
    status: "Completed",
    downloadUrl: "#"
  },
  {
    id: "exp-102",
    reportName: "active_organizations_growth",
    exportType: "CSV",
    generatedAt: "2026-06-18T14:22:10Z",
    size: "124 KB",
    status: "Completed",
    downloadUrl: "#"
  },
  {
    id: "exp-103",
    reportName: "employee_attrition_analytics_2026",
    exportType: "CSV",
    generatedAt: "2026-06-15T09:00:00Z",
    size: "450 KB",
    status: "Completed",
    downloadUrl: "#"
  }
];

export const reportsService = {
  loadData(): ReportsState {
    const templates = this.getStore<ReportTemplate[]>("reports_templates", INITIAL_TEMPLATES);
    const schedules = this.getStore<ReportSchedule[]>("reports_schedules", INITIAL_SCHEDULES);
    const exports = this.getStore<ReportExport[]>("reports_exports", INITIAL_EXPORTS);
    return { templates, schedules, exports };
  },

  saveData(state: ReportsState) {
    this.saveStore("reports_templates", state.templates);
    this.saveStore("reports_schedules", state.schedules);
    this.saveStore("reports_exports", state.exports);
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

  addSchedule(state: ReportsState, newSch: Omit<ReportSchedule, "id" | "active">): ReportsState {
    const created: ReportSchedule = {
      ...newSch,
      id: `sch-${Date.now()}`,
      active: true
    };
    const newState = {
      ...state,
      schedules: [created, ...state.schedules]
    };
    this.saveData(newState);
    return newState;
  },

  toggleSchedule(state: ReportsState, id: string): ReportsState {
    const updatedSchedules = state.schedules.map(sch => {
      if (sch.id === id) {
        return { ...sch, active: !sch.active };
      }
      return sch;
    });
    const newState = {
      ...state,
      schedules: updatedSchedules
    };
    this.saveData(newState);
    return newState;
  },

  deleteSchedule(state: ReportsState, id: string): ReportsState {
    const updatedSchedules = state.schedules.filter(sch => sch.id !== id);
    const newState = {
      ...state,
      schedules: updatedSchedules
    };
    this.saveData(newState);
    return newState;
  },

  createExport(state: ReportsState, reportName: string, exportType: "PDF" | "CSV" | "Excel"): { state: ReportsState; log: string } {
    const docName = reportName.trim().toLowerCase().replace(/\s+/g, "_") || "custom_report";
    const newExport: ReportExport = {
      id: `exp-${Date.now()}`,
      reportName: `${docName}_${new Date().toISOString().slice(0,10)}`,
      exportType,
      generatedAt: new Date().toISOString(),
      size: `${Math.round(25 + Math.random() * 450)} KB`,
      status: "Completed",
      downloadUrl: "#"
    };

    const newState = {
      ...state,
      exports: [newExport, ...state.exports]
    };
    this.saveData(newState);
    return {
      state: newState,
      log: `Document '${newExport.reportName}.${exportType.toLowerCase()}' successfully generated and queued in Export Center.`
    };
  },

  deleteExport(state: ReportsState, id: string): ReportsState {
    const updatedExports = state.exports.filter(exp => exp.id !== id);
    const newState = {
      ...state,
      exports: updatedExports
    };
    this.saveData(newState);
    return newState;
  },

  // Dynamic Custom Report Tab Database Generator
  queryCustomReport(filters: { orgId: string; dateRange: string; plan: string; industry: string }) {
    // Generate deterministic rows based on filters so it looks like a real database compile
    const records = [];
    const industries = ["Technology", "Healthcare", "Manufacturing", "Finance", "Education"];
    const plans = ["Basic", "Professional", "Enterprise", "Trial"];
    
    const count = 12;
    for (let i = 0; i < count; i++) {
      const selectedIndustry = filters.industry === "all" ? industries[i % industries.length] : filters.industry;
      const selectedPlan = filters.plan === "all" ? plans[i % plans.length] : filters.plan;
      const orgName = filters.orgId === "all" ? `Org Instance #${100 + i}` : `Acme Org (${filters.orgId})`;
      
      records.push({
        id: `rec-${1000 + i}`,
        org: orgName,
        industry: selectedIndustry,
        plan: selectedPlan,
        usersCount: Math.round(50 + (i * 35)),
        revenueContribution: selectedPlan === "Enterprise" ? 4500 : selectedPlan === "Professional" ? 1200 : selectedPlan === "Basic" ? 200 : 0,
        status: i % 10 === 0 ? "Suspended" : "Active",
        healthIndex: `${Math.round(85 + (i * 1.25))}%`
      });
    }
    
    return records;
  }
};
