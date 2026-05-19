import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Headphones,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Monitor,
  IndianRupee,
  Key,
  Paperclip,
  ShieldCheck,
  FileCode,
  Zap
} from "lucide-react";
import { showToast } from "../components/workflow/ToastNotification";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineEntry {
  id: string;
  type: "created" | "comment" | "status_change" | "attachment" | "resolved" | "cancelled";
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

const TABS = ["My Tickets", "New Ticket", "Knowledge Base"];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "#TKT-0421",
    subject: "TDS portal access issue",
    category: "IT Access",
    priority: "High",
    status: "In Progress",
    created: "Apr 5",
    catColor: "#0D9488",
    catBg: "rgba(13, 148, 136, 0.1)",
    priorityColor: "#EF4444",
    priorityBg: "rgba(239, 68, 68, 0.1)",
    statusColor: "#F59E0B",
    statusBg: "rgba(245, 158, 11, 0.1)",
    description: "Unable to log in to the government TDS portal using the company credentials. Access seems to be blocked or password expired.",
    timeline: [
      { id: "1", type: "created", user: "Finance Officer", timestamp: "Apr 5, 2026, 09:00 AM" },
      { id: "2", type: "status_change", user: "IT Support", timestamp: "Apr 5, 2026, 10:30 AM", newStatus: "In Progress" },
    ],
    attachments: [],
  },
  {
    id: "#TKT-0398",
    subject: "VPN configuration help",
    category: "IT Software",
    priority: "Medium",
    status: "Resolved",
    created: "Mar 28",
    catColor: "#8B5CF6",
    catBg: "rgba(139, 92, 246, 0.1)",
    priorityColor: "#F59E0B",
    priorityBg: "rgba(245, 158, 11, 0.1)",
    statusColor: "#00B87C",
    statusBg: "rgba(0, 184, 124, 0.1)",
    description: "Need help configuring the new VPN client for remote access to the finance servers.",
    timeline: [
      { id: "1", type: "created", user: "Finance Officer", timestamp: "Mar 28, 2026, 10:00 AM" },
      { id: "2", type: "resolved", user: "IT Support", timestamp: "Mar 29, 2026, 11:00 AM", comment: "VPN configured successfully." },
    ],
    attachments: [],
  },
];

const KB_CATEGORIES = [
  { name: "IT Setup", icon: Monitor, count: 12 },
  { name: "Payroll Queries", icon: IndianRupee, count: 8 },
  { name: "TDS Help", icon: FileCode, count: 15 },
  { name: "PF FAQs", icon: ShieldCheck, count: 6 },
  { name: "Access Issues", icon: Key, count: 10 },
  { name: "Finance Tools", icon: Zap, count: 14 },
];

export function FinanceSupport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("My Tickets");
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketStatusTab, setTicketStatusTab] = useState("All Requests");

  // New Ticket Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Finance Tool");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [tickets, searchQuery]);

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket: Ticket = {
      id: `#TKT-0${Math.floor(Math.random() * 900) + 100}`,
      subject,
      category,
      priority,
      status: "Open",
      created: "Today",
      catColor: "#0D9488",
      catBg: "rgba(13, 148, 136, 0.1)",
      priorityColor: priority === "Critical" || priority === "High" ? "#EF4444" : priority === "Medium" ? "#F59E0B" : "#6B7280",
      priorityBg: priority === "Critical" || priority === "High" ? "rgba(239, 68, 68, 0.1)" : priority === "Medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(107, 114, 128, 0.1)",
      statusColor: "#3B82F6",
      statusBg: "rgba(59, 130, 246, 0.1)",
      description,
      timeline: [{ id: "1", type: "created", user: "Finance Officer", timestamp: "Just now" }],
      attachments: file ? [{ name: file.name, size: (file.size / 1024).toFixed(1) + " KB", type: file.type }] : [],
    };

    setTickets([newTicket, ...tickets]);
    showToast("Ticket Raised", "success", "Your support ticket has been submitted successfully.");
    setActiveTab("My Tickets");
    // Reset form
    setSubject("");
    setCategory("Finance Tool");
    setPriority("Medium");
    setDescription("");
    setFile(null);
  };

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
          onClick={() => setActiveTab("New Ticket")}
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
        <div 
          className="bg-card p-6 rounded-[24px] border border-border shadow-sm group hover:shadow-md transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
          onClick={() => {
            setActiveTab("My Tickets");
            setTicketStatusTab("Open");
          }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">OPEN TICKETS</p>
          <p className="text-[32px] font-black" style={{ color: "#F59E0B" }}>1</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">In progress / Open</p>
        </div>
        <div 
          className="bg-card p-6 rounded-[24px] border border-border shadow-sm group hover:shadow-md transition-all overflow-hidden relative cursor-pointer active:scale-[0.98]"
          onClick={() => {
            setActiveTab("My Tickets");
            setTicketStatusTab("Resolved");
          }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">RESOLVED</p>
          <p className="text-[32px] font-black" style={{ color: "#00B87C" }}>5</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">total resolved</p>
        </div>
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm group hover:shadow-md transition-all overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">AVG RESOLUTION</p>
          <p className="text-[32px] font-black" style={{ color: "#0D9488" }}>1.2 days</p>
          <p className="text-[13px] font-bold text-muted-foreground mt-3">response time</p>
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
              <div className="space-y-4">
                <div className="bg-card rounded-[24px] border border-border shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {["All Requests", "Open", "Resolved"].map((tab) => (
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
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-[13px] font-bold text-foreground focus:outline-none w-full sm:w-64 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/30">
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">TICKET ID</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">SUBJECT</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">CATEGORY</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">PRIORITY</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">STATUS</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">CREATED</th>
                          <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTickets.map((row) => (
                          <tr key={row.id} className="hover:bg-secondary/50 transition-colors group cursor-pointer">
                            <td className="px-6 py-4 font-mono text-[12px] font-bold text-muted-foreground">{row.id}</td>
                            <td className="px-6 py-4 text-[14px] font-bold text-foreground">{row.subject}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ backgroundColor: row.catBg, color: row.catColor, borderColor: "transparent" }}>
                                {row.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ backgroundColor: row.priorityBg, color: row.priorityColor, borderColor: "transparent" }}>
                                {row.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ backgroundColor: row.statusBg, color: row.statusColor, borderColor: "transparent" }}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{row.created}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-primary text-[13px] font-bold hover:underline">View ›</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "New Ticket" && (
              <div className="max-w-2xl mx-auto bg-card rounded-[32px] border border-border shadow-sm overflow-hidden p-8">
                <form onSubmit={handleRaiseTicket} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">CATEGORY</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none transition-all"
                    >
                      {["IT Access", "IT Hardware", "IT Software", "HR Request", "Payroll Query", "Finance Tool", "Other"].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">PRIORITY</label>
                    <div className="grid grid-cols-4 gap-3">
                      {["Low", "Medium", "High", "Critical"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setPriority(level)}
                          className={`py-3 rounded-xl text-[13px] font-black transition-all border-2 ${
                            priority === level
                              ? "bg-[#00B87C] text-white border-[#00B87C] shadow-lg shadow-emerald-500/20"
                              : "bg-secondary/50 text-muted-foreground border-transparent hover:border-emerald-500/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">SUBJECT</label>
                    <input
                      type="text"
                      placeholder="Brief summary of the issue..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 text-[15px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">DESCRIPTION</label>
                    <textarea
                      placeholder="Detailed description of your issue..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      style={{ height: "120px" }}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 text-[15px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-muted-foreground uppercase tracking-widest ml-1">ATTACHMENTS</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 hover:border-primary/30 transition-all"
                    >
                      <Paperclip className="text-muted-foreground" size={24} />
                      <p className="text-[13px] font-bold text-muted-foreground">
                        {file ? file.name : "Drag & drop files or click to upload"}
                      </p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest transition-all active:scale-[0.98] mt-4"
                    style={{
                      backgroundColor: "#00B87C",
                      boxShadow: "0 8px 24px rgba(0, 184, 124, 0.25)",
                    }}
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}

            {activeTab === "Knowledge Base" && (
              <div className="space-y-8">
                <div className="max-w-xl mx-auto relative group">
                  <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search FAQs, tools, and guides..."
                    className="w-full bg-card border border-border rounded-[20px] pl-14 pr-6 py-5 text-[15px] font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {KB_CATEGORIES.map((cat) => (
                    <div
                      key={cat.name}
                      className="bg-card border border-border rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <cat.icon size={28} />
                      </div>
                      <h3 className="text-[17px] font-black text-foreground tracking-tight mb-1">{cat.name}</h3>
                      <p className="text-[13px] font-bold text-muted-foreground">{cat.count} articles</p>
                      <div className="mt-4 flex items-center gap-1.5 text-primary text-[12px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        Explore <ChevronRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
