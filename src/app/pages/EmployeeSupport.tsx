import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Headphones,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Monitor,
  IndianRupee,
  CalendarDays,
  Key,
  UserPlus,
  HeartPulse,
  X,
  MessageSquare,
  FileText,
  CheckCircle2,
  Clock,
  Paperclip,
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "framer-motion";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created: string;
  catColor: string;
  catBg: string;
  priorityColor: string;
  priorityBg: string;
  statusColor: string;
  statusBg: string;
}

const TABS = ["My Tickets", "Knowledge Base"];

const TICKETS: Ticket[] = [
  {
    id: "#TKT-0421",
    subject: "Laptop slow, need RAM upgrade",
    category: "IT Hardware",
    priority: "High",
    status: "In Progress",
    created: "Apr 5, 2026",
    catColor: "#0D9488",
    catBg: "rgba(13, 148, 136, 0.1)",
    priorityColor: "#EF4444",
    priorityBg: "rgba(239, 68, 68, 0.1)",
    statusColor: "#F59E0B",
    statusBg: "rgba(245, 158, 11, 0.1)",
  },
  {
    id: "#TKT-0398",
    subject: "VPN access required for remote work",
    category: "IT Access",
    priority: "Medium",
    status: "Resolved",
    created: "Mar 28",
    catColor: "#8B5CF6",
    catBg: "rgba(139, 92, 246, 0.1)",
    priorityColor: "#F59E0B",
    priorityBg: "rgba(245, 158, 11, 0.1)",
    statusColor: "#00B87C",
    statusBg: "rgba(0, 184, 124, 0.1)",
  },
  {
    id: "#TKT-0365",
    subject: "Email signature update needed",
    category: "HR Request",
    priority: "Low",
    status: "Resolved",
    created: "Mar 15",
    catColor: "#00B87C",
    catBg: "rgba(0, 184, 124, 0.1)",
    priorityColor: "#6B7280",
    priorityBg: "rgba(107, 114, 128, 0.1)",
    statusColor: "#00B87C",
    statusBg: "rgba(0, 184, 124, 0.1)",
  },
];

const FAQ_CATEGORIES = [
  { name: "IT Setup", icon: Monitor, count: 12 },
  { name: "Payroll Queries", icon: IndianRupee, count: 8 },
  { name: "Leave Policy", icon: CalendarDays, count: 15 },
  { name: "Access Issues", icon: Key, count: 6 },
  { name: "Onboarding", icon: UserPlus, count: 10 },
  { name: "Benefits", icon: HeartPulse, count: 14 },
];

export function EmployeeSupport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("My Tickets");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 w-full px-4 md:px-8 py-6 pb-10">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div
            className="w-11 h-11 rounded-[12px] flex items-center justify-center shadow-sm border"
            style={{
              backgroundColor: "#E0F2FE",
              borderColor: "rgba(14, 165, 233, 0.2)",
            }}
          >
            <Headphones size={22} color="#0EA5E9" />
          </div>
          <h1 className="text-[26px] font-black text-foreground leading-none">
            Support & Helpdesk
          </h1>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-white shadow-lg hover:opacity-95 active:scale-95"
          style={{
            backgroundColor: "#00B87C",
            boxShadow: "0 4px 14px rgba(0, 184, 124, 0.25)",
          }}
        >
          <Plus size={18} /> Raise New Ticket
        </button>
      </div>

      {/* ─── Ticket Stats Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div
          onClick={() => {}}
          className="bg-card p-6 rounded-[24px] border border-border shadow-sm group hover:shadow-md transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
            OPEN TICKETS
          </p>
          <p className="text-[32px] font-black" style={{ color: "#F59E0B" }}>
            2
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">
            In progress
          </p>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => {}}
          className="bg-card p-6 rounded-[24px] border border-border shadow-sm group hover:shadow-md transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
            RESOLVED
          </p>
          <p className="text-[32px] font-black" style={{ color: "#00B87C" }}>
            8
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">
            this month
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm group hover:shadow-md transition-all overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">
            AVG RESOLUTION
          </p>
          <p className="text-[32px] font-black" style={{ color: "#111827" }}>
            1.2 days
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">
            response time
          </p>
        </div>
      </div>

      {/* ─── Tab Bar ─────────────────────────────────────────────── */}
      <div className="bg-card rounded-[16px] border border-border shadow-sm p-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-[12px] text-[14px] transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-primary text-white font-black shadow-md shadow-primary/20"
                : "text-muted-foreground font-bold hover:bg-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ──────────────────────────────────────────── */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "My Tickets" && (
              <MyTicketsTab onViewTicket={(t: Ticket) => setViewingTicket(t)} />
            )}
            {activeTab === "Knowledge Base" && <KnowledgeBaseTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Modals ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showNewTicketModal && (
          <NewTicketModal onClose={() => setShowNewTicketModal(false)} />
        )}
        {viewingTicket && (
          <TicketDetailModal
            ticket={viewingTicket}
            onClose={() => setViewingTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function MyTicketsTab({ onViewTicket }: { onViewTicket: (t: Ticket) => void }) {
  return (
    <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/30">
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                TICKET ID
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                SUBJECT
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                CATEGORY
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                PRIORITY
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                STATUS
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                CREATED
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TICKETS.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-secondary/50 transition-colors group cursor-pointer"
                onClick={() => onViewTicket(row)}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-[12px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {row.id}
                  </span>
                </td>
                <td className="px-6 py-4 text-[14px] font-bold text-foreground max-w-[250px] truncate">
                  {row.subject}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    style={{
                      backgroundColor: row.catBg,
                      color: row.catColor,
                      borderColor: row.catBg,
                    }}
                  >
                    {row.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    style={{
                      backgroundColor: row.priorityBg,
                      color: row.priorityColor,
                      borderColor: row.priorityBg,
                    }}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    style={{
                      backgroundColor: row.statusBg,
                      color: row.statusColor,
                      borderColor: row.statusBg,
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">
                  {row.created}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary text-[13px] font-bold hover:underline whitespace-nowrap">
                    View ›
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewTicketModal({ onClose }: { onClose: () => void }) {
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      "Ticket Raised",
      "success",
      "Your support ticket has been submitted successfully.",
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] dark:bg-black/60"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-white dark:bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary border border-emerald-500/20 shadow-sm">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
                RAISE NEW REQUEST
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                Submit your query to the HR team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  REQUEST CATEGORY
                </label>
                <div className="relative">
                  <select className="w-full bg-[#F0FDF4] dark:bg-emerald-950/50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-primary appearance-none transition-all">
                    <option
                      value="HR Support"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      HR Support
                    </option>
                    <option
                      value="IT Hardware"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      IT Hardware
                    </option>
                    <option
                      value="IT Software"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      IT Software
                    </option>
                    <option
                      value="Payroll"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Payroll
                    </option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  PRIORITY LEVEL
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["Low", "Medium", "High", "Urgent"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`py-3.5 rounded-2xl text-[13px] font-black transition-all border-2 ${
                        priority === level
                          ? "bg-[#00B87C] text-white border-[#00B87C] shadow-lg shadow-emerald-500/20 scale-[1.02]"
                          : "bg-[#F0FDF4]/50 dark:bg-emerald-500/5 text-slate-500 border-transparent hover:border-emerald-500/20"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  MESSAGE / DESCRIPTION
                </label>
                <textarea
                  placeholder="Explain your query in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-3xl px-6 py-5 text-[15px] font-medium text-foreground placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all min-h-[160px] resize-none"
                />
              </div>

              <div className="p-5 border-2 border-dashed border-emerald-500/10 rounded-3xl flex items-center justify-between group hover:border-primary/40 cursor-pointer transition-all bg-[#F0FDF4]/20 dark:bg-emerald-500/5">
                <div className="flex items-center gap-4">
                  <div className="text-slate-500 group-hover:text-primary transition-colors">
                    <Paperclip size={20} />
                  </div>
                  <span className="text-[14px] font-black text-slate-600 dark:text-slate-400">
                    Attach Document (Optional)
                  </span>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  PDF, JPG
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4.5 px-8 border border-slate-200 dark:border-border rounded-[20px] text-[15px] font-black text-slate-500 hover:bg-secondary transition-all uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-[1.5] py-4.5 px-8 bg-[#00B87C] text-white rounded-[20px] text-[15px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all"
              >
                SUBMIT REQUEST
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function TicketDetailModal({
  ticket,
  onClose,
}: {
  ticket: Ticket;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] dark:bg-black/60"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative bg-card w-full max-w-[500px] h-full shadow-2xl border-l border-border flex flex-col"
      >
        <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">
                {ticket.id}
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                Raised on {ticket.created}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Status
              </p>
              <div className="flex">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border"
                  style={{
                    backgroundColor: ticket.statusBg,
                    color: ticket.statusColor,
                    borderColor: ticket.statusBg,
                  }}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Priority
              </p>
              <div className="flex">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border"
                  style={{
                    backgroundColor: ticket.priorityBg,
                    color: ticket.priorityColor,
                    borderColor: ticket.priorityBg,
                  }}
                >
                  {ticket.priority}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Category
              </p>
              <p className="text-[15px] font-black text-foreground">
                {ticket.category}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Assigned To
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black text-primary">
                  IT
                </div>
                <p className="text-[14px] font-bold text-foreground">
                  IT Support Team
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Subject
            </p>
            <h4 className="text-[18px] font-black text-foreground leading-tight">
              {ticket.subject}
            </h4>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Description
            </p>
            <div className="p-5 bg-secondary/30 rounded-2xl border border-border text-[14px] font-medium text-foreground leading-relaxed italic">
              "The current laptop is struggling with performance when running
              multiple development environments. It seems like the 8GB RAM is
              insufficient. Requesting an upgrade to 16GB or 32GB if possible to
              maintain productivity."
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Ticket Timeline
            </p>
            <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
              <div className="relative flex gap-4">
                <div className="absolute -left-6 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-4 border-card z-10 shadow-sm">
                  <Plus size={10} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-foreground leading-none">
                    Ticket Created
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-1">
                    by Priya Sharma • {ticket.created}
                  </p>
                </div>
              </div>
              <div className="relative flex gap-4">
                <div className="absolute -left-6 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white border-4 border-card z-10 shadow-sm animate-pulse">
                  <Clock size={10} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-foreground leading-none">
                    Assigned to IT Team
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-1">
                    Awaiting technician pick-up
                  </p>
                </div>
              </div>
              <div className="relative flex gap-4 opacity-40">
                <div className="absolute -left-6 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border-4 border-card z-10">
                  <CheckCircle2 size={10} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-foreground leading-none">
                    Resolution Provided
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-1">
                    Status will update to Resolved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-secondary/30 border-t border-border flex gap-4">
          <button className="flex-1 py-4 bg-card border border-border rounded-2xl text-[13px] font-black text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2">
            <FileText size={18} /> Add Comment
          </button>
          <button className="flex-1 py-4 bg-card border border-border rounded-2xl text-[13px] font-black text-rose-500 hover:bg-rose-50 transition-all">
            Cancel Ticket
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function KnowledgeBaseTab() {
  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full bg-card border border-border rounded-full pl-14 pr-6 py-4 text-[15px] font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-sm"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {FAQ_CATEGORIES.map((category, i) => (
          <div
            key={i}
            className="bg-card p-6 rounded-[24px] border border-border shadow-sm group hover:border-primary transition-all cursor-pointer hover:shadow-md flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 mb-5 group-hover:scale-110 transition-transform">
              <category.icon size={22} />
            </div>
            <h3 className="text-[16px] font-black text-foreground mb-2 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <div className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-border mb-4">
              {category.count} Articles
            </div>
            <div className="flex items-center gap-1 text-primary text-[12px] font-black mt-auto">
              Browse{" "}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
