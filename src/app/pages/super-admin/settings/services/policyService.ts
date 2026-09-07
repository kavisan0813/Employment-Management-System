/**
 * Centralized Tenant-Scoped Policy Service
 *
 * Provides a single source of truth for all corporate policies across:
 * - HR Policies
 * - Attendance Policies
 * - Leave Policies
 * - Payroll Policies
 * - Security Policies
 * - Expense & Travel Policies
 * - Remote Work & Code of Conduct Policies
 *
 * Enforces tenant isolation using: `nexus_policies:${orgId}`
 */

export type PolicyCategory =
  | "HR"
  | "Attendance"
  | "Leave"
  | "Payroll"
  | "Security"
  | "Expense"
  | "RemoteWork"
  | "CodeOfConduct"
  | "Offboarding";

export interface PolicyRecord {
  id: string;
  organizationId: string;
  category: PolicyCategory;
  name: string;
  description: string;
  content: string;
  version: string;
  effectiveDate: string;
  status: "Active" | "Draft" | "Archived" | "Disabled";
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_POLICIES: PolicyRecord[] = [
  {
    id: "pol-101",
    organizationId: "org-1",
    category: "HR",
    name: "Corporate Code of Conduct & Ethics",
    description: "Standards of professional conduct, workplace integrity, and anti-harassment guidelines.",
    content: "All employees must adhere to the highest standards of professional conduct, honesty, and mutual respect. Zero tolerance policy for harassment or discrimination.",
    version: "v2.1",
    effectiveDate: "2026-01-01",
    status: "Active",
    createdBy: "Super Admin",
    updatedBy: "Ryan Park",
    createdAt: "2026-01-01T09:00:00.000Z",
    updatedAt: "2026-04-10T14:30:00.000Z",
  },
  {
    id: "pol-102",
    organizationId: "org-1",
    category: "Leave",
    name: "Comprehensive Annual & Medical Leave Policy",
    description: "Guidelines for leave entitlements, accrual rules, carry-forward limits, and encashment.",
    content: "Employees are entitled to Paid Leaves (Casual, Earned, Sick). Leaves exceeding 3 consecutive days require medical certificates or prior supervisor sign-off.",
    version: "v3.0",
    effectiveDate: "2026-04-01",
    status: "Active",
    createdBy: "HR Manager",
    updatedBy: "Meera Thomas",
    createdAt: "2026-01-01T09:00:00.000Z",
    updatedAt: "2026-04-18T11:00:00.000Z",
  },
  {
    id: "pol-103",
    organizationId: "org-1",
    category: "RemoteWork",
    name: "Flexible Remote & Hybrid Work Protocol",
    description: "Eligibility criteria, work hours, data security, and communication expectations for remote employees.",
    content: "Eligible engineering and product teams may work remotely up to 2 days per week. Core working hours (10:00 AM - 4:00 PM) must be maintained.",
    version: "v1.4",
    effectiveDate: "2026-02-15",
    status: "Active",
    createdBy: "Super Admin",
    updatedBy: "Ryan Park",
    createdAt: "2026-02-15T09:00:00.000Z",
    updatedAt: "2026-03-20T16:45:00.000Z",
  },
  {
    id: "pol-104",
    organizationId: "org-1",
    category: "Expense",
    name: "Corporate Travel & Reimbursement Policy",
    description: "Reimbursable expenses, meal allowances, travel booking rules, and approval limits.",
    content: "All business expense claims must be submitted within 30 days with valid GST invoices. Domestic travel per diem allowance is capped at ₹2,500/day.",
    version: "v1.2",
    effectiveDate: "2026-01-01",
    status: "Active",
    createdBy: "Finance Admin",
    updatedBy: "Ananya Das",
    createdAt: "2026-01-01T09:00:00.000Z",
    updatedAt: "2026-04-05T10:15:00.000Z",
  },
  {
    id: "pol-105",
    organizationId: "org-1",
    category: "Security",
    name: "Information Security & Data Privacy Policy",
    description: "Password complexity requirements, multi-factor authentication, and data classification guidelines.",
    content: "Passwords must be updated every 90 days. Mandatory MFA enforcement for system administrators and remote sessions.",
    version: "v4.0",
    effectiveDate: "2026-03-01",
    status: "Active",
    createdBy: "Super Admin",
    updatedBy: "Ryan Park",
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-04-22T09:30:00.000Z",
  },
];

type PolicyListener = () => void;

class PolicyService {
  private listeners: Set<PolicyListener> = new Set();

  private getStorageKey(orgId?: string): string {
    const keyId = orgId && orgId.trim() !== "" ? orgId.trim() : "demo-tenant";
    return `nexus_policies:${keyId}`;
  }

  public getPolicies(orgId?: string): PolicyRecord[] {
    const activeOrgId = orgId && orgId.trim() !== "" ? orgId.trim() : "demo-tenant";
    const key = `nexus_policies:${activeOrgId}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        // Seed default policies with active orgId
        const seeded = DEFAULT_POLICIES.map((p) => ({ ...p, organizationId: activeOrgId }));
        localStorage.setItem(key, JSON.stringify(seeded));
        return seeded;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_POLICIES;
    }
  }

  public savePolicy(policy: Partial<PolicyRecord> & { category: PolicyCategory; name: string }, orgId?: string, authorName: string = "Super Admin"): PolicyRecord {
    const activeOrgId = orgId && orgId.trim() !== "" ? orgId.trim() : "demo-tenant";
    const policies = this.getPolicies(activeOrgId);
    const nowIso = new Date().toISOString();
    const dateStr = nowIso.split("T")[0];

    let savedRecord: PolicyRecord;

    if (policy.id) {
      const existingIdx = policies.findIndex((p) => p.id === policy.id);
      if (existingIdx > -1) {
        const existing = policies[existingIdx];
        const vParts = existing.version.replace("v", "").split(".");
        const nextPatch = (parseInt(vParts[1] || "0") + 1).toString();
        const nextVersion = `v${vParts[0]}.${nextPatch}`;

        savedRecord = {
          ...existing,
          ...policy,
          organizationId: activeOrgId,
          version: policy.version || nextVersion,
          updatedBy: authorName,
          updatedAt: nowIso,
        };
        policies[existingIdx] = savedRecord;
      } else {
        savedRecord = {
          id: policy.id,
          organizationId: activeOrgId,
          category: policy.category,
          name: policy.name,
          description: policy.description || "",
          content: policy.content || "",
          version: policy.version || "v1.0",
          effectiveDate: policy.effectiveDate || dateStr,
          status: policy.status || "Active",
          createdBy: authorName,
          updatedBy: authorName,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        policies.push(savedRecord);
      }
    } else {
      savedRecord = {
        id: `pol-${Date.now()}`,
        organizationId: activeOrgId,
        category: policy.category,
        name: policy.name,
        description: policy.description || "",
        content: policy.content || "",
        version: policy.version || "v1.0",
        effectiveDate: policy.effectiveDate || dateStr,
        status: policy.status || "Active",
        createdBy: authorName,
        updatedBy: authorName,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      policies.push(savedRecord);
    }

    const key = this.getStorageKey(activeOrgId);
    localStorage.setItem(key, JSON.stringify(policies));
    this.notifyListeners();
    return savedRecord;
  }

  public setPolicyStatus(policyId: string, status: PolicyRecord["status"], orgId?: string, authorName: string = "Super Admin"): void {
    const activeOrgId = orgId && orgId.trim() !== "" ? orgId : "default";
    const policies = this.getPolicies(activeOrgId);
    const idx = policies.findIndex((p) => p.id === policyId);
    if (idx > -1) {
      policies[idx].status = status;
      policies[idx].updatedBy = authorName;
      policies[idx].updatedAt = new Date().toISOString();
      const key = this.getStorageKey(activeOrgId);
      localStorage.setItem(key, JSON.stringify(policies));
      this.notifyListeners();
    }
  }

  public archivePolicy(policyId: string, orgId?: string, authorName: string = "Super Admin"): void {
    this.setPolicyStatus(policyId, "Archived", orgId, authorName);
  }

  public subscribe(listener: PolicyListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const policyService = new PolicyService();
