// ─── Support & Tickets — Mock Data ───────────────────────────────────────────
import type {
  Ticket, Issue, FeatureRequest, Feedback,
  SLAPolicy, KBArticle, EscalationRule,
} from "./types/types";

// localStorage helpers (scoped to support module)
function getStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`ems_support_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function saveStore<T>(key: string, val: T) {
  try { localStorage.setItem(`ems_support_${key}`, JSON.stringify(val)); }
  catch (e) { console.error(e); }
}

// ── Seed: Tickets ────────────────────────────────────────────────────────────
const seedTickets: Ticket[] = [
  {
    id: "tkt-1", ticketNo: "TKT-2026-001",
    subject: "Unable to Generate Payroll for June",
    description: "When clicking 'Generate Payroll' for June 2026, the system shows a blank page. No error message displayed. Tried on Chrome and Edge.",
    category: "Payroll", priority: "Critical", status: "Open",
    organizationId: "org-1", organization: "Acme Enterprise",
    createdBy: "sarah.hr@acme.com", assignedTo: "Sophia Vance",
    createdAt: "2026-06-22T08:00:00Z", updatedAt: "2026-06-22T10:30:00Z",
    resolvedAt: null, slaBreached: false, linkedIssueId: null,
    tags: ["payroll", "critical", "bug"],
    messages: [
      { id: "msg-1", sender: "customer", senderName: "Sarah HR", message: "Hi, payroll generation is completely broken for June. We need this urgently.", timestamp: "2026-06-22T08:05:00Z" },
      { id: "msg-2", sender: "support", senderName: "Sophia Vance", message: "Hi Sarah, I'm looking into this right now. Can you confirm if this affects all employee groups or just a specific department?", timestamp: "2026-06-22T08:20:00Z" },
    ],
  },
  {
    id: "tkt-2", ticketNo: "TKT-2026-002",
    subject: "Employee Cannot Mark Attendance via Mobile",
    description: "Multiple employees report that the mobile attendance check-in button is greyed out since this morning.",
    category: "Attendance", priority: "High", status: "Assigned",
    organizationId: "org-2", organization: "Apex Global",
    createdBy: "hr@apex-corp.com", assignedTo: "Marcus Brody",
    createdAt: "2026-06-21T14:00:00Z", updatedAt: "2026-06-22T09:00:00Z",
    resolvedAt: null, slaBreached: false, linkedIssueId: "issue-1",
    tags: ["attendance", "mobile"],
    messages: [
      { id: "msg-3", sender: "customer", senderName: "HR Team", message: "About 30 employees can't check in this morning. Please help!", timestamp: "2026-06-21T14:05:00Z" },
    ],
  },
  {
    id: "tkt-3", ticketNo: "TKT-2026-003",
    subject: "How to Configure Leave Carry Forward?",
    description: "We want to allow employees to carry forward up to 5 days of annual leave. Where is this setting?",
    category: "Leave Management", priority: "Low", status: "Resolved",
    organizationId: "org-3", organization: "Stellar Tech SRL",
    createdBy: "contact@stellar.io", assignedTo: "Emily Watson",
    createdAt: "2026-06-20T06:30:00Z", updatedAt: "2026-06-20T11:00:00Z",
    resolvedAt: "2026-06-20T11:00:00Z", slaBreached: false, linkedIssueId: null,
    tags: ["leave", "configuration"],
    messages: [
      { id: "msg-4", sender: "customer", senderName: "Stellar Admin", message: "Where can I find the carry-forward setting?", timestamp: "2026-06-20T06:35:00Z" },
      { id: "msg-5", sender: "support", senderName: "Emily Watson", message: "Navigate to Organization Settings → Leave Settings → Carry Forward Rules. You can set the maximum days there.", timestamp: "2026-06-20T07:00:00Z" },
      { id: "msg-6", sender: "customer", senderName: "Stellar Admin", message: "Found it! Thank you so much.", timestamp: "2026-06-20T11:00:00Z" },
    ],
  },
  {
    id: "tkt-4", ticketNo: "TKT-2026-004",
    subject: "Subscription Invoice Not Received",
    description: "We haven't received the invoice for our June subscription payment. Please resend.",
    category: "Invoice", priority: "Medium", status: "Closed",
    organizationId: "org-1", organization: "Acme Enterprise",
    createdBy: "billing@acme.com", assignedTo: "Alex Reed",
    createdAt: "2026-06-19T10:00:00Z", updatedAt: "2026-06-19T15:00:00Z",
    resolvedAt: "2026-06-19T14:30:00Z", slaBreached: false, linkedIssueId: null,
    tags: ["billing", "invoice"],
    messages: [],
  },
  {
    id: "tkt-5", ticketNo: "TKT-2026-005",
    subject: "Login Page Shows 500 Error Intermittently",
    description: "Our users are seeing intermittent 500 errors on the login page since yesterday afternoon.",
    category: "Login Issues", priority: "Critical", status: "In Progress",
    organizationId: "org-2", organization: "Apex Global",
    createdBy: "it@apex-corp.com", assignedTo: "Sophia Vance",
    createdAt: "2026-06-22T06:00:00Z", updatedAt: "2026-06-22T12:00:00Z",
    resolvedAt: null, slaBreached: true, linkedIssueId: "issue-2",
    tags: ["login", "error-500", "intermittent"],
    messages: [
      { id: "msg-7", sender: "customer", senderName: "IT Team", message: "We're getting 500 errors on the login page. Happening roughly every 3rd attempt.", timestamp: "2026-06-22T06:05:00Z" },
      { id: "msg-8", sender: "support", senderName: "Sophia Vance", message: "We've identified the issue. Our engineering team is deploying a hotfix now. ETA: 2 hours.", timestamp: "2026-06-22T08:00:00Z" },
    ],
  },
];

// ── Seed: Issues ─────────────────────────────────────────────────────────────
const seedIssues: Issue[] = [
  {
    id: "issue-1", issueNo: "ISSUE-001",
    title: "Mobile Attendance Check-In API Timeout",
    description: "The attendance check-in API endpoint times out under load during peak morning hours (8-9 AM).",
    severity: "Major", status: "Fix In Progress",
    assignedDeveloper: "Rajesh Kumar", rootCause: "Database connection pool exhaustion during peak hours",
    linkedTicketIds: ["tkt-2"],
    createdAt: "2026-06-21T15:00:00Z", updatedAt: "2026-06-22T10:00:00Z", resolvedAt: null,
  },
  {
    id: "issue-2", issueNo: "ISSUE-002",
    title: "Login Service Intermittent 500 Errors",
    description: "Auth microservice throws 500 errors when Redis cache becomes temporarily unavailable.",
    severity: "Critical", status: "Investigation",
    assignedDeveloper: "Priya Sharma", rootCause: null,
    linkedTicketIds: ["tkt-5"],
    createdAt: "2026-06-22T07:00:00Z", updatedAt: "2026-06-22T12:00:00Z", resolvedAt: null,
  },
  {
    id: "issue-3", issueNo: "ISSUE-003",
    title: "Payroll PDF Export Formatting Issue",
    description: "Generated payslip PDFs have misaligned columns when employee has more than 5 deductions.",
    severity: "Minor", status: "Resolved",
    assignedDeveloper: "Alex Chen", rootCause: "CSS grid overflow in PDF template",
    linkedTicketIds: [],
    createdAt: "2026-06-15T09:00:00Z", updatedAt: "2026-06-18T14:00:00Z", resolvedAt: "2026-06-18T14:00:00Z",
  },
];

// ── Seed: Feature Requests ───────────────────────────────────────────────────
const seedFeatureRequests: FeatureRequest[] = [
  { id: "fr-1", requestId: "FR-001", featureName: "Biometric Integration", description: "Support for biometric devices (fingerprint, face recognition) for attendance.", requestedBy: "admin@acme.com", organizationId: "org-1", organization: "Acme Enterprise", votes: 125, status: "Approved", createdAt: "2026-03-10T10:00:00Z", roadmapStage: "In Development" },
  { id: "fr-2", requestId: "FR-002", featureName: "WhatsApp Notifications", description: "Send leave approvals and payslip notifications via WhatsApp.", requestedBy: "hr@apex-corp.com", organizationId: "org-2", organization: "Apex Global", votes: 89, status: "Under Review", createdAt: "2026-04-15T08:00:00Z", roadmapStage: null },
  { id: "fr-3", requestId: "FR-003", featureName: "Multi-Currency Payroll", description: "Process payroll in multiple currencies for global teams.", requestedBy: "cfo@acme.com", organizationId: "org-1", organization: "Acme Enterprise", votes: 67, status: "New", createdAt: "2026-06-01T10:00:00Z", roadmapStage: null },
  { id: "fr-4", requestId: "FR-004", featureName: "AI-Powered Leave Suggestions", description: "AI suggests optimal leave dates based on team calendar and project deadlines.", requestedBy: "contact@stellar.io", organizationId: "org-3", organization: "Stellar Tech SRL", votes: 42, status: "Released", createdAt: "2025-11-20T10:00:00Z", roadmapStage: "Released" },
];

// ── Seed: Feedback ───────────────────────────────────────────────────────────
const seedFeedback: Feedback[] = [
  { id: "fb-1", rating: 5, comment: "Excellent platform! The payroll module saved us 20 hours a month.", category: "Product", user: "HR Manager", organizationId: "org-1", organization: "Acme Enterprise", npsScore: 9, createdAt: "2026-06-18T10:00:00Z" },
  { id: "fb-2", rating: 4, comment: "Support team was very responsive. Resolved our issue within 2 hours.", category: "Support", user: "IT Admin", organizationId: "org-2", organization: "Apex Global", npsScore: 8, createdAt: "2026-06-19T14:00:00Z" },
  { id: "fb-3", rating: 3, comment: "The attendance UI could use some improvements. It's a bit confusing.", category: "UI", user: "Employee", organizationId: "org-3", organization: "Stellar Tech SRL", npsScore: 6, createdAt: "2026-06-20T09:00:00Z" },
  { id: "fb-4", rating: 5, comment: "Training session on payroll configuration was very helpful!", category: "Training", user: "HR Lead", organizationId: "org-1", organization: "Acme Enterprise", npsScore: 10, createdAt: "2026-06-21T16:00:00Z" },
  { id: "fb-5", rating: 2, comment: "Had to wait too long for a response on a critical ticket.", category: "Support", user: "Admin", organizationId: "org-2", organization: "Apex Global", npsScore: 3, createdAt: "2026-06-22T08:00:00Z" },
];

// ── Seed: SLA Policies ───────────────────────────────────────────────────────
const seedSLAPolicies: SLAPolicy[] = [
  { id: "sla-1", tier: "Critical", responseMinutes: 15, resolutionMinutes: 240, escalationMinutes: 30, active: true },
  { id: "sla-2", tier: "High", responseMinutes: 60, resolutionMinutes: 480, escalationMinutes: 120, active: true },
  { id: "sla-3", tier: "Medium", responseMinutes: 240, resolutionMinutes: 1440, escalationMinutes: 480, active: true },
  { id: "sla-4", tier: "Low", responseMinutes: 1440, resolutionMinutes: 4320, escalationMinutes: 2880, active: true },
];

// ── Seed: Knowledge Base ─────────────────────────────────────────────────────
const seedKBArticles: KBArticle[] = [
  { id: "kb-1", title: "How to Create an Employee Profile", category: "Employee Management", views: 1245, helpful: 890, updatedAt: "2026-06-15T10:00:00Z", status: "Published" },
  { id: "kb-2", title: "Generating Monthly Payroll — Step by Step", category: "Payroll", views: 2100, helpful: 1650, updatedAt: "2026-06-10T14:00:00Z", status: "Published" },
  { id: "kb-3", title: "Configuring Attendance Shift Rules", category: "Attendance", views: 870, helpful: 620, updatedAt: "2026-06-12T09:00:00Z", status: "Published" },
  { id: "kb-4", title: "Setting Up Leave Approval Workflows", category: "Leave Management", views: 1530, helpful: 1100, updatedAt: "2026-06-08T16:00:00Z", status: "Published" },
  { id: "kb-5", title: "Integrating Third-Party Biometric Devices", category: "Integrations", views: 320, helpful: 180, updatedAt: "2026-06-20T11:00:00Z", status: "Draft" },
];

// ── Seed: Escalation Rules ───────────────────────────────────────────────────
const seedEscalationRules: EscalationRule[] = [
  { id: "esc-1", name: "Critical No-Response Escalation", priority: "Critical", noResponseMinutes: 15, escalateTo: "Support Manager", level: "Manager", active: true },
  { id: "esc-2", name: "High Priority Auto-Escalation", priority: "High", noResponseMinutes: 60, escalateTo: "L2 Support Lead", level: "L2", active: true },
  { id: "esc-3", name: "Medium Priority Escalation", priority: "Medium", noResponseMinutes: 240, escalateTo: "L2 Support", level: "L2", active: true },
  { id: "esc-4", name: "Low Priority Reminder", priority: "Low", noResponseMinutes: 1440, escalateTo: "L1 Support", level: "L1", active: false },
];

// ── Exported DB accessor ─────────────────────────────────────────────────────
export const supportDb = {
  tickets:         { get: () => getStore("tickets", seedTickets),                 save: (d: Ticket[]) => saveStore("tickets", d) },
  issues:          { get: () => getStore("issues", seedIssues),                   save: (d: Issue[]) => saveStore("issues", d) },
  featureRequests: { get: () => getStore("featureRequests", seedFeatureRequests),  save: (d: FeatureRequest[]) => saveStore("featureRequests", d) },
  feedback:        { get: () => getStore("feedback", seedFeedback),               save: (d: Feedback[]) => saveStore("feedback", d) },
  slaPolicies:     { get: () => getStore("slaPolicies", seedSLAPolicies),         save: (d: SLAPolicy[]) => saveStore("slaPolicies", d) },
  kbArticles:      { get: () => getStore("kbArticles", seedKBArticles),           save: (d: KBArticle[]) => saveStore("kbArticles", d) },
  escalationRules: { get: () => getStore("escalationRules", seedEscalationRules), save: (d: EscalationRule[]) => saveStore("escalationRules", d) },
};
