import type { Template } from "../types/onboarding.types";

export const DEFAULT_ONBOARDING_TEMPLATES: Template[] = [
  {
    id: "tpl-default-engineering",
    name: "Engineering Onboarding v1 (Reference)",
    code: "ENG-ONB-01",
    description: "Comprehensive standard onboarding workflow for software engineering roles. Includes all required documents, forms, policies, training, and multi-department approvals.",
    phases: 3,
    tasks: 12,
    dept: "Engineering",
    deptColor: "#00B87C",
    avgDays: "7 days",
    usageCount: 0,
    status: "active",
    version: 1,
    isDefault: true,
    sections: [
      {
        id: "sec-pre-joining",
        name: "Pre-Joining Preparation",
        tasks: [
          { id: "t1", name: "Send Welcome Email & Offer Letter", owner: "HR Manager", mandatory: true, dueDays: 7, priority: "High", description: "HR initiates communication with the candidate." },
          { id: "t2", name: "Create Company Email & Slack Account", owner: "IT Admin", mandatory: true, dueDays: 3, priority: "High", description: "IT sets up digital credentials." },
          { id: "t3", name: "Procure Laptop and Accessories", owner: "IT Admin", mandatory: true, dueDays: 5, priority: "Medium", description: "Asset allocation preparation." },
          { id: "t4", name: "Manager Approval for Asset Allocation", owner: "Engineering Manager", mandatory: true, dueDays: 4, priority: "High", description: "Manager approves IT hardware requests." }
        ]
      },
      {
        id: "sec-day-one",
        name: "Day 1 Orientation",
        tasks: [
          { id: "t5", name: "Submit ID Proofs and Tax Forms", owner: "Employee", mandatory: true, dueDays: 1, priority: "High", description: "Employee checklist item for day one." },
          { id: "t6", name: "Office Tour and Team Introduction", owner: "Engineering Manager", mandatory: false, dueDays: 1, priority: "Medium", description: "Manager welcomes the new hire." },
          { id: "t7", name: "Set up Payroll and Bank Account Details", owner: "Finance Manager", mandatory: true, dueDays: 2, priority: "High", description: "Finance processes payroll info." },
          { id: "t8", name: "IT Security Briefing Checklist", owner: "IT Admin", mandatory: true, dueDays: 1, priority: "High", description: "Checklist for physical and digital security briefing." }
        ]
      },
      {
        id: "sec-week-one",
        name: "Week 1 Ramp-up",
        tasks: [
          { id: "t9", name: "Complete Security Awareness Training", owner: "Employee", mandatory: true, dueDays: 7, priority: "High", description: "Mandatory training completion." },
          { id: "t10", name: "Codebase Walkthrough and Local Setup", owner: "Team Lead", mandatory: true, dueDays: 5, priority: "High", description: "Engineering onboarding." },
          { id: "t11", name: "First Code Commit & PR Review", owner: "Employee", mandatory: false, dueDays: 7, priority: "Medium", description: "Employee pushes first commit." },
          { id: "t12", name: "Check-in Meeting with HR", owner: "HR Manager", mandatory: true, dueDays: 7, priority: "Medium", description: "End of week feedback session." }
        ]
      }
    ],
    documents: [
      { id: "d1", name: "Signed Offer Letter", mandatory: true, maxSize: 5, allowedTypes: ["pdf"], needVerification: true, visibleToEmployee: true },
      { id: "d2", name: "Government ID Proof", mandatory: true, maxSize: 5, allowedTypes: ["pdf", "jpg", "png"], needVerification: true, visibleToEmployee: true },
      { id: "d3", name: "Bank Account Details (Void Cheque)", mandatory: true, maxSize: 2, allowedTypes: ["pdf", "jpg"], needVerification: true, visibleToEmployee: true },
      { id: "d4", name: "Non-Disclosure Agreement (NDA)", mandatory: true, maxSize: 2, allowedTypes: ["pdf"], needVerification: true, visibleToEmployee: true }
    ],
    forms: [
      { id: "f1", name: "Direct Deposit Authorization Form", required: true },
      { id: "f2", name: "Emergency Contact Information Form", required: true },
      { id: "f3", name: "Employee Benefits Enrollment Form", required: false }
    ],
    training: [
      { id: "tr1", name: "Information Security & Data Privacy", required: true },
      { id: "tr2", name: "Workplace Harassment Prevention", required: true },
      { id: "tr3", name: "Introduction to Engineering Practices", required: true }
    ],
    policies: [
      { id: "p1", name: "Employee Handbook", required: true },
      { id: "p2", name: "Leave & Attendance Policy", required: true },
      { id: "p3", name: "Remote Work Guidelines", required: false }
    ]
  }
];
