import type { OffboardingTemplate } from "../types/offboarding.types";

/** Demonstration-only template. Replace this array with API data when available. */
export const OFFBOARDING_MOCK_TEMPLATES: OffboardingTemplate[] = [{
  id: "mock-offboarding-engineering", name: "Reference: Engineering Exit", code: "OFF-ENG-001",
  description: "Reference company exit workflow with employee actions, asset recovery, and departmental sign-offs.", department: "Engineering", status: "active", version: 1, isDefault: true,
  clearances: [
    { id: "manager", dept: "Manager", person: "Reporting Manager", tasks: [{ id: "handover", name: "Approve knowledge handover", owner: "Manager", isMandatory: true }] },
    { id: "it", dept: "IT", person: "IT Team", tasks: [{ id: "access", name: "Revoke system access and confirm asset return", owner: "IT", isMandatory: true }] },
    { id: "finance", dept: "Finance", person: "Finance Team", tasks: [{ id: "settlement", name: "Verify final settlement inputs", owner: "Finance", isMandatory: true }] },
    { id: "hr", dept: "HR", person: "HR Team", tasks: [{ id: "interview", name: "Complete exit interview", owner: "HR", isMandatory: true }] },
    { id: "admin", dept: "Admin", person: "Admin Team", tasks: [{ id: "card", name: "Confirm access-card return", owner: "Admin", isMandatory: true }] },
  ],
  assets: [{ id: "laptop", name: "Company Laptop", category: "Hardware", mandatory: true }, { id: "card", name: "Office Access Card", category: "Security", mandatory: true }],
  documents: [{ id: "resignation", name: "Resignation Letter", mandatory: true }, { id: "handover-notes", name: "Handover Notes", mandatory: true }],
  exitInterviewRequired: true, exitInterviewQuestionnaire: ["Why are you leaving?", "What could we improve?"],
  knowledgeTransferChecklist: ["Document current work status", "Share handover notes with the team"],
  settlementChecklist: ["Confirm final salary", "Confirm leave encashment"],
  customTasks: [{ id: "employee-declaration", name: "Submit exit declaration", owner: "Employee", dueDays: 2, priority: "High", mandatory: true }],
}];
