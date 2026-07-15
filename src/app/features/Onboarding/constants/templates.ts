import type { Template } from "../types/onboarding.types";

/* ─── Onboarding Templates ─── */
export const TEMPLATES: Template[] = [
  { id: "tpl1", name: "Engineering Onboarding", phases: 5, tasks: 28, dept: "Engineering", deptColor: "#00B87C", avgDays: "14 days", usageCount: 12 },
  { id: "tpl2", name: "Sales Onboarding", phases: 5, tasks: 22, dept: "Sales", deptColor: "#F59E0B", avgDays: "10 days", usageCount: 8 },
  { id: "tpl3", name: "Finance Onboarding", phases: 5, tasks: 25, dept: "Finance", deptColor: "#0EA5E9", avgDays: "12 days", usageCount: 6 },
  { id: "tpl4", name: "General Onboarding", phases: 4, tasks: 18, dept: "All Depts", deptColor: "#8B5CF6", avgDays: "10 days", usageCount: 24 },
  { id: "tpl5", name: "Intern Onboarding", phases: 3, tasks: 12, dept: "All Depts", deptColor: "#14B8A6", avgDays: "7 days", usageCount: 15 },
  { id: "tpl6", name: "Custom (blank)", phases: 0, tasks: 0, dept: "—", deptColor: "#6B7280", avgDays: "—", usageCount: 0 },
];
