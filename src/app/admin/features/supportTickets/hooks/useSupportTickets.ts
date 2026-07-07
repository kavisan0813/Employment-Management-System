// ─── Support & Tickets — React Hook ──────────────────────────────────────────
import { useState, useEffect, useMemo } from "react";
import { SupportService } from "../services/supportTickets.service";
import type {
  Ticket,
  Issue,
  FeatureRequest,
  Feedback,
  SLAPolicy,
  KBArticle,
  EscalationRule,
  TicketMessage,
} from "../types/types";

export function useSupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [slaPolicies, setSLAPolicies] = useState<SLAPolicy[]>([]);
  const [kbArticles, setKBArticles] = useState<KBArticle[]>([]);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);

  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("ALL");
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState("ALL");

  const loadAll = () => {
    setTickets(SupportService.getTickets());
    setIssues(SupportService.getIssues());
    setFeatureRequests(SupportService.getFeatureRequests());
    setFeedback(SupportService.getFeedback());
    setSLAPolicies(SupportService.getSLAPolicies());
    setKBArticles(SupportService.getKBArticles());
    setEscalationRules(SupportService.getEscalationRules());
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.ticketNo.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.organization.toLowerCase().includes(ticketSearch.toLowerCase());
      const matchStatus =
        ticketStatusFilter === "ALL" || t.status === ticketStatusFilter;
      const matchPriority =
        ticketPriorityFilter === "ALL" || t.priority === ticketPriorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tickets, ticketSearch, ticketStatusFilter, ticketPriorityFilter]);

  // Dashboard stats
  const stats = useMemo(() => {
    const open = tickets.filter(
      (t) =>
        t.status === "Open" ||
        t.status === "Assigned" ||
        t.status === "In Progress",
    ).length;
    const resolved = tickets.filter(
      (t) => t.status === "Resolved" || t.status === "Closed",
    ).length;
    const slaBreached = tickets.filter((t) => t.slaBreached).length;
    const criticalOpen = tickets.filter(
      (t) =>
        t.priority === "Critical" &&
        t.status !== "Closed" &&
        t.status !== "Resolved",
    ).length;
    const avgRating =
      feedback.length > 0
        ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
        : 0;
    const avgNPS =
      feedback.filter((f) => f.npsScore !== null).length > 0
        ? feedback
            .filter((f) => f.npsScore !== null)
            .reduce((s, f) => s + (f.npsScore || 0), 0) /
          feedback.filter((f) => f.npsScore !== null).length
        : 0;
    return {
      open,
      resolved,
      slaBreached,
      criticalOpen,
      avgRating,
      avgNPS,
      totalTickets: tickets.length,
      totalFeedback: feedback.length,
    };
  }, [tickets, feedback]);

  return {
    tickets,
    filteredTickets,
    issues,
    featureRequests,
    feedback,
    slaPolicies,
    kbArticles,
    escalationRules,
    stats,
    filters: {
      ticketSearch,
      setTicketSearch,
      ticketStatusFilter,
      setTicketStatusFilter,
      ticketPriorityFilter,
      setTicketPriorityFilter,
    },
    actions: {
      loadAll,
      updateTicketStatus: (id: string, status: Ticket["status"]) => {
        SupportService.updateTicketStatus(id, status);
        loadAll();
      },
      assignTicket: (id: string, agent: string) => {
        SupportService.assignTicket(id, agent);
        loadAll();
      },
      addMessage: (ticketId: string, msg: TicketMessage) => {
        SupportService.addMessage(ticketId, msg);
        loadAll();
      },
      updateIssueStatus: (id: string, status: Issue["status"]) => {
        SupportService.updateIssueStatus(id, status);
        loadAll();
      },
      voteForFeature: (id: string) => {
        SupportService.voteForFeature(id);
        loadAll();
      },
      updateSLAPolicy: (id: string, updates: Partial<SLAPolicy>) => {
        SupportService.updateSLAPolicy(id, updates);
        loadAll();
      },
      toggleEscalationRule: (id: string) => {
        SupportService.toggleEscalationRule(id);
        loadAll();
      },
    },
  };
}
