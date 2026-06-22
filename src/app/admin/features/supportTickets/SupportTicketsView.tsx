/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { db, pushAuditLog } from "../../mockData";
import { SupportTicket, TicketMessage } from "../../types";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  X,
  Clock,
  Star,
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export default function SupportTicketsView() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Conversation input state
  const [replyText, setReplyText] = useState("");
  const [agentAssignment, setAgentAssignment] = useState("");

  const supportAgentsPool = [
    "Sophia Vance",
    "Marcus Brody",
    "Emily Watson",
    "Alex Reed",
  ];

  const refreshData = () => {
    setTickets(db.tickets.get());

    // sync selected ticket if open
    if (selectedTicket) {
      const live = db.tickets.get().find((t) => t.id === selectedTicket.id);
      if (live) setSelectedTicket(live);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const changeAgentAssignment = (agentName: string) => {
    if (!selectedTicket) return;
    const current = db.tickets.get();
    const updated = current.map((t) => {
      if (t.id === selectedTicket.id) {
        return { ...t, assignedTo: agentName || null };
      }
      return t;
    });
    db.tickets.save(updated);

    pushAuditLog(
      "ticket.agent_assigned",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      selectedTicket.organization,
      "Active",
      { ticket_id: selectedTicket.id, assigned_agent: agentName },
    );

    setAgentAssignment(agentName);
    refreshData();
  };

  // Alter status
  const modifyTicketState = (nextStatus: SupportTicket["status"]) => {
    if (!selectedTicket) return;
    const current = db.tickets.get();
    const updated = current.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    db.tickets.save(updated);

    pushAuditLog(
      "ticket.status_modified",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      selectedTicket.organization,
      "Active",
      { ticket_id: selectedTicket.id, status: nextStatus },
    );

    refreshData();
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const currentMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId: selectedTicket.id,
      author: CURRENT_ADMIN_EMAIL,
      authorType: "agent",
      body: replyText,
      createdAt: new Date().toISOString(),
    };

    const current = db.tickets.get();
    const updated = current.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: "Pending" as const, // Waiting customer response
          messages: [...(t.messages || []), currentMessage],
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    db.tickets.save(updated);

    pushAuditLog(
      "ticket.send_message",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      selectedTicket.organization,
      "Active",
      { ticket_id: selectedTicket.id },
    );

    setReplyText("");
    refreshData();
  };

  // Simulate CSAT score rating
  const injectMockCSATFeedback = () => {
    if (!selectedTicket) return;
    const current = db.tickets.get();
    const updated = current.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: "Inactive" as const, // Resolved
          csatScore: 5,
          csatComment:
            "Incredibly fast resolution by the platform admin. Thanks!",
        };
      }
      return t;
    });
    db.tickets.save(updated);

    refreshData();
    alert(
      "Simulating Customer CSAT score rating: Received 5/5 stars from tenant administrator.",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-950 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-505" />
            Support Helpdesk CRM
          </h1>
          <p className="text-xs text-gray-400">
            Manage compliance escalations, SLA priority tickets, and client
            conversations.
          </p>
        </div>
      </div>

      {/* filter row */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full text-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets by subject, ID, or organization name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-205 rounded-lg pl-9 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border rounded-lg p-2 font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Open</option>
            <option value="Pending">Awaiting Reply</option>
            <option value="Inactive">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-50 border rounded-lg p-2 font-semibold"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tenant Organization</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">SLA Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned Agent</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-gray-550">
                    {ticket.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {ticket.organization}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800 truncate max-w-xs">
                    {ticket.subject}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        ticket.priority === "Critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-150"
                          : ticket.priority === "High"
                            ? "bg-amber-5 text-amber-700 font-bold border border-amber-200"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ticket.status === "Active"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : ticket.status === "Pending"
                            ? "bg-amber-50 text-amber-501 border border-amber-100"
                            : "bg-teal-50 text-teal-700 border border-teal-100"
                      }`}
                    >
                      {ticket.status === "Active" ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : null}
                      {ticket.status === "Inactive" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : null}
                      {ticket.status === "Active"
                        ? "Open"
                        : ticket.status === "Pending"
                          ? "Awaiting Reply"
                          : "Resolved"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-600">
                    {ticket.assignedTo || "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-gray-450">
                    {new Date(ticket.updatedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setAgentAssignment(ticket.assignedTo || "");
                      }}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Enter helpdesk
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No support tickets found matching the filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidemodal Details drawer conversation */}
      {selectedTicket && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-55 flex flex-col border-l border-gray-200">
          <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-450">
                {selectedTicket.id} &middot; Ticket Portal
              </span>
              <h2 className="text-sm font-bold text-gray-950 mt-0.5 max-w-sm truncate">
                {selectedTicket.subject}
              </h2>
            </div>
            <button
              onClick={() => setSelectedTicket(null)}
              className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4 bg-gray-50/30 border-b border-gray-150 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-450 uppercase text-[9px] font-bold">
                  Assigned operator
                </span>
                <select
                  value={agentAssignment}
                  onChange={(e) => changeAgentAssignment(e.target.value)}
                  className="bg-white border rounded p-1 text-xs font-semibold"
                >
                  <option value="">Unassigned...</option>
                  {supportAgentsPool.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => modifyTicketState("Inactive")}
                  disabled={selectedTicket.status === "Inactive"}
                  className="px-2.5 py-1 bg-teal-600 text-white rounded text-[10px] font-extrabold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> MARK RESOLVED
                </button>
                {selectedTicket.status === "Inactive" &&
                  !selectedTicket.csatScore && (
                    <button
                      onClick={injectMockCSATFeedback}
                      className="px-2.5 py-1 bg-amber-500 text-white rounded text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" /> SIMULATE CSAT
                    </button>
                  )}
              </div>
            </div>

            {selectedTicket.csatScore && (
              <div className="p-3 bg-amber-50 border border-amber-250 rounded-lg text-amber-805 space-y-1">
                <div className="flex items-center gap-1 font-bold">
                  <span>CSAT Feedback Score: {selectedTicket.csatScore}/5</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: selectedTicket.csatScore }).map(
                      (_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-amber-555 text-amber-500"
                        />
                      ),
                    )}
                  </div>
                </div>
                <p className="italic text-[11px] leading-relaxed">
                  "{selectedTicket.csatComment}"
                </p>
              </div>
            )}
          </div>

          {/* Conversation chat box */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/35 space-y-4">
            <div className="p-3 bg-white border border-gray-150 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-gray-450 block">
                INITIAL PROBLEM DESCRIPTION (SLA ATTACHMENT)
              </span>
              <h4 className="text-xs font-bold text-gray-900 leading-snug">
                {selectedTicket.subject}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                {selectedTicket.description}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {selectedTicket.messages?.map((msg) => {
                const isAdmin = msg.authorType === "agent";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isAdmin
                          ? "bg-indigo-600 text-white rounded-tr-none border border-indigo-505 shadow-3xs"
                          : "bg-white border border-gray-200 text-gray-805 rounded-tl-none shadow-3xr"
                      }`}
                    >
                      <p className="mb-1 text-[10px] opacity-75 font-mono">
                        {msg.author} &bull;{" "}
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="whitespace-pre-wrap">{msg.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversation bottom input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-gray-50 border-t border-gray-150 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="State compliance response message..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg shadow-3xs cursor-pointer font-bold text-xs"
            >
              Response
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
