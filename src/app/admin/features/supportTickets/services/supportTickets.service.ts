// ─── Support & Tickets — Service Layer ───────────────────────────────────────
import { supportDb } from "../supportTickets.mock";
import type { Ticket, Issue, FeatureRequest, Feedback, SLAPolicy, KBArticle, EscalationRule, TicketMessage } from "../types/types";

export const SupportService = {
  // ── Tickets ────────────────────────────────────────────────────────────────
  getTickets: (): Ticket[] => supportDb.tickets.get(),

  updateTicketStatus(id: string, status: Ticket["status"]) {
    const all = supportDb.tickets.get();
    supportDb.tickets.save(all.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString(), resolvedAt: status === "Resolved" || status === "Closed" ? new Date().toISOString() : t.resolvedAt } : t));
  },

  assignTicket(id: string, agent: string) {
    const all = supportDb.tickets.get();
    supportDb.tickets.save(all.map(t => t.id === id ? { ...t, assignedTo: agent || null, status: agent ? "Assigned" as const : t.status, updatedAt: new Date().toISOString() } : t));
  },

  addMessage(ticketId: string, msg: TicketMessage) {
    const all = supportDb.tickets.get();
    supportDb.tickets.save(all.map(t => t.id === ticketId ? { ...t, messages: [...t.messages, msg], updatedAt: new Date().toISOString() } : t));
  },

  // ── Issues ─────────────────────────────────────────────────────────────────
  getIssues: (): Issue[] => supportDb.issues.get(),

  updateIssueStatus(id: string, status: Issue["status"]) {
    const all = supportDb.issues.get();
    supportDb.issues.save(all.map(i => i.id === id ? { ...i, status, updatedAt: new Date().toISOString(), resolvedAt: status === "Resolved" || status === "Closed" ? new Date().toISOString() : i.resolvedAt } : i));
  },

  // ── Feature Requests ───────────────────────────────────────────────────────
  getFeatureRequests: (): FeatureRequest[] => supportDb.featureRequests.get(),

  voteForFeature(id: string) {
    const all = supportDb.featureRequests.get();
    supportDb.featureRequests.save(all.map(f => f.id === id ? { ...f, votes: f.votes + 1 } : f));
  },

  // ── Feedback ───────────────────────────────────────────────────────────────
  getFeedback: (): Feedback[] => supportDb.feedback.get(),

  // ── SLA ────────────────────────────────────────────────────────────────────
  getSLAPolicies: (): SLAPolicy[] => supportDb.slaPolicies.get(),

  updateSLAPolicy(id: string, updates: Partial<SLAPolicy>) {
    const all = supportDb.slaPolicies.get();
    supportDb.slaPolicies.save(all.map(s => s.id === id ? { ...s, ...updates } : s));
  },

  // ── KB ─────────────────────────────────────────────────────────────────────
  getKBArticles: (): KBArticle[] => supportDb.kbArticles.get(),

  // ── Escalation ─────────────────────────────────────────────────────────────
  getEscalationRules: (): EscalationRule[] => supportDb.escalationRules.get(),

  toggleEscalationRule(id: string) {
    const all = supportDb.escalationRules.get();
    supportDb.escalationRules.save(all.map(r => r.id === id ? { ...r, active: !r.active } : r));
  },
};
