import { useState, useRef, useMemo } from "react";
import {
  Headphones,
  Plus,
  Search,
  ChevronRight,
  Monitor,
  IndianRupee,
  CalendarDays,
  UserPlus,
  X,
  FileText,
  CheckCircle2,
  Clock,
  Paperclip,
  Download,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
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
}

const TABS = ["My Tickets", "Knowledge Base"];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "#TKT-0812",
    subject: "Team L&D budget allocation for Sneha Rao",
    category: "L&D Budget",
    priority: "Medium",
    status: "In Progress",
    created: "Apr 10, 2026",
    catColor: "#8B5CF6",
    catBg: "rgba(139, 92, 246, 0.1)",
    priorityColor: "#F59E0B",
    priorityBg: "rgba(245, 158, 11, 0.1)",
    statusColor: "#F59E0B",
    statusBg: "rgba(245, 158, 11, 0.1)",
    description:
      "Requesting budget approval for Sneha Rao's enrolment in the 'Advanced React Native Masters' course on April 22. Enclosed the course curriculum and invoice estimation.",
    timeline: [
      {
        id: "1",
        type: "created",
        user: "Suresh Iyer",
        timestamp: "Apr 10, 2026, 11:30 AM",
      },
      {
        id: "2",
        type: "status_change",
        user: "HR Operations",
        timestamp: "Apr 11, 2026, 02:15 PM",
        newStatus: "In Progress",
      },
    ],
    attachments: [
      { name: "React_Masters_Syllabus.pdf", size: "1.4 MB", type: "pdf" },
    ],
  },
  {
    id: "#TKT-0754",
    subject: "Overtime approval request for Dev Patel",
    category: "Payroll Query",
    priority: "High",
    status: "Resolved",
    created: "Apr 04, 2026",
    catColor: "#00B87C",
    catBg: "rgba(0, 184, 124, 0.1)",
    priorityColor: "#EF4444",
    priorityBg: "rgba(239, 68, 68, 0.1)",
    statusColor: "#00B87C",
    statusBg: "rgba(0, 184, 124, 0.1)",
    description:
      "Dev Patel logged 12 hours of overtime during the Easter staging deployment block. Need approval sync for payroll inclusion.",
    timeline: [
      {
        id: "1",
        type: "created",
        user: "Suresh Iyer",
        timestamp: "Apr 04, 2026, 09:00 AM",
      },
      {
        id: "2",
        type: "resolved",
        user: "Finance Payroll",
        timestamp: "Apr 05, 2026, 10:30 AM",
        comment: "Overtime approved and added to April payroll block.",
      },
    ],
    attachments: [],
  },
  {
    id: "#TKT-0612",
    subject: "Staging sandbox server access renewal",
    category: "IT Access",
    priority: "High",
    status: "Resolved",
    created: "Mar 20, 2026",
    catColor: "#0EA5E9",
    catBg: "rgba(14, 165, 233, 0.1)",
    priorityColor: "#EF4444",
    priorityBg: "rgba(239, 68, 68, 0.1)",
    statusColor: "#00B87C",
    statusBg: "rgba(0, 184, 124, 0.1)",
    description:
      "Renewing root SSH access key permissions for Suresh's Team to access sandbox cloud cluster environments.",
    timeline: [
      {
        id: "1",
        type: "created",
        user: "Suresh Iyer",
        timestamp: "Mar 20, 2026, 04:00 PM",
      },
      {
        id: "2",
        type: "resolved",
        user: "IT DevOps Team",
        timestamp: "Mar 21, 2026, 11:00 AM",
        comment: "SSH public keys successfully imported and active.",
      },
    ],
    attachments: [],
  },
];

const FAQ_CATEGORIES = [
  { name: "Team Leave Approval Guidelines", icon: CalendarDays, count: 8 },
  { name: "Appraisal Review Policies", icon: TrendingUp, count: 12 },
  { name: "IT Hardware Allocation", icon: Monitor, count: 10 },
  { name: "Budgeting & Expenses", icon: IndianRupee, count: 6 },
  { name: "Employee Onboarding Flow", icon: UserPlus, count: 15 },
  { name: "Timesheet & Overtime Rules", icon: FileSpreadsheet, count: 11 },
];

export function ManagerSupportTicket() {
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
        (ticketStatusTab === "Resolved" && t.status === "Resolved");
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

  const handleAddComment = (ticketId: string, commentText: string) => {
    if (!commentText.trim()) return;

    const newEntry: TimelineEntry = {
      id: Math.random().toString(),
      type: "comment",
      user: "Suresh Iyer (Manager)",
      timestamp: new Date().toLocaleString(),
      comment: commentText,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              timeline: [...t.timeline, newEntry],
            }
          : t,
      ),
    );

    if (viewingTicket?.id === ticketId) {
      setViewingTicket((prev) =>
        prev
          ? {
              ...prev,
              timeline: [...prev.timeline, newEntry],
            }
          : null,
      );
    }

    showToast("Comment Added", "success", "Your message has been posted.");
  };

  const openCount = tickets.filter((t) =>
    ["Open", "In Progress"].includes(t.status),
  ).length;
  const resolvedCount = tickets.filter((t) =>
    ["Resolved"].includes(t.status),
  ).length;

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 flex flex-col gap-6 animate-in fade-in duration-700 min-h-screen bg-[#F0FDF4]/30 dark:bg-transparent">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm flex-shrink-0">
            <Headphones size={22} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-foreground leading-none">
              Support & Helpdesk
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Raise requests to HR, Payroll, and IT Admin
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white text-[13px] uppercase tracking-wider bg-[#00B87C] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-emerald-500/25"
        >
          <Plus size={18} /> Raise New Ticket
        </button>
      </div>

      {/* ─── Ticket Stats Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div
          className="bg-card p-6 rounded-[28px] border border-border shadow-sm group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
          onClick={() => {
            setActiveTab("My Tickets");
            setTicketStatusTab("Open");
          }}
        >
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
            Open Requests
          </p>
          <p className="text-[28px] font-bold text-amber-500">{openCount}</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3 uppercase tracking-wider">
            In Progress / New
          </p>
        </div>

        {/* Card 2 */}
        <div
          className="bg-card p-6 rounded-[28px] border border-border shadow-sm group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
          onClick={() => {
            setActiveTab("My Tickets");
            setTicketStatusTab("Resolved");
          }}
        >
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
            Resolved Requests
          </p>
          <p className="text-[28px] font-bold text-[#00B87C]">
            {resolvedCount}
          </p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3 uppercase tracking-wider">
            total resolved
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-card p-6 rounded-[28px] border border-border shadow-sm group hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all overflow-hidden relative">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
            Avg. Resolution Time
          </p>
          <p className="text-[28px] font-bold text-foreground">1.5 Days</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3 uppercase tracking-wider">
            SLA Standard: 2 days
          </p>
        </div>
      </div>

      {/* ─── Tab Bar ─────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl text-[13px] transition-all whitespace-nowrap uppercase tracking-wider ${
              activeTab === tab
                ? "bg-[#00B87C] text-white font-bold shadow-md shadow-emerald-500/20"
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
            onAddComment={handleAddComment}
            onClose={() => setViewingTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* My Tickets Tab Component                                       */
/* ─────────────────────────────────────────────────────────────── */
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
  const tabs = ["All Requests", "Open", "In Progress", "Resolved"];

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-card rounded-[28px] border border-border shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTicketStatusTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${
                ticketStatusTab === tab
                  ? "bg-secondary text-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="L&D Budget">L&D Budget</option>
            <option value="Payroll Query">Payroll Query</option>
            <option value="IT Access">IT Access</option>
            <option value="Hardware Allocation">Hardware Allocation</option>
            <option value="Escalation">Escalation</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-[13px] font-bold text-foreground focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="bg-card rounded-[28px] border border-border shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Search size={48} className="opacity-20 mb-4 text-emerald-500" />
            <p className="font-bold text-foreground">No requests found</p>
            <p className="text-[13px] font-bold text-muted-foreground mt-1 max-w-[280px]">
              Try adjusting your filters or search to locate your ticket.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/40 border-b border-border">
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    TICKET ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    SUBJECT
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    CATEGORY
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    PRIORITY
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    CREATED
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-secondary/35 transition-colors group cursor-pointer"
                    onClick={() => onViewTicket(row)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-[12px] font-bold text-muted-foreground group-hover:text-[#00B87C] transition-colors">
                        {row.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-bold text-foreground max-w-[250px] truncate">
                      {row.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
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
                        className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
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
                        className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: row.statusBg,
                          color: row.statusColor,
                          borderColor: row.statusBg,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground">
                      {row.created}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#00B87C] text-[13px] font-bold hover:underline whitespace-nowrap">
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

/* ─────────────────────────────────────────────────────────────── */
/* Knowledge Base Tab Component                                   */
/* ─────────────────────────────────────────────────────────────── */
function KnowledgeBaseTab() {
  const faqs = [
    {
      q: "How do I approve a direct report's leave request?",
      a: "Navigate to the Team Operations side and select Leave Planner. Find the pending leaves under 'Requests' and click 'Approve L1'. This automatically updates the employee and escalates to HR for administrative entry.",
    },
    {
      q: "What is the team equipment allocation process?",
      a: "If a direct report requires hardware upgrades (monitors, RAM, laptop refresh), click 'Raise Support Ticket' and select the 'Hardware Allocation' category. HR Ops and IT Admin will verify allocations against project budgets.",
    },
    {
      q: "How to correct an direct report's missing attendance logs?",
      a: "Go to Team Attendance, select the member, and find the day needing modification. Select 'Correct Timesheet' to manually append timestamps on their behalf, then save.",
    },
    {
      q: "When do quarterly appraisal cycles open?",
      a: "Appraisal reviews start 1 week prior to quarter closure. You will receive manager check-in prompts in your Notification Feed. Direct reports complete their self-appraisals first, followed by your manager L1 scores.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* FAQ categories grid */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-[13px] font-bold text-foreground uppercase tracking-wider mb-3">
          Support Categories
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {FAQ_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:border-[#00B87C]/30 hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/5 group-hover:bg-emerald-500/10 flex items-center justify-center text-[#00B87C] border border-emerald-500/10">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground group-hover:text-[#00B87C] transition-colors leading-none">
                      {cat.name}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                      {cat.count} Articles
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ details grid */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-[13px] font-bold text-foreground uppercase tracking-wider mb-3">
          Frequently Answered Topics
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3"
            >
              <h4 className="text-[15px] font-bold text-foreground flex items-center gap-2">
                <AlertCircle size={16} className="text-[#00B87C]" /> {faq.q}
              </h4>
              <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Raised Ticket Modal Component                                  */
/* ─────────────────────────────────────────────────────────────── */
function NewTicketModal({
  onAdd,
  onClose,
}: {
  onAdd: (t: Ticket) => void;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("L&D Budget");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
      catColor: "#8B5CF6",
      catBg: "rgba(139, 92, 246, 0.1)",
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
          user: "Suresh Iyer (Manager)",
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-[#00B87C] shadow-sm">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-foreground uppercase tracking-tight">
                RAISE NEW TICKET
              </h3>
              <p className="text-[12px] font-bold text-muted-foreground">
                Submit query to HR operations
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                CATEGORY
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F0FDF4] dark:bg-emerald-950/50 border border-emerald-500/20 rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-[#00B87C] appearance-none transition-all cursor-pointer"
                >
                  <option value="L&D Budget">L&D Budget</option>
                  <option value="Payroll Query">Payroll Query</option>
                  <option value="IT Access">IT Access</option>
                  <option value="Hardware Allocation">
                    Hardware Allocation
                  </option>
                  <option value="Escalation">Escalation</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                SUBJECT
              </label>
              <input
                type="text"
                placeholder="Brief summary of the issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-6 py-4 text-[15px] font-medium text-foreground placeholder:text-slate-400 focus:outline-none focus:border-[#00B87C] transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                PRIORITY LEVEL
              </label>
              <div className="grid grid-cols-4 gap-3">
                {["Low", "Medium", "High", "Urgent"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`py-3.5 rounded-2xl text-[13px] font-bold transition-all border-2 ${
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
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                DESCRIPTION
              </label>
              <textarea
                rows={4}
                placeholder="Describe your issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-[#F0FDF4]/50 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 text-[15px] font-medium text-foreground placeholder:text-slate-400 focus:outline-none focus:border-[#00B87C] transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                ATTACH FILES
              </label>
              <div className="border-2 border-dashed border-emerald-500/20 bg-[#F0FDF4]/30 dark:bg-emerald-500/[0.02] p-5 rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-500/5 transition-all relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Paperclip size={24} className="text-[#00B87C] mb-2" />
                <p className="text-[12px] font-bold text-foreground">
                  {file ? file.name : "Click to select a file"}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                  Supports PDF, PNG, JPG up to 10MB
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4.5 bg-[#00B87C] text-white text-[13px] font-bold uppercase tracking-wider rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-emerald-500/25 mt-4"
            >
              Raise Support Ticket
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Ticket Detail Drawer Component                                 */
/* ─────────────────────────────────────────────────────────────── */
function TicketDetailModal({
  ticket,
  onAddComment,
  onClose,
}: {
  ticket: Ticket;
  onAddComment: (id: string, text: string) => void;
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  const timelineEndRef = useRef<HTMLDivElement>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddComment(ticket.id, comment);
    setComment("");
    setTimeout(() => {
      timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[4000] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      {/* Slide Drawer Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-card w-full max-w-[500px] h-full shadow-2xl border-l border-border flex flex-col overflow-y-auto custom-scrollbar z-50 p-8"
      >
        {/* Header close button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <X size={20} />
        </button>

        {/* Drawer Header Detail */}
        <div className="mt-12 pb-6 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] font-bold text-muted-foreground">
              {ticket.id}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: ticket.priorityBg,
                  color: ticket.priorityColor,
                  borderColor: ticket.priorityBg,
                }}
              >
                {ticket.priority}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
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
          <h2 className="text-[20px] font-bold text-foreground leading-tight">
            {ticket.subject}
          </h2>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
            Category: {ticket.category}
          </p>
        </div>

        {/* Description & Timeline Body */}
        <div className="py-6 flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-1">
          {/* Main Description */}
          <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 space-y-3">
            <p className="text-[13px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} className="text-[#00B87C]" /> Issue
              Description
            </p>
            <p className="text-[13.5px] font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Attachments */}
          {ticket.attachments.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                ATTACHMENTS ({ticket.attachments.length})
              </p>
              <div className="grid grid-cols-1 gap-2">
                {ticket.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-secondary/35 border border-border rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip
                        size={14}
                        className="text-[#00B87C] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          {file.size}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        showToast(
                          "Downloading",
                          "success",
                          `${file.name} download started.`,
                        )
                      }
                      className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Feed */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              TICKET HISTORY & ACTIVITY
            </p>
            <div className="relative pl-4 border-l-2 border-border/50 ml-2 space-y-6">
              {ticket.timeline.map((event) => (
                <div key={event.id} className="relative space-y-1">
                  {/* Indicator bullet */}
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-card border-2 border-border shadow-sm" />

                  <div className="flex justify-between items-center text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>{event.user}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {event.timestamp}
                    </span>
                  </div>

                  {event.type === "created" && (
                    <p className="text-[13px] font-bold text-muted-foreground">
                      Ticket raised and submitted.
                    </p>
                  )}
                  {event.type === "status_change" && (
                    <p className="text-[13px] font-bold text-foreground">
                      Status updated to{" "}
                      <span className="text-amber-500">{event.newStatus}</span>.
                    </p>
                  )}
                  {event.type === "resolved" && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl mt-1 space-y-1.5">
                      <p className="text-[13px] font-bold text-[#00B87C] flex items-center gap-1.5 uppercase tracking-wide">
                        <CheckCircle2 size={14} /> Resolved Action
                      </p>
                      <p className="text-[13px] font-medium text-muted-foreground">
                        {event.comment}
                      </p>
                    </div>
                  )}
                  {event.type === "comment" && (
                    <div className="p-4 bg-secondary/30 border border-border rounded-xl mt-1 leading-relaxed text-[13px] font-medium text-foreground whitespace-pre-wrap">
                      {event.comment}
                    </div>
                  )}
                </div>
              ))}
              <div ref={timelineEndRef} />
            </div>
          </div>
        </div>

        {/* Comment input form footer */}
        {ticket.status !== "Resolved" && (
          <form
            onSubmit={handleSubmitComment}
            className="border-t border-border pt-5 mt-auto space-y-4"
          >
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your reply..."
              required
              className="w-full bg-secondary/30 border border-border rounded-xl p-3 text-[13.5px] font-semibold text-foreground outline-none focus:border-[#00B87C] transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-[#00B87C] text-white text-[12px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
            >
              Post Message
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
