import React, { useState } from "react";
import { Search, X, CheckCircle2, Send, MessageSquare, AlertCircle } from "lucide-react";
import type { Ticket, TicketMessage, TicketResolution, TicketStatus } from "../types/types";
import { useSupportTickets } from "../hooks/useSupportTickets";

const AGENTS = ["Sophia Vance", "Marcus Brody", "Emily Watson", "Alex Reed"];

const RESOLUTIONS: TicketResolution[] = [
  "Resolved",
  "Workaround Provided",
  "Duplicate",
  "Not Reproducible",
  "Feature Request",
  "User Error",
  "Configuration Updated",
];

export function TicketsTable({
  hook,
}: {
  hook: ReturnType<typeof useSupportTickets>;
}) {
  const { filteredTickets, filters, actions } = hook;
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  
  // Resolution modal / form state
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<TicketResolution>("Resolved");
  const [resolutionNote, setResolutionNote] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    const msg: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: "support",
      senderName: "Admin",
      message: replyText,
      timestamp: new Date().toISOString(),
    };
    actions.addMessage(selectedTicket.id, msg);
    setReplyText("");
    const updated = hook.tickets.find((t: Ticket) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const handleResolveConfirm = () => {
    if (!selectedTicket) return;
    actions.updateTicketStatus(
      selectedTicket.id,
      "Resolved",
      selectedResolution,
      resolutionNote.trim() || undefined,
    );
    setIsResolveModalOpen(false);
    setResolutionNote("");
    const updated = hook.tickets.find((t: Ticket) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    if (newStatus === "Resolved" || newStatus === "Closed") {
      setIsResolveModalOpen(true);
    } else {
      actions.updateTicketStatus(selectedTicket.id, newStatus);
      const updated = hook.tickets.find((t: Ticket) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  const statusColor = (s: string) => {
    if (s === "Open") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "Assigned") return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (s === "In Progress") return "bg-amber-50 text-amber-700 border-amber-200";
    if (s === "Resolved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const priorityColor = (p: string) => {
    if (p === "Critical") return "bg-red-50 text-red-700 border-red-200";
    if (p === "High") return "bg-orange-50 text-orange-700 border-orange-200";
    if (p === "Medium") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-semibold animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Customer Support Tickets
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage, assign, and resolve support requests from organizations.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.ticketSearch}
              onChange={(e) => filters.setTicketSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={filters.ticketStatusFilter}
            onChange={(e) => filters.setTicketStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={filters.ticketPriorityFilter}
            onChange={(e) => filters.setTicketPriorityFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Ticket</th>
                <th className="px-5 py-3">Organization</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Resolution</th>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((t: Ticket) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900 truncate max-w-[200px]">
                      {t.subject}
                    </p>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                      {t.ticketNo}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium">
                    {t.organization}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityColor(t.priority)}`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(t.status)}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {t.resolution ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {t.resolution}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium text-xs">
                    {t.assignedTo || "Unassigned"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-gray-400"
                  >
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversation / Details Drawer */}
      {selectedTicket && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">
                {selectedTicket.ticketNo}
              </span>
              <h2 className="text-sm font-bold text-gray-900 mt-0.5 truncate max-w-sm">
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

          {/* Controls */}
          <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Agent
              </span>
              <select
                value={selectedTicket.assignedTo || ""}
                onChange={(e) => {
                  actions.assignTicket(selectedTicket.id, e.target.value);
                  actions.loadAll();
                  const upd = hook.tickets.find(
                    (t: Ticket) => t.id === selectedTicket.id,
                  );
                  if (upd) setSelectedTicket(upd);
                }}
                className="bg-white border rounded-lg px-2 py-1 text-xs font-semibold outline-none"
              >
                <option value="">Unassigned</option>
                {AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Status
              </span>
              <select
                value={selectedTicket.status}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                className="bg-white border rounded-lg px-2 py-1 text-xs font-semibold outline-none"
              >
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex gap-1 ml-auto">
              {selectedTicket.status !== "Resolved" &&
                selectedTicket.status !== "Closed" && (
                  <button
                    onClick={() => setIsResolveModalOpen(true)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Resolve
                  </button>
                )}
            </div>
          </div>

          {/* Resolution Badge if Resolved */}
          {selectedTicket.resolution && (
            <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolution: {selectedTicket.resolution}
                </span>
                {selectedTicket.resolvedAt && (
                  <span className="text-[10px] text-emerald-600 font-mono">
                    {new Date(selectedTicket.resolvedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {selectedTicket.resolutionNote && (
                <p className="text-emerald-700 italic text-[11px]">
                  "{selectedTicket.resolutionNote}"
                </p>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30 space-y-4">
            <div className="p-3 bg-white border border-gray-100 rounded-xl">
              <span className="text-[10px] font-bold text-gray-400 block mb-1">
                INITIAL DESCRIPTION
              </span>
              <p className="text-xs text-gray-700 leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>
            {selectedTicket.messages.map((msg) => {
              const isSupport = msg.sender === "support";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSupport ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${isSupport ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"}`}
                  >
                    <p className="mb-1 text-[10px] opacity-75 font-mono">
                      {msg.senderName} •{" "}
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer font-bold text-xs flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {isResolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6">
            <div className="flex items-center gap-2 text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="font-bold text-gray-900 text-base">Resolve Ticket</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Select a resolution reason and optional notes before marking <strong>{selectedTicket.ticketNo}</strong> as resolved.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Resolution Reason *
                </label>
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value as TicketResolution)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  {RESOLUTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Resolution Note / Solution Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Provide resolution details or workaround explanation..."
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
