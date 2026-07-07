import { useState, useRef, useMemo } from "react";
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
  Download,
  AlertCircle,
  Star,
  Send,
  Bot,
} from "lucide-react";
import { showToast } from "../../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "motion/react";

interface TimelineEntry {
  id: string;
  type:
    | "created"
    | "comment"
    | "status_change"
    | "attachment"
    | "resolved"
    | "cancelled";
  user: string;
  timestamp: string;
  comment?: string;
  attachment?: { name: string; size: string; type: string };
  newStatus?: string;
}

interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

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
  description: string;
  timeline: TimelineEntry[];
  attachments: Attachment[];
  rating?: { stars: number; feedback: string };
}

const TABS = ["My Tickets", "AI Support Assistant", "Knowledge Base"];

const INITIAL_TICKETS: Ticket[] = [
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
    description:
      "The current laptop is struggling with performance when running multiple development environments. It seems like the 8GB RAM is insufficient. Requesting an upgrade to 16GB or 32GB if possible to maintain productivity.",
    timeline: [
      {
        id: "1",
        type: "created",
        user: "Priya Sharma",
        timestamp: "Apr 5, 2026, 09:00 AM",
      },
      {
        id: "2",
        type: "status_change",
        user: "IT Support",
        timestamp: "Apr 5, 2026, 10:30 AM",
        newStatus: "In Progress",
      },
    ],
    attachments: [],
  },
  {
    id: "#TKT-0398",
    subject: "VPN access required for remote work",
    category: "IT Access",
    priority: "Medium",
    status: "Resolved",
    created: "Mar 28, 2026",
    catColor: "#8B5CF6",
    catBg: "rgba(139, 92, 246, 0.1)",
    priorityColor: "#F59E0B",
    priorityBg: "rgba(245, 158, 11, 0.1)",
    statusColor: "#00B87C",
    statusBg: "rgba(0, 184, 124, 0.1)",
    description: "Need VPN access to connect to the staging servers from home.",
    timeline: [
      {
        id: "1",
        type: "created",
        user: "Priya Sharma",
        timestamp: "Mar 28, 2026, 10:00 AM",
      },
      {
        id: "2",
        type: "resolved",
        user: "IT Support",
        timestamp: "Mar 29, 2026, 11:00 AM",
        comment: "VPN access granted.",
      },
    ],
    attachments: [],
  },
  {
    id: "#TKT-0365",
    subject: "Email signature update needed",
    category: "HR Request",
    priority: "Low",
    status: "Resolved",
    created: "Mar 15, 2026",
    catColor: "#00B87C",
    catBg: "rgba(0, 184, 124, 0.1)",
    priorityColor: "#6B7280",
    priorityBg: "rgba(107, 114, 128, 0.1)",
    statusColor: "#00B87C",
    statusBg: "rgba(0, 184, 124, 0.1)",
    description:
      "Title changed to Senior Developer, need email signature updated.",
    timeline: [
      {
        id: "1",
        type: "created",
        user: "Priya Sharma",
        timestamp: "Mar 15, 2026, 02:00 PM",
      },
      {
        id: "2",
        type: "resolved",
        user: "HR Team",
        timestamp: "Mar 16, 2026, 09:30 AM",
        comment: "Signature updated.",
      },
    ],
    attachments: [],
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
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  const [ticketStatusTab, setTicketStatusTab] = useState("All Requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        ticketStatusTab === "All Requests" ||
        (ticketStatusTab === "Open" && t.status === "Open") ||
        (ticketStatusTab === "In Progress" && t.status === "In Progress") ||
        (ticketStatusTab === "Resolved" && t.status === "Resolved") ||
        (ticketStatusTab === "Closed" && t.status === "Closed") ||
        (ticketStatusTab === "Cancelled" && t.status === "Cancelled");
      const matchCategory =
        filterCategory === "All" || t.category === filterCategory;
      const matchPriority =
        filterPriority === "All" || t.priority === filterPriority;
      return matchSearch && matchStatus && matchCategory && matchPriority;
    });
  }, [tickets, searchQuery, ticketStatusTab, filterCategory, filterPriority]);

  const handleAddTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
  };

  const handleUpdateTicket = (updated: Ticket) => {
    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
    if (viewingTicket?.id === updated.id) {
      setViewingTicket(updated);
    }
  };

  const openCount = tickets.filter((t) =>
    ["Open", "In Progress", "Waiting for Employee"].includes(t.status),
  ).length;
  const resolvedCount = tickets.filter((t) =>
    ["Resolved", "Closed"].includes(t.status),
  ).length;

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
          className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
          onClick={() => {
            setActiveTab("My Tickets");
            setTicketStatusTab("Open");
          }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            OPEN TICKETS
          </p>
          <p className="text-[32px] font-black" style={{ color: "#F59E0B" }}>
            {openCount}
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">
            In progress / Open
          </p>
        </div>

        {/* Card 2 */}
        <div
          className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
          onClick={() => {
            setActiveTab("My Tickets");
            setTicketStatusTab("Resolved");
          }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            RESOLVED
          </p>
          <p className="text-[32px] font-black" style={{ color: "#00B87C" }}>
            {resolvedCount}
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">
            total resolved
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 dark:bg-white/50/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
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
              <MyTicketsTab
                tickets={filteredTickets}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                ticketStatusTab={ticketStatusTab}
                setTicketStatusTab={setTicketStatusTab}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                onViewTicket={(t: Ticket) => setViewingTicket(t)}
              />
            )}
            {activeTab === "AI Support Assistant" && <AISupportAssistantTab />}
            {activeTab === "Knowledge Base" && <KnowledgeBaseTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Modals ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showNewTicketModal && (
          <NewTicketModal
            onAdd={handleAddTicket}
            onClose={() => setShowNewTicketModal(false)}
          />
        )}
        {viewingTicket && (
          <TicketDetailModal
            ticket={viewingTicket}
            onUpdate={handleUpdateTicket}
            onClose={() => setViewingTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function MyTicketsTab({
  tickets,
  searchQuery,
  setSearchQuery,
  ticketStatusTab,
  setTicketStatusTab,
  filterCategory,
  setFilterCategory,
  filterPriority,
  setFilterPriority,
  onViewTicket,
}: {
  tickets: Ticket[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  ticketStatusTab: string;
  setTicketStatusTab: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterPriority: string;
  setFilterPriority: (v: string) => void;
  onViewTicket: (t: Ticket) => void;
}) {
  const tabs = [
    "All Requests",
    "Open",
    "In Progress",
    "Resolved",
    "Closed",
    "Cancelled",
  ];

  return (
    <div className="space-y-4">
      {/* Filters and Tabs */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTicketStatusTab(tab)}
              className={`px-4 py-2 rounded-xl text-[13px] transition-all whitespace-nowrap ${
                ticketStatusTab === tab
                  ? "bg-secondary text-foreground font-black shadow-sm"
                  : "text-muted-foreground font-bold hover:bg-secondary/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-[13px] font-bold text-foreground focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="HR Request">HR Request</option>
            <option value="HR Support">HR Support</option>
            <option value="Payroll">Payroll</option>
            <option value="IT Hardware">IT Hardware</option>
            <option value="IT Software">IT Software</option>
            <option value="IT Access">IT Access</option>
            <option value="Leave Issue">Leave Issue</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-[13px] font-bold text-foreground focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-[13px] font-bold text-foreground focus:outline-none w-full sm:w-48 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Search size={48} className="opacity-20 mb-4" />
            <p className="font-bold">No requests found</p>
            <p className="text-[13px]">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/30">
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    TICKET ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    SUBJECT
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    CATEGORY
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    PRIORITY
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    CREATED
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((row, i) => (
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
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
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
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
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
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
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
        )}
      </div>
    </div>
  );
}

function NewTicketModal({
  onAdd,
  onClose,
}: {
  onAdd: (t: Ticket) => void;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("HR Support");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket: Ticket = {
      id: `#TKT-0${Math.floor(Math.random() * 900) + 100}`,
      subject,
      category,
      priority,
      status: "Open",
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      catColor: "#0D9488",
      catBg: "rgba(13, 148, 136, 0.1)",
      priorityColor:
        priority === "Urgent" || priority === "High"
          ? "#EF4444"
          : priority === "Medium"
            ? "#F59E0B"
            : "#6B7280",
      priorityBg:
        priority === "Urgent" || priority === "High"
          ? "rgba(239, 68, 68, 0.1)"
          : priority === "Medium"
            ? "rgba(245, 158, 11, 0.1)"
            : "rgba(107, 114, 128, 0.1)",
      statusColor: "#3B82F6",
      statusBg: "rgba(59, 130, 246, 0.1)",
      description,
      timeline: [
        {
          id: Math.random().toString(),
          type: "created",
          user: "Current Employee",
          timestamp: new Date().toLocaleString(),
        },
      ],
      attachments: file
        ? [
            {
              name: file.name,
              size: (file.size / 1024).toFixed(1) + " KB",
              type: file.type,
            },
          ]
        : [],
    };

    onAdd(newTicket);
    showToast(
      "Ticket Raised",
      "success",
      "Your support ticket has been submitted successfully.",
    );
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
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
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F0FDF4] dark:bg-emerald-950/50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-primary appearance-none transition-all"
                  >
                    <option
                      value="HR Support"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      HR Support
                    </option>
                    <option
                      value="Payroll Query"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Payroll Query
                    </option>
                    <option
                      value="Attendance Correction"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Attendance Correction
                    </option>
                    <option
                      value="Leave Issue"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Leave Issue
                    </option>
                    <option
                      value="IT Support"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      IT Support
                    </option>
                    <option
                      value="Document Request"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Document Request
                    </option>
                    <option
                      value="Other"
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-emerald-50"
                    >
                      Other
                    </option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  SUBJECT
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of the issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-6 py-4 text-[15px] font-medium text-foreground placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
                />
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

              <div
                className="p-5 border-2 border-dashed border-emerald-500/10 rounded-3xl flex items-center justify-between group hover:border-primary/40 cursor-pointer transition-all bg-[#F0FDF4]/20 dark:bg-emerald-500/5 relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-500 group-hover:text-primary transition-colors">
                    <Paperclip size={20} />
                  </div>
                  <div>
                    <span className="text-[14px] font-black text-slate-600 dark:text-slate-400 block">
                      {file ? file.name : "Attach Document (Optional)"}
                    </span>
                    {!file && (
                      <span className="text-[12px] font-bold text-primary hover:underline">
                        Click to Browse
                      </span>
                    )}
                  </div>
                </div>
                {file ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-500 transition-colors z-10"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    PDF, JPG, PNG, DOCX, XLSX
                  </span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4.5 px-8 border border-slate-200 dark:border-border rounded-2xl text-[15px] font-black text-slate-500 hover:bg-secondary transition-all uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-[1.5] py-4.5 px-8 bg-[#00B87C] text-white rounded-2xl text-[15px] font-semibold uppercase tracking-wider shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all"
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
  onUpdate,
  onClose,
}: {
  ticket: Ticket;
  onUpdate: (t: Ticket) => void;
  onClose: () => void;
}) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(
    null,
  );
  const [commentText, setCommentText] = useState("");
  const [commentFile, setCommentFile] = useState<File | null>(null);
  const commentFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedStars, setSelectedStars] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState("");

  const isClosed =
    ticket.status === "Resolved" ||
    ticket.status === "Closed" ||
    ticket.status === "Cancelled";

  const handleCancel = () => {
    const updated: Ticket = {
      ...ticket,
      status: "Cancelled",
      statusColor: "#6B7280",
      statusBg: "rgba(107, 114, 128, 0.1)",
      timeline: [
        ...ticket.timeline,
        {
          id: Math.random().toString(),
          type: "cancelled",
          user: "Current Employee",
          timestamp: new Date().toLocaleString(),
          comment: "Request cancelled by employee",
          newStatus: "Cancelled",
        },
      ],
    };
    onUpdate(updated);
    showToast(
      "Request Cancelled",
      "success",
      "Your request has been cancelled.",
    );
    setShowCancelConfirm(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim() && !commentFile) return;

    const newEntry: TimelineEntry = {
      id: Math.random().toString(),
      type: "comment",
      user: "Current Employee",
      timestamp: new Date().toLocaleString(),
      comment: commentText,
      attachment: commentFile
        ? {
            name: commentFile.name,
            size: (commentFile.size / 1024).toFixed(1) + " KB",
            type: commentFile.type,
          }
        : undefined,
    };

    const updated: Ticket = {
      ...ticket,
      timeline: [...ticket.timeline, newEntry],
    };
    onUpdate(updated);
    setCommentText("");
    setCommentFile(null);
    setShowAddComment(false);
    showToast(
      "Comment Added",
      "success",
      "Your comment has been added successfully.",
    );
  };
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
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
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Status
              </p>
              <div className="flex">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
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
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Priority
              </p>
              <div className="flex">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
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
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Category
              </p>
              <p className="text-[15px] font-black text-foreground">
                {ticket.category}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Assigned To
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold text-primary">
                  IT
                </div>
                <p className="text-[14px] font-bold text-foreground">
                  IT Support Team
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Subject
            </p>
            <h4 className="text-[18px] font-black text-foreground leading-tight">
              {ticket.subject}
            </h4>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Description
            </p>
            <div className="p-5 bg-secondary/30 rounded-2xl border border-border text-[14px] font-medium text-foreground leading-relaxed italic">
              {ticket.description || "No description provided."}
            </div>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Attachments
              </p>
              <div className="flex flex-wrap gap-3">
                {ticket.attachments.map((att, i) => (
                  <div
                    key={i}
                    onClick={() => setPreviewAttachment(att)}
                    className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border cursor-pointer hover:border-primary/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground line-clamp-1 break-all">
                        {att.name}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {att.size}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(
                          "Download Started",
                          "success",
                          `Downloading ${att.name}`,
                        );
                      }}
                      className="ml-2 p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Ticket Timeline
            </p>
            <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
              {ticket.timeline.map((entry) => (
                <div key={entry.id} className="relative flex gap-4">
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-white border-4 border-card z-10 shadow-sm ${entry.type === "created" ? "bg-primary" : entry.type === "status_change" ? "bg-amber-500" : entry.type === "comment" ? "bg-indigo-500" : entry.type === "resolved" ? "bg-emerald-500" : "bg-slate-500"}`}
                  >
                    {entry.type === "created" ? (
                      <Plus size={10} />
                    ) : entry.type === "status_change" ? (
                      <Clock size={10} />
                    ) : entry.type === "comment" ? (
                      <MessageSquare size={10} />
                    ) : entry.type === "resolved" ? (
                      <CheckCircle2 size={10} />
                    ) : (
                      <X size={10} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-black text-foreground leading-none">
                      {entry.type === "created"
                        ? "Ticket Created"
                        : entry.type === "status_change"
                          ? `Status changed to ${entry.newStatus}`
                          : entry.type === "comment"
                            ? "Comment Added"
                            : entry.type === "resolved"
                              ? "Ticket Resolved"
                              : entry.type === "cancelled"
                                ? "Ticket Cancelled"
                                : "Action"}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1">
                      by {entry.user} • {entry.timestamp}
                    </p>
                    {entry.comment && (
                      <div className="mt-2 p-3 bg-secondary/50 rounded-xl text-[13px] text-foreground border border-border">
                        {entry.comment}
                      </div>
                    )}
                    {entry.attachment && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-secondary/30 rounded-lg border border-border w-max cursor-pointer hover:bg-secondary/60">
                        <Paperclip size={14} className="text-primary" />
                        <span className="text-[12px] font-bold text-foreground">
                          {entry.attachment.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground ml-2">
                          {entry.attachment.size}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Experience Rating */}
          {ticket.status === "Resolved" && !ticket.rating ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/20 space-y-4 mt-6">
              <div className="flex items-center gap-2">
                <Star className="text-emerald-500 fill-emerald-500" size={16} />
                <span className="text-[13px] font-black text-emerald-800 dark:text-emerald-300">
                  Rate Support Experience
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground">
                This ticket has been marked as resolved. Please help us improve
                by rating your experience:
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStars(star)}
                    className="p-1 hover:scale-110 active:scale-95 transition-all text-amber-400 border-none bg-transparent cursor-pointer"
                  >
                    <Star
                      size={24}
                      fill={selectedStars >= star ? "#F59E0B" : "none"}
                      className={
                        selectedStars >= star
                          ? "text-amber-500"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>
              {selectedStars > 0 && (
                <div className="space-y-3">
                  <textarea
                    placeholder="Share your feedback (optional)..."
                    value={ratingFeedback}
                    onChange={(e) => setRatingFeedback(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-[12px] font-medium text-slate-800 dark:text-slate-100 placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none min-h-[60px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedStars === 0) return;
                      const updated: Ticket = {
                        ...ticket,
                        rating: {
                          stars: selectedStars,
                          feedback: ratingFeedback,
                        },
                        timeline: [
                          ...ticket.timeline,
                          {
                            id: Math.random().toString(),
                            type: "comment",
                            user: "Current Employee",
                            timestamp: new Date().toLocaleString(),
                            comment: `Rated support experience: ${selectedStars} / 5 stars.${ratingFeedback ? ` Feedback: "${ratingFeedback}"` : ""}`,
                          },
                        ],
                      };
                      onUpdate(updated);
                      showToast(
                        "Feedback Submitted",
                        "success",
                        "Thank you for your feedback!",
                      );
                    }}
                    className="w-full py-2 bg-[#00B87C] text-white rounded-xl text-[12px] font-black hover:opacity-95 transition-all border-none shadow-sm cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          ) : ticket.rating ? (
            <div className="bg-secondary/20 p-4 rounded-2xl border border-border mt-6">
              <span className="text-[11px] font-bold text-muted-foreground block mb-2 uppercase tracking-wider">
                Your Rating
              </span>
              <div className="flex items-center gap-1 mb-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={ticket.rating!.stars >= star ? "#F59E0B" : "none"}
                    className={
                      ticket.rating!.stars >= star
                        ? "text-amber-500"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              {ticket.rating.feedback && (
                <p className="text-[12px] text-foreground italic leading-relaxed">
                  "{ticket.rating.feedback}"
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="p-8 bg-secondary/30 border-t border-border flex flex-col gap-4">
          {showAddComment ? (
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4">
              <textarea
                placeholder="Type your comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none min-h-[80px]"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => commentFileInputRef.current?.click()}
                  className="flex items-center gap-2 text-primary text-[13px] font-black hover:underline transition-all active:scale-95"
                >
                  <Paperclip size={16} />{" "}
                  {commentFile ? commentFile.name : "Browse Files"}
                </button>
                <input
                  type="file"
                  ref={commentFileInputRef}
                  onChange={(e) => {
                    if (e.target.files) setCommentFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddComment(false)}
                    className="px-4 py-2 rounded-xl text-[13px] font-black text-slate-500 hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-[13px] font-black hover:opacity-90"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddComment(true)}
                disabled={isClosed}
                className={`flex-1 py-4 bg-card border border-border rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 transition-all ${isClosed ? "opacity-50 cursor-not-allowed" : "text-foreground hover:bg-secondary"}`}
              >
                <FileText size={18} /> Add Comment
              </button>
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={isClosed}
                className={`flex-1 py-4 bg-card border border-border rounded-2xl text-[13px] font-black transition-all ${isClosed ? "opacity-50 cursor-not-allowed text-rose-300" : "text-rose-500 hover:bg-rose-50"}`}
              >
                Cancel Ticket
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 dark:bg-black/60"
              onClick={() => setShowCancelConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[400px] rounded-2xl p-6 border border-border shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2">
                Cancel Request
              </h3>
              <p className="text-[14px] text-muted-foreground mb-6">
                Are you sure you want to cancel this request? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 bg-secondary rounded-xl text-[13px] font-black text-foreground hover:opacity-80"
                >
                  No, Keep Request
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-rose-500 rounded-xl text-[13px] font-black text-white hover:opacity-90 shadow-lg shadow-rose-500/20"
                >
                  Yes, Cancel Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewAttachment && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
              onClick={() => setPreviewAttachment(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card w-full max-w-[600px] rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-foreground">
                      {previewAttachment.name}
                    </h3>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      {previewAttachment.size} • Document Preview
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast(
                        "Download Started",
                        "success",
                        `Downloading ${previewAttachment.name}`,
                      );
                      setPreviewAttachment(null);
                    }}
                    className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => setPreviewAttachment(null)}
                    className="p-2 hover:bg-rose-50 rounded-xl text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-8 bg-secondary/10 flex flex-col items-center justify-center min-h-[300px]">
                <FileText size={64} className="text-muted-foreground/30 mb-4" />
                <p className="text-[14px] font-bold text-muted-foreground">
                  Preview not available for this file type.
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Please download the file to view its contents.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

function AISupportAssistantTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi there! I am your NexusHR AI Assistant. How can I help you today? You can ask me about hardware upgrades, password resets, leave applications, or expense claims.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useState(() => {
    scrollToBottom();
  });

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      scrollToBottom();
    }, 50);

    setTimeout(() => {
      let reply: string;
      const lower = textToSend.toLowerCase();

      if (
        lower.includes("ram") ||
        lower.includes("hardware") ||
        lower.includes("laptop") ||
        lower.includes("pc") ||
        lower.includes("upgrade")
      ) {
        reply =
          "For computer slowness or hardware upgrades (like RAM), please raise an **IT Hardware** ticket. Click the green '+ Raise New Ticket' button at the top of the Support page and select the 'IT Support' category.";
      } else if (
        lower.includes("password") ||
        lower.includes("reset") ||
        lower.includes("portal") ||
        lower.includes("login")
      ) {
        reply =
          "To reset your password, visit **Settings > Security** or click 'Forgot Password' on the login screen. You can also follow the guide in the **Knowledge Base** under the 'Access Issues' category.";
      } else if (
        lower.includes("leave") ||
        lower.includes("sick") ||
        lower.includes("vacation")
      ) {
        reply =
          "To apply for leave, navigate to the **My Leaves** page in the sidebar and click '+ Apply Leave'. Your manager will receive an instant notification to review your request.";
      } else if (
        lower.includes("expense") ||
        lower.includes("reimbursement") ||
        lower.includes("claim") ||
        lower.includes("money")
      ) {
        reply =
          "You can submit expense reimbursements under the **My Expenses** page in the sidebar. Click '+ New Claim', fill in the details, and make sure to attach your receipt/invoice for approval.";
      } else {
        reply =
          "I'm here to help! If you have a specific request, you can submit a support ticket directly to our HR or IT desk by clicking the green '+ Raise New Ticket' button. You can also search through our FAQ categories in the **Knowledge Base** tab.";
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }, 1000);
  };

  const suggestions = [
    "Upgrade RAM or Laptop",
    "Reset portal password",
    "How to apply for leave",
    "Submit expense reimbursement",
  ];

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col h-[550px]">
      {/* Bot Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-secondary/10">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black text-foreground">
            NexusHR AI Helpdesk
          </h3>
          <p className="text-[11px] text-[#00B87C] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B87C] animate-pulse" />{" "}
            Online Assistant
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-card">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-[13px] leading-relaxed font-medium ${
                msg.sender === "user"
                  ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                  : "bg-white dark:bg-secondary/40 border border-border rounded-tl-none text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span
                className={`text-[9px] block mt-1.5 text-right font-bold ${
                  msg.sender === "user"
                    ? "text-emerald-100"
                    : "text-muted-foreground"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-secondary/40 border border-border p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions and Input */}
      <div className="p-4 border-t border-border bg-white dark:bg-card space-y-3">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 bg-secondary hover:bg-primary hover:text-white rounded-full text-xs font-bold text-muted-foreground transition-all cursor-pointer border border-border"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
          />
          <button
            type="submit"
            className="p-3 bg-primary hover:opacity-90 text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center border-none"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function KnowledgeBaseTab() {
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof FAQ_CATEGORIES)[0] | null
  >(null);

  const DUMMY_ARTICLES = [
    "How to reset my portal password?",
    "Where can I find the updated holiday calendar?",
    "Step-by-step guide to applying for sick leave",
    "How to claim travel expenses?",
    "Understanding the new remote work policy",
  ];

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
            onClick={() => setSelectedCategory(category)}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:border-primary transition-all cursor-pointer hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 mb-5 group-hover:scale-110 transition-transform">
              <category.icon size={22} />
            </div>
            <h3 className="text-[16px] font-black text-foreground mb-2 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <div className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-[11px] font-semibold uppercase tracking-wider border border-border mb-4">
              {category.count} Articles
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-primary text-[12px] font-black mt-auto hover:underline active:scale-95 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategory(category);
              }}
            >
              Browse{" "}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 dark:bg-black/40"
              onClick={() => setSelectedCategory(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-card w-full max-w-[600px] rounded-[32px] overflow-hidden border border-border shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-white dark:bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                    <selectedCategory.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
                      {selectedCategory.name}
                    </h3>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      Browse frequently asked questions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 dark:bg-card space-y-3">
                {DUMMY_ARTICLES.map((article, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      showToast(
                        "Opening Article",
                        "success",
                        `Loading: ${article}`,
                      );
                      setSelectedCategory(null);
                    }}
                    className="bg-white dark:bg-secondary/30 p-5 rounded-2xl border border-border flex items-center justify-between cursor-pointer hover:border-primary/40 group transition-all shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]"
                  >
                    <div className="flex flex-col gap-1.5">
                      <p className="text-[14px] font-bold text-slate-800 dark:text-foreground group-hover:text-primary transition-colors">
                        {article}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-muted-foreground">
                        Updated {idx + 1} days ago • 3 min read
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <ChevronRight
                        size={16}
                        className="text-slate-400 group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
