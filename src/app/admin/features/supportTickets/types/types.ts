// ─── Support & Tickets — Type Definitions ────────────────────────────────────

export type TicketStatus = "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";
export type TicketCategory =
  | "Payroll"
  | "Attendance"
  | "Leave Management"
  | "Employee Management"
  | "Login Issues"
  | "API Issues"
  | "Integration"
  | "Subscription"
  | "Payment"
  | "Invoice"
  | "Other";

export type IssueSeverity = "Minor" | "Major" | "Critical";
export type IssueStatus = "Open" | "Investigation" | "Fix In Progress" | "Testing" | "Resolved" | "Closed";

export type FeatureRequestStatus = "New" | "Under Review" | "Approved" | "Rejected" | "Released";
export type FeedbackCategory = "Product" | "Support" | "Training" | "UI";
export type SLATier = "Critical" | "High" | "Medium" | "Low";

// ─── Ticket ──────────────────────────────────────────────────────────────────

export interface TicketMessage {
  id: string;
  sender: "customer" | "support";
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNo: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  organizationId: string;
  organization: string;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  slaBreached: boolean;
  messages: TicketMessage[];
  linkedIssueId: string | null;
  tags: string[];
}

// ─── Issue ───────────────────────────────────────────────────────────────────

export interface Issue {
  id: string;
  issueNo: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  assignedDeveloper: string | null;
  rootCause: string | null;
  linkedTicketIds: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

// ─── Feature Request ─────────────────────────────────────────────────────────

export interface FeatureRequest {
  id: string;
  requestId: string;
  featureName: string;
  description: string;
  requestedBy: string;
  organizationId: string;
  organization: string;
  votes: number;
  status: FeatureRequestStatus;
  createdAt: string;
  roadmapStage: "Planned" | "In Development" | "Testing" | "Released" | null;
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export interface Feedback {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  category: FeedbackCategory;
  user: string;
  organizationId: string;
  organization: string;
  npsScore: number | null;
  createdAt: string;
}

// ─── SLA Policy ───────────────────────────────────────────────────────────────

export interface SLAPolicy {
  id: string;
  tier: SLATier;
  responseMinutes: number;
  resolutionMinutes: number;
  escalationMinutes: number;
  active: boolean;
}

// ─── Knowledge Base Article ───────────────────────────────────────────────────

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  views: number;
  helpful: number;
  updatedAt: string;
  status: "Published" | "Draft";
}

// ─── Escalation Rule ─────────────────────────────────────────────────────────

export interface EscalationRule {
  id: string;
  name: string;
  priority: TicketPriority;
  noResponseMinutes: number;
  escalateTo: string;
  level: "L1" | "L2" | "Manager" | "Admin";
  active: boolean;
}