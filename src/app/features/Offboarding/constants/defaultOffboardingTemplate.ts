import type { OffboardingTemplate } from "../types/offboarding.types";

export const DEFAULT_OFFBOARDING_TEMPLATES: OffboardingTemplate[] = [
  {
    id: "exit-template-engineering",
    name: "Standard Offboarding - Engineering",
    code: "ENG-OFF-01",
    description: "Full exit procedure including IT asset recovery, HR compliance, and Finance full & final settlement.",
    department: "Engineering",
    status: "active",
    version: 1,
    isDefault: true,
    clearances: [
      {
        id: "clr-it",
        dept: "IT",
        person: "IT Admin",
        tasks: [
          { id: "ct1", name: "Revoke Email and Slack Access", owner: "IT Admin", isMandatory: true },
          { id: "ct2", name: "Revoke GitHub and AWS Access", owner: "IT Admin", isMandatory: true }
        ]
      },
      {
        id: "clr-finance",
        dept: "Finance",
        person: "Finance Manager",
        tasks: [
          { id: "ct3", name: "Clear Pending Reimbursements", owner: "Finance Manager", isMandatory: true },
          { id: "ct4", name: "Calculate Full & Final Settlement", owner: "Finance Manager", isMandatory: true }
        ]
      },
      {
        id: "clr-manager",
        dept: "Manager",
        person: "Team Lead",
        tasks: [
          { id: "ct5", name: "Receive Handover Documents", owner: "Team Lead", isMandatory: true },
          { id: "ct6", name: "Reassign Pending Tickets", owner: "Team Lead", isMandatory: true }
        ]
      }
    ],
    assets: [
      { id: "a1", name: "MacBook Pro", category: "Hardware", mandatory: true },
      { id: "a2", name: "Office Keys / Access Card", category: "Facilities", mandatory: true }
    ],
    documents: [
      { id: "d1", name: "Signed Resignation Letter", mandatory: true },
      { id: "d2", name: "Exit Interview Form", mandatory: true }
    ],
    exitInterviewRequired: true,
    exitInterviewQuestionnaire: [
      "What is your primary reason for leaving?",
      "How would you rate your relationship with your manager?",
      "Would you recommend working here to a friend?"
    ],
    knowledgeTransferChecklist: [
      "Document current ongoing projects",
      "List all system credentials and access codes",
      "Introduce replacement to key stakeholders"
    ]
  }
];
