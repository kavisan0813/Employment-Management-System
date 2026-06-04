import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  MessageSquare,
  Calendar,
  ChevronRight,
  Star,
  X,
  Briefcase,
  MapPin,
  IndianRupee,
  ChevronDown,
  Users,
  Send,
  Clock,
  CheckCircle,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  Video,
  ChevronLeft,
  Edit3,
} from "lucide-react";
import { recruitmentPipeline } from "../data/mockData";
import { useRecruitment } from "../context/AppContext";
import type {
  Candidate as ContextCandidate,
  JobPosting,
  ScheduledInterview,
} from "../context/AppContext";

/* ─── Types ──────────────────────────────────────────────── */
type Stage =
  | "Applied"
  | "Screening"
  | "Round 1"
  | "Round 2"
  | "Offer"
  | "Hired";
type Source = "LinkedIn" | "Indeed" | "Referral";
type ToastKind = "success" | "error" | "info" | "warning";

const STAGES: Stage[] = [
  "Applied",
  "Screening",
  "Round 1",
  "Round 2",
  "Offer",
  "Hired",
];

interface Candidate {
  id: string;
  name: string;
  role: string;
  date: string;
  avatar: string | null;
  initials: string;
  type: string;
  location: string;
  rating: number;
  source: Source;
  interviewerAvatars: string[];
  interviewDate?: string;
}
// Types are now imported from AppContext
interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

/* ─── useToast ───────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback(
    (id: string) => setToasts((p) => p.filter((t) => t.id !== id)),
    [],
  );
  const toast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = `t${Date.now()}${Math.random()}`;
      setToasts((p) => [...p, { id, message, kind }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );
  return { toasts, toast, dismiss };
}

/* ─── useEscapeKey ───────────────────────────────────────── */
function useEscapeKey(fn: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") fn();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [fn, active]);
}

/* ─── Toast UI ───────────────────────────────────────────── */
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const cfg: Record<
    ToastKind,
    { bg: string; border: string; color: string; icon: React.ReactNode }
  > = {
    success: {
      bg: "rgba(16,185,129,.13)",
      border: "rgba(16,185,129,.3)",
      color: "#10B981",
      icon: <CheckCircle2 size={14} />,
    },
    error: {
      bg: "rgba(239,68,68,.13)",
      border: "rgba(239,68,68,.3)",
      color: "#EF4444",
      icon: <XCircle size={14} />,
    },
    warning: {
      bg: "rgba(245,158,11,.13)",
      border: "rgba(245,158,11,.3)",
      color: "#F59E0B",
      icon: <AlertCircle size={14} />,
    },
    info: {
      bg: "rgba(59,130,246,.13)",
      border: "rgba(59,130,246,.3)",
      color: "#3B82F6",
      icon: <Info size={14} />,
    },
  };
  return (
    <div className="fixed bottom-4 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <style>{`@keyframes tSlide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}`}</style>
      {toasts.map((t) => {
        const c = cfg[t.kind];
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl pointer-events-auto"
            style={{
              backgroundColor: c.bg,
              border: `1px solid ${c.border}`,
              backdropFilter: "blur(12px)",
              animation: "tSlide .22s ease-out",
              minWidth: 240,
              maxWidth: 340,
            }}
          >
            <span style={{ color: c.color, flexShrink: 0 }}>{c.icon}</span>
            <span
              style={{
                color: "var(--foreground)",
                fontSize: 13,
                fontWeight: 600,
                flex: 1,
              }}
            >
              {t.message}
            </span>
            <button
              onClick={() => onDismiss(t.id)}
              className="hover:opacity-60 transition-opacity"
              style={{ color: "var(--muted-foreground)", flexShrink: 0 }}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Search & Filter Bar ────────────────────────────────── */
interface SearchFilterBarProps {
  query: string;
  onQueryChange: (v: string) => void;
  locationFilter: string;
  onLocationChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  resultCount: number;
}

function SearchFilterBar({
  query,
  onQueryChange,
  locationFilter,
  onLocationChange,
  typeFilter,
  onTypeChange,
  resultCount,
}: SearchFilterBarProps) {
  const [open, setOpen] = useState(false);
  const hasFilter = locationFilter !== "All" || typeFilter !== "All";

  return (
    <div className="mb-6">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--muted-foreground)" }}
          />
          <input
            className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none"
            style={{
              border: "1.5px solid var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--foreground)",
            }}
            placeholder="Search candidates by name or role…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-foreground)" }}
            >
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            backgroundColor:
              open || hasFilter ? "var(--primary)" : "var(--card)",
            color: open || hasFilter ? "white" : "var(--foreground)",
            border: "1.5px solid var(--border)",
          }}
        >
          <Filter size={13} />
          Filters
          {hasFilter && (
            <span
              className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
              style={{ backgroundColor: "white", color: "var(--primary)" }}
            >
              !
            </span>
          )}
        </button>
      </div>

      {open && (
        <div
          className="mt-3 p-4 rounded-2xl flex flex-wrap gap-4 items-center"
          style={{
            backgroundColor: "var(--card)",
            border: "1.5px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <MapPin size={12} style={{ color: "var(--muted-foreground)" }} />
            <span
              style={{
                color: "var(--muted-foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Location
            </span>
            <select
              className="rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              value={locationFilter}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              {["All", "Remote", "On-site", "Hybrid"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={12} style={{ color: "var(--muted-foreground)" }} />
            <span
              style={{
                color: "var(--muted-foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Job Type
            </span>
            <select
              className="rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
            >
              {["All", "Full-time", "Part-time", "Contract", "Internship"].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
          </div>
          {hasFilter && (
            <button
              onClick={() => {
                onLocationChange("All");
                onTypeChange("All");
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{
                backgroundColor: "rgba(239,68,68,.1)",
                color: "#EF4444",
              }}
            >
              Clear
            </button>
          )}
          {(query || hasFilter) && (
            <span
              style={{
                color: "var(--muted-foreground)",
                fontSize: 12,
                marginLeft: "auto",
              }}
            >
              {resultCount} result{resultCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
/* ─── Upcoming Interviews Panel ──────────────────────────── */
function UpcomingInterviewsPanel({
  interviews,
  onDismiss,
  onJoinCall,
}: {
  interviews: ScheduledInterview[];
  onDismiss: (id: string) => void;
  onJoinCall: (iv: ScheduledInterview) => void;
}) {
  if (!interviews.length) return null;
  return (
    <div
      className="rounded-[28px] p-6 mb-8 relative overflow-hidden group shadow-sm border transition-all hover:shadow-md"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Bell size={20} className="animate-pulse" />
          </div>
          <div>
            <h3
              className="text-sm font-black uppercase tracking-widest flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              Interview Alerts
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500 text-white">
                {interviews.length}
              </span>
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Scheduled for today & tomorrow
            </p>
          </div>
        </div>
        <button className="text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:opacity-80">
          View All
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 relative z-10">
        {interviews.map((iv) => (
          <div
            key={iv.id}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full sm:w-auto min-w-[240px] transition-all hover:translate-y-[-2px]"
            style={{
              backgroundColor: "var(--secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <span
                style={{
                  color: "var(--primary)",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                {iv.candidateInitials}
              </span>
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-black truncate max-w-[120px]"
                style={{ color: "var(--foreground)" }}
              >
                {iv.candidateName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600">
                  {iv.time}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-slate-400">
                  {iv.type}
                </span>
              </div>
            </div>
            <button
              onClick={() => onJoinCall(iv)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all text-slate-400"
              title="Join Video Meeting"
            >
              <Video size={14} />
            </button>
            <button
              onClick={() => onDismiss(iv.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all text-slate-400"
              title="Cancel Interview"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Open Positions Modal ───────────────────────────────── */
function OpenPositionsModal({
  jobs,
  onClose,
}: {
  jobs: JobPosting[];
  onClose: () => void;
}) {
  useEscapeKey(onClose);
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          maxHeight: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Open Positions
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {jobs.length} active posting{jobs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          className="overflow-y-auto p-12 space-y-3"
          style={{ maxHeight: "calc(80vh - 80px)" }}
        >
          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                <Briefcase size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                No open positions yet.
              </h3>
              <p className="text-slate-500 font-medium">
                Click "Post a Job" to create your first listing.
              </p>
            </div>
          )}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4
                    style={{
                      color: "var(--foreground)",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {job.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[job.department, job.location, job.type, job.experience]
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--primary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                  {job.salary && (
                    <p
                      style={{
                        color: "var(--muted-foreground)",
                        fontSize: 11,
                        marginTop: 6,
                      }}
                    >
                      {job.salary}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p
                    style={{
                      color: "var(--primary)",
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    {job.applicants}
                  </p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: 10 }}>
                    applicants
                  </p>
                  <p
                    style={{
                      color: "var(--muted-foreground)",
                      fontSize: 10,
                      marginTop: 4,
                    }}
                  >
                    {job.postedAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─────────────────────────────────────── */
function DeleteConfirmDialog({
  candidate,
  onConfirm,
  onCancel,
}: {
  candidate: Candidate;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEscapeKey(onCancel);
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.55)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "rgba(239,68,68,.1)",
              border: "1px solid rgba(239,68,68,.2)",
            }}
          >
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Remove Candidate?
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: 13,
                marginTop: 6,
              }}
            >
              <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
                {candidate.name}
              </span>{" "}
              will be permanently removed.
            </p>
          </div>
        </div>
        <div
          className="px-6 pb-6 pt-4 flex gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--foreground)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90"
            style={{
              backgroundColor: "#EF4444",
              boxShadow: "0 4px 12px rgba(239,68,68,.3)",
            }}
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Message Modal ──────────────────────────────────────── */
function MessageModal({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Array<{ sender: "recruiter" | "candidate"; text: string; timestamp: string }>>(() => {
    const saved = localStorage.getItem("nexus_recruitment_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed[candidate.id] || [];
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEscapeKey(onClose);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!msg.trim()) return;
    const text = msg.trim();
    const newMsg = {
      sender: "recruiter" as const,
      text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    
    // Save message
    const saved = localStorage.getItem("nexus_recruitment_messages");
    let messagesMap: Record<string, any> = {};
    if (saved) {
      try { messagesMap = JSON.parse(saved); } catch (e) {}
    }
    const currentList = [...messages, newMsg];
    messagesMap[candidate.id] = currentList;
    localStorage.setItem("nexus_recruitment_messages", JSON.stringify(messagesMap));
    setMessages(currentList);
    setMsg("");

    // Simulate candidate typing and reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Hi, thank you for reaching out! I'm interested in the role and would love to connect for next steps.";
      const t = text.toLowerCase();
      if (t.includes("interview") || t.includes("schedule") || t.includes("time") || t.includes("meet")) {
        replyText = `Thank you! That sounds great. The interview details look good and I look forward to speaking with the team.`;
      } else if (t.includes("offer") || t.includes("salary") || t.includes("package") || t.includes("hire")) {
        replyText = `Thank you so much! I am absolutely thrilled to receive this offer. I will review the documents and get back to you shortly.`;
      } else if (t.includes("reject") || t.includes("no") || t.includes("sorry")) {
        replyText = `Thank you for letting me know. I appreciate the feedback and hope we can cross paths in the future.`;
      }
      const reply = {
        sender: "candidate" as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };
      
      const updatedList = [...currentList, reply];
      messagesMap[candidate.id] = updatedList;
      localStorage.setItem("nexus_recruitment_messages", JSON.stringify(messagesMap));
      setMessages(updatedList);
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes dotPulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .dot-bounce { animation: dotPulse 0.8s infinite ease-in-out; }
      `}</style>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          height: "500px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  color: "var(--primary)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {candidate.initials}
              </span>
            </div>
            <div>
              <h3
                style={{
                  color: "var(--foreground)",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Message {candidate.name}
              </h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: 11 }}>
                {candidate.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Messages Feed */}
        <div
          className="px-6 py-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar"
          style={{ backgroundColor: "var(--background)" }}
        >
          {messages.length === 0 && !isTyping ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageSquare size={28} className="text-slate-300 mb-2" />
              <p
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Start the conversation with {candidate.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Type a message below to reach out to the applicant.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.sender === "recruiter" ? "items-end" : "items-start"}`}
                >
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm max-w-[85%] font-semibold shadow-sm"
                    style={{
                      backgroundColor: m.sender === "recruiter" ? "var(--primary)" : "var(--card)",
                      color: m.sender === "recruiter" ? "white" : "var(--foreground)",
                      border: m.sender === "recruiter" ? "none" : "1px solid var(--border)",
                      borderBottomRightRadius: m.sender === "recruiter" ? 4 : 16,
                      borderBottomLeftRadius: m.sender !== "recruiter" ? 4 : 16,
                    }}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-bold">
                    {m.timestamp}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div
                    className="px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-1 shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                      borderBottomLeftRadius: 4,
                    }}
                  >
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-bold">
                    {candidate.name} is typing...
                  </span>
                </div>
              )}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Action input */}
        <div
          className="px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3 items-end"
          >
            <textarea
              rows={2}
              className="flex-1 rounded-xl px-3 py-2 text-sm outline-none resize-none"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              placeholder={`Write a message to ${candidate.name}…`}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="submit"
              disabled={!msg.trim()}
              className="p-3 rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-40"
              style={{
                backgroundColor: "var(--primary)",
                boxShadow: "0 4px 12px rgba(16,185,129,.3)",
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Schedule Modal ─────────────────────────────────────── */
function ScheduleModal({
  candidate,
  onClose,
  onSchedule,
}: {
  candidate: Candidate;
  onClose: () => void;
  onSchedule: (iv: Omit<ScheduledInterview, "id">) => void;
}) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    type: "Video Call",
    interviewer: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  useEscapeKey(onClose);

  const handleConfirm = () => {
    setTouched(true);
    const errs: Record<string, string> = {};
    if (!form.date) errs.date = "Date is required";
    if (!form.time) errs.time = "Time is required";
    if (!form.interviewer.trim()) errs.interviewer = "Interviewer name is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSchedule({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateInitials: candidate.initials,
      role: candidate.role,
      date: form.date,
      time: form.time,
      type: form.type,
      interviewer: form.interviewer.trim(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Schedule Interview
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              with {candidate.name} — {candidate.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {touched && Object.keys(errors).length > 0 && (
            <div
              className="px-4 py-2.5 rounded-xl text-xs font-semibold"
              style={{
                backgroundColor: "rgba(239,68,68,.1)",
                color: "#EF4444",
              }}
            >
              Please fill in all required fields.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Date *
              </label>
              <input
                type="date"
                className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none font-semibold"
                style={{
                  border: `1.5px solid ${touched && errors.date ? "#EF4444" : "var(--border)"}`,
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                value={form.date}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value });
                  if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
                }}
              />
            </div>
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Time *
              </label>
              <div className="relative mt-1.5">
                <Clock
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  type="time"
                  className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none font-semibold"
                  style={{
                    border: `1.5px solid ${touched && errors.time ? "#EF4444" : "var(--border)"}`,
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.time}
                  onChange={(e) => {
                    setForm({ ...form, time: e.target.value });
                    if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <label
              style={{
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Interview Type
            </label>
            <div className="relative mt-1.5">
              <select
                className="w-full rounded-xl px-3 pr-8 py-2.5 text-sm outline-none appearance-none font-semibold"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {[
                  "Video Call",
                  "Phone Screen",
                  "In-Person",
                  "Technical Test",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--muted-foreground)" }}
              />
            </div>
          </div>
          <div>
            <label
              style={{
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Interviewer *
            </label>
            <input
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none font-semibold"
              style={{
                border: `1.5px solid ${touched && errors.interviewer ? "#EF4444" : "var(--border)"}`,
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. Sarah Jenkins"
              value={form.interviewer}
              onChange={(e) => {
                setForm({ ...form, interviewer: e.target.value });
                if (errors.interviewer) setErrors((prev) => ({ ...prev, interviewer: "" }));
              }}
            />
          </div>
        </div>
        <div
          className="px-6 pb-6 flex gap-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 12px rgba(5,150,105,.35)",
            }}
          >
            <CheckCircle size={14} />
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Candidate Modal ────────────────────────────────── */
function AddCandidateModal({
  stage,
  onClose,
  onAdd,
}: {
  stage: Stage;
  onClose: () => void;
  onAdd: (stage: Stage, c: Candidate) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    location: "Remote",
    type: "Full-time",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  useEscapeKey(onClose);

  const handleAdd = () => {
    setTouched(true);
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.role.trim()) errs.role = "Job role is required";
    
    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        errs.email = "Please enter a valid email address";
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const initials = form.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    onAdd(stage, {
      id: `C${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      avatar: null,
      initials,
      type: form.type,
      location: form.location,
      rating: 3,
      source: "LinkedIn",
      interviewerAvatars: [],
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Add Candidate
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Adding to{" "}
              <span style={{ color: "#10B981", fontWeight: 600 }}>{stage}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {touched && Object.keys(errors).length > 0 && (
            <div
              className="px-4 py-2.5 rounded-xl text-xs font-semibold"
              style={{
                backgroundColor: "rgba(239,68,68,.1)",
                color: "#EF4444",
              }}
            >
              {Object.values(errors)[0]}
            </div>
          )}
          <div>
            <label
              style={{
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Full Name *
            </label>
            <div className="relative mt-1.5">
              <Users
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--muted-foreground)" }}
              />
              <input
                className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none font-semibold"
                style={{
                  border: `1.5px solid ${touched && errors.name ? "#EF4444" : "var(--border)"}`,
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="e.g. Jordan Blake"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
              />
            </div>
          </div>
          <div>
            <label
              style={{
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Job Role *
            </label>
            <div className="relative mt-1.5">
              <Briefcase
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--muted-foreground)" }}
              />
              <input
                className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none font-semibold"
                style={{
                  border: `1.5px solid ${touched && errors.role ? "#EF4444" : "var(--border)"}`,
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="e.g. Senior React Developer"
                value={form.role}
                onChange={(e) => {
                  setForm({ ...form, role: e.target.value });
                  if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
                }}
              />
            </div>
          </div>
          <div>
            <label
              style={{
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Email Address
            </label>
            <input
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none font-semibold"
              style={{
                border: `1.5px solid ${touched && errors.email ? "#EF4444" : "var(--border)"}`,
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              placeholder="candidate@example.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Location
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <select
                  className="w-full rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none font-semibold"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                >
                  {["Remote", "On-site", "Hybrid"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Job Type
              </label>
              <div className="relative mt-1.5">
                <select
                  className="w-full rounded-xl px-3 pr-8 py-2.5 text-sm outline-none appearance-none font-semibold"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {["Full-time", "Part-time", "Contract", "Internship"].map(
                    (t) => (
                      <option key={t}>{t}</option>
                    ),
                  )}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="px-6 pb-6 flex gap-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 12px rgba(5,150,105,.35)",
            }}
          >
            <Plus size={14} />
            Add Candidate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Post Job Modal ─────────────────────────────────────── */
function PostJobModal({
  job,
  onClose,
  onPost,
}: {
  job?: JobPosting;
  onClose: () => void;
  onPost: (j: Omit<JobPosting, "id" | "postedAt" | "applicants"> & { id?: string }) => void;
}) {
  const [form, setForm] = useState({
    title: job?.title || "",
    department: job?.department || "Engineering",
    location: job?.location || "Remote",
    type: job?.type || "Full-time",
    experience: job?.experience || "",
    salary: job?.salary || "",
    description: job?.description || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  useEscapeKey(onClose);

  const handlePost = () => {
    setTouched(true);
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Job title is required";
    if (!form.description.trim()) errs.description = "Job description is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onPost({
      ...form,
      id: job?.id,
    });
    onClose();
  };

  const field = (
    label: string,
    key: keyof typeof form,
    placeholder: string,
    icon?: React.ReactNode,
  ) => (
    <div>
      <label
        style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        {icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {icon}
          </span>
        )}
        <input
          className={`w-full rounded-xl ${icon ? "pl-9" : "px-3"} pr-3 py-2.5 text-sm outline-none font-semibold`}
          style={{
            border: `1.5px solid ${touched && errors[key] ? "#EF4444" : "var(--border)"}`,
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => {
            setForm({ ...form, [key]: e.target.value });
            if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3
              style={{
                color: "var(--foreground)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {job ? "Edit Job Listing" : "Post a New Job"}
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {job ? "Update job listing details" : "Create a new job opening for recruitment"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {touched && Object.keys(errors).length > 0 && (
            <div
              className="px-4 py-2.5 rounded-xl text-xs font-semibold"
              style={{
                backgroundColor: "rgba(239,68,68,.1)",
                color: "#EF4444",
              }}
            >
              {Object.values(errors)[0]}
            </div>
          )}
          {field(
            "Job Title *",
            "title",
            "e.g. Senior React Developer",
            <Briefcase size={13} />,
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["department", "location"] as const).map((k) => (
              <div key={k}>
                <label
                  style={{
                    color: "var(--foreground)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </label>
                <div className="relative mt-1.5">
                  {k === "department" ? (
                    <Users
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  ) : (
                    <MapPin
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  )}
                  <select
                    className="w-full rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none font-semibold"
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  >
                    {k === "department"
                      ? [
                          "Engineering",
                          "Design",
                          "Marketing",
                          "Sales",
                          "HR",
                          "Finance",
                        ].map((d) => <option key={d}>{d}</option>)
                      : ["Remote", "On-site", "Hybrid"].map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                style={{
                  color: "var(--foreground)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Job Type
              </label>
              <select
                className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none appearance-none font-semibold"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {["Full-time", "Part-time", "Contract", "Internship"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </select>
            </div>
            {field("Experience", "experience", "e.g. 3-5 years")}
          </div>
          {field(
            "Salary Range",
            "salary",
            "e.g. ₹80,000 – ₹1,20,000",
            <IndianRupee size={13} />,
          )}
          <div>
            <label
              style={{
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Job Description *
            </label>
            <textarea
              rows={3}
              className="w-full mt-1.5 rounded-xl px-3 py-2 text-sm outline-none resize-none font-semibold"
              style={{
                border: `1.5px solid ${touched && errors.description ? "#EF4444" : "var(--border)"}`,
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              placeholder="Brief description of the role and responsibilities…"
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
            />
          </div>
        </div>
        <div
          className="px-6 pb-6 flex gap-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 12px rgba(5,150,105,.35)",
            }}
          >
            {job ? "Save Changes" : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Editable Star Rating ───────────────────────────────── */
function StarRating({
  value,
  onChange,
  size = 12,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          style={{
            cursor: onChange ? "pointer" : "default",
            transition: "transform .1s",
            transform: hovered === s ? "scale(1.25)" : "scale(1)",
          }}
          fill={s <= (hovered || value) ? "var(--primary)" : "transparent"}
          color={s <= (hovered || value) ? "var(--primary)" : "var(--border)"}
          onMouseEnter={() => onChange && setHovered(s)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(s)}
        />
      ))}
    </div>
  );
}

/* ─── Candidate Card ─────────────────────────────────────── */
function CandidateCard({
  candidate,
  onSchedule,
  onDetail,
  onDelete,
  onMoveNext,
  onUpdateRating,
  nextStage,
  onDragStart,
}: {
  candidate: Candidate;
  nextStage: Stage | null;
  onSchedule: () => void;
  onDetail: () => void;
  onDelete: () => void;
  onMoveNext: () => void;
  onUpdateRating: (newRating: number) => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl shadow-sm p-4 cursor-grab active:cursor-grabbing transition-all border"
      style={{
        backgroundColor: "var(--card)",
        boxShadow: hovered
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        borderColor: hovered ? "var(--primary)" : "var(--border)",
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4
          className="truncate text-[14px] font-black leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          {candidate.name}
        </h4>
        <div
          className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider"
          style={{
            backgroundColor: "var(--secondary)",
            color: "var(--primary)",
            border: "1px solid var(--border)",
          }}
        >
          {candidate.source || "LinkedIn"}
        </div>
      </div>

      <p
        className="mb-3 truncate text-[13px]"
        style={{ color: "var(--muted-foreground)" }}
      >
        {candidate.role}
      </p>

      <div className="flex items-center gap-1.5 mb-3">
        <Calendar size={12} style={{ color: "var(--muted-foreground)" }} />
        <span
          className="text-[12px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          Applied {candidate.date}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <StarRating value={candidate.rating} size={12} onChange={onUpdateRating} />
          <span className="text-[12px] font-bold text-amber-500 ml-1">
            {candidate.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex -space-x-2">
          {(candidate.interviewerAvatars || []).slice(0, 3).map((av, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 bg-slate-100 overflow-hidden"
              style={{ borderColor: "var(--card)" }}
            >
              <img src={av} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {(candidate.interviewerAvatars || []).length > 3 && (
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
              style={{
                borderColor: "var(--card)",
                backgroundColor: "var(--secondary)",
                color: "var(--muted-foreground)",
              }}
            >
              +{(candidate.interviewerAvatars || []).length - 3}
            </div>
          )}
        </div>
      </div>

      {candidate.interviewDate && (
        <div className="mb-4">
          <span
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 w-fit"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            <Clock size={12} />
            {candidate.interviewDate}
          </span>
        </div>
      )}

      <div
        className="flex items-center justify-between pt-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex gap-3">
          <button
            onClick={onDetail}
            className="text-[13px] font-semibold transition-colors hover:opacity-70"
            style={{ color: "var(--muted-foreground)" }}
          >
            View
          </button>
          <button
            onClick={onSchedule}
            className="text-[13px] font-semibold transition-colors hover:opacity-70"
            style={{ color: "var(--primary)" }}
          >
            Schedule
          </button>
        </div>
        <div className="flex items-center gap-2">
          {nextStage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveNext();
              }}
              className="text-[12px] font-black flex items-center gap-1 transition-all hover:translate-x-0.5"
              style={{ color: "var(--primary)" }}
            >
              Move →
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: "var(--muted-foreground)" }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Candidate Detail Side Panel ────────────────────────── */
function CandidateDetailSidePanel({
  candidate,
  stage,
  onClose,
  onDelete,
  onMoveNext,
  onEdit,
  onSchedule,
  scheduledInterviews,
}: {
  candidate: Candidate;
  stage: Stage;
  onClose: () => void;
  onDelete: () => void;
  onMoveNext: () => void;
  onEdit: (c: Candidate) => void;
  onSchedule: () => void;
  scheduledInterviews: ScheduledInterview[];
}) {
  const [activeTab, setActiveTab] = useState<"Overview" | "Interviews" | "Activity">("Overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: candidate.name,
    role: candidate.role,
    location: candidate.location,
    type: candidate.type,
    source: candidate.source || "LinkedIn",
    email: `${candidate.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEscapeKey(onClose);

  const steps: Stage[] = [
    "Applied",
    "Screening",
    "Round 1",
    "Round 2",
    "Offer",
    "Hired",
  ];
  const currentIdx = steps.indexOf(stage);

  const handleSaveEdit = () => {
    const errs: Record<string, string> = {};
    if (!editForm.name.trim()) errs.name = "Name is required";
    if (!editForm.role.trim()) errs.role = "Role is required";
    if (editForm.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email.trim())) {
        errs.email = "Invalid email format";
      }
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const initials = editForm.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    onEdit({
      ...candidate,
      name: editForm.name.trim(),
      role: editForm.role.trim(),
      location: editForm.location,
      type: editForm.type,
      source: editForm.source as any,
      initials,
    });
    setIsEditing(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[2000]"
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 bottom-0 w-[450px] z-[2010] shadow-2xl flex flex-col transform transition-transform duration-500 ease-out animate-slide-in"
        style={{
          backgroundColor: "var(--card)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        `}</style>

        <div
          className="p-6 border-b flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-20"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--primary)",
              }}
            >
              <Users size={18} />
            </div>
            <h2
              className="text-lg font-black"
              style={{ color: "var(--foreground)" }}
            >
              {isEditing ? "Edit Profile" : "Candidate Profile"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Header Card */}
          <div className="p-8 pb-4">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-3xl overflow-hidden border-4 shadow-xl"
                  style={{
                    backgroundColor: "var(--secondary)",
                    borderColor: "var(--secondary)",
                  }}
                >
                  {candidate.avatar ? (
                    <img
                      src={candidate.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-3xl font-black"
                      style={{ color: "var(--primary)" }}
                    >
                      {isEditing ? editForm.name.slice(0, 2).toUpperCase() : candidate.initials}
                    </div>
                  )}
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 flex items-center justify-center text-white shadow-lg"
                  style={{ borderColor: "var(--card)" }}
                >
                  <CheckCircle size={14} />
                </div>
              </div>
              
              {!isEditing ? (
                <div className="pt-2 flex-1">
                  <h3
                    className="text-2xl font-black mb-1 leading-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    {candidate.name}
                  </h3>
                  <p
                    className="text-sm font-bold mb-3 flex items-center gap-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {candidate.role} • {candidate.location}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      {candidate.source || "LinkedIn"}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: "rgba(16,185,129,0.1)",
                        color: "#10B981",
                      }}
                    >
                      {candidate.type}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex-1 space-y-2">
                  <input
                    className="w-full rounded-xl px-3 py-1.5 text-sm outline-none border font-semibold"
                    style={{
                      borderColor: errors.name ? "#EF4444" : "var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                    value={editForm.name}
                    onChange={(e) => {
                      setEditForm({ ...editForm, name: e.target.value });
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="Candidate Name"
                  />
                  <input
                    className="w-full rounded-xl px-3 py-1.5 text-sm outline-none border font-semibold"
                    style={{
                      borderColor: errors.role ? "#EF4444" : "var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                    value={editForm.role}
                    onChange={(e) => {
                      setEditForm({ ...editForm, role: e.target.value });
                      if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
                    }}
                    placeholder="Job Role"
                  />
                </div>
              )}
            </div>

            {/* Tabs */}
            <div
              className="flex items-center gap-6 border-b mt-4"
              style={{ borderColor: "var(--border)" }}
            >
              {(["Overview", "Interviews", "Activity"] as const).map((t) => (
                <button
                  key={t}
                  disabled={isEditing}
                  onClick={() => setActiveTab(t)}
                  className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === t ? "text-emerald-600" : "text-slate-400"
                  } ${isEditing ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{
                    color:
                      activeTab === t
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                  }}
                >
                  {t}
                  {activeTab === t && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 pt-4 space-y-8">
            {isEditing && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Location</label>
                  <select
                    className="w-full mt-1.5 rounded-xl px-3 py-2 text-sm outline-none border font-semibold"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  >
                    {["Remote", "On-site", "Hybrid"].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Job Type</label>
                  <select
                    className="w-full mt-1.5 rounded-xl px-3 py-2 text-sm outline-none border font-semibold"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  >
                    {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Source</label>
                  <select
                    className="w-full mt-1.5 rounded-xl px-3 py-2 text-sm outline-none border font-semibold"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--border)",
                    }}
                    value={editForm.source}
                    onChange={(e) => setEditForm({ ...editForm, source: e.target.value as Source })}
                  >
                    {["LinkedIn", "Indeed", "Referral"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                  <input
                    className="w-full mt-1.5 rounded-xl px-3 py-2 text-sm outline-none border font-semibold"
                    style={{
                      borderColor: errors.email ? "#EF4444" : "var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                    value={editForm.email}
                    onChange={(e) => {
                      setEditForm({ ...editForm, email: e.target.value });
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="candidate@example.com"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    style={{ color: "var(--foreground)", borderColor: "var(--border)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {!isEditing && activeTab === "Overview" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-2xl border"
                    style={{
                      backgroundColor: "var(--secondary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">
                      Total Experience
                    </p>
                    <p
                      className="text-sm font-black"
                      style={{ color: "var(--foreground)" }}
                    >
                      5.4 Years
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-2xl border"
                    style={{
                      backgroundColor: "var(--secondary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">
                      Notice Period
                    </p>
                    <p
                      className="text-sm font-black"
                      style={{ color: "var(--foreground)" }}
                    >
                      15 Days
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      Contact Details
                    </h4>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:opacity-80"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        icon: <Send size={14} />,
                        val: editForm.email,
                      },
                      {
                        icon: <MessageSquare size={14} />,
                        val: "+1 (555) 000-0000",
                      },
                      {
                        icon: <Briefcase size={14} />,
                        val: `linkedin.com/in/${candidate.name.toLowerCase().replace(/\s+/g, "")}`,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm font-bold p-3 rounded-xl border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                        style={{
                          color: "var(--foreground)",
                          borderColor: "var(--border)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--primary)",
                          }}
                        >
                          {item.icon}
                        </div>
                        <span className="truncate flex-1">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 text-slate-400">
                    Pipeline Status
                  </h4>
                  <div className="relative pl-6 space-y-6">
                    <div
                      className="absolute left-[7px] top-2 bottom-2 w-0.5"
                      style={{ backgroundColor: "var(--border)" }}
                    />
                    {steps.map((step, i) => (
                      <div
                        key={step}
                        className="relative flex items-center gap-4"
                      >
                        <div
                          className="absolute -left-[23px] w-4 h-4 rounded-full border-2 shadow-sm z-10 transition-all duration-300"
                          style={{
                            borderColor: "var(--card)",
                            backgroundColor:
                              i <= currentIdx
                                ? "var(--primary)"
                                : "var(--border)",
                            transform:
                              i === currentIdx ? "scale(1.2)" : "scale(1)",
                            boxShadow:
                              i === currentIdx
                                ? "0 0 15px var(--primary)"
                                : "none",
                          }}
                        />
                        <div className="flex flex-col">
                          <span
                            className="text-sm font-black"
                            style={{
                              color:
                                i <= currentIdx
                                  ? "var(--foreground)"
                                  : "var(--muted-foreground)",
                            }}
                          >
                            {step}
                          </span>
                          {i === currentIdx && (
                            <span className="text-[10px] font-bold text-emerald-500">
                              Currently in this stage
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 text-slate-400">
                    Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React.js",
                      "TypeScript",
                      "Node.js",
                      "Tailwind CSS",
                      "Redux",
                      "AWS",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border"
                        style={{
                          backgroundColor: "var(--secondary)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isEditing && activeTab === "Interviews" && (
              <div className="space-y-4">
                {scheduledInterviews.map((iv) => (
                  <div
                    key={iv.id}
                    className="p-4 rounded-2xl border transition-all hover:shadow-md"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {iv.type}
                      </p>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-100 text-emerald-600 border border-emerald-200">
                        Upcoming
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center gap-1.5 text-xs font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        <Calendar size={14} className="text-slate-400" />{" "}
                        {iv.date}
                      </div>
                      <div
                        className="flex items-center gap-1.5 text-xs font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        <Clock size={14} className="text-slate-400" /> {iv.time}
                      </div>
                    </div>
                    {iv.interviewer && (
                      <p className="text-[11px] font-bold text-slate-400 mt-2">
                        Interviewer: <span className="text-slate-700 dark:text-slate-300 font-semibold">{iv.interviewer}</span>
                      </p>
                    )}
                  </div>
                ))}
                {scheduledInterviews.length === 0 && (
                  <p className="text-xs font-bold text-slate-400 text-center py-6">
                    No upcoming interviews scheduled.
                  </p>
                )}
                <button
                  onClick={onSchedule}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                >
                  Schedule New Interview
                </button>
              </div>
            )}

            {!isEditing && activeTab === "Activity" && (
              <div className="space-y-6 pl-4 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                {[
                  {
                    title: `Applied for ${candidate.role}`,
                    desc: `Job application received via ${candidate.source}.`,
                    date: candidate.date,
                    color: "bg-blue-500",
                  },
                  {
                    title: `Entered Pipeline: ${stage}`,
                    desc: `Moved to stage ${stage} for screening.`,
                    date: "Today",
                    color: "bg-emerald-500",
                  },
                  ...scheduledInterviews.map((iv) => ({
                    title: `${iv.type} Scheduled`,
                    desc: `Interview with ${iv.interviewer || "Team"} scheduled.`,
                    date: iv.date,
                    color: "bg-amber-500",
                  })),
                ].map((act, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    <div className={`absolute -left-[21px] w-3.5 h-3.5 rounded-full ${act.color} border-2 border-white dark:border-slate-900 z-10`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                        {act.title}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {act.desc}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 mt-1 uppercase font-mono">
                        {act.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <div
            className="p-8 border-t bg-white/50 dark:bg-black/20 backdrop-blur-md"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex gap-3">
              <button
                onClick={onDelete}
                className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all hover:bg-red-50 hover:text-red-500"
                style={{
                  color: "var(--foreground)",
                  borderColor: "var(--border)",
                }}
              >
                Reject
              </button>
              <button
                onClick={onMoveNext}
                className="flex-[2] py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-all"
                style={{
                  backgroundColor: "var(--primary)",
                  boxShadow: "0 8px 20px -6px rgba(16,185,129,0.5)",
                }}
              >
                Move to Next Stage
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Candidates View ────────────────────────────────────── */
function CandidatesView({
  candidates,
  onDetail,
  onSchedule,
  onMessage,
}: {
  candidates: Candidate[];
  onDetail: (c: Candidate) => void;
  onSchedule: (c: Candidate) => void;
  onMessage: (c: Candidate) => void;
}) {
  return (
    <div
      className="rounded-3xl shadow-sm border overflow-hidden"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <table className="w-full">
        <thead>
          <tr
            className="border-b"
            style={{
              backgroundColor: "var(--secondary)",
              borderColor: "var(--border)",
            }}
          >
            {[
              "Candidate",
              "Role",
              "Applied Date",
              "Location",
              "Source",
              "Rating",
              "",
            ].map((h) => (
              <th
                key={h}
                className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
          {candidates.map((c) => (
            <tr
              key={c.id}
              className="transition-all cursor-pointer group hover:opacity-80"
              style={{ backgroundColor: "var(--card)" }}
              onClick={() => onDetail(c)}
            >
              <td className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--primary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      c.initials
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-black"
                      style={{ color: "var(--foreground)" }}
                    >
                      {c.name}
                    </p>
                    <p
                      className="text-[11px] font-bold uppercase tracking-tight"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {c.type}
                    </p>
                  </div>
                </div>
              </td>
              <td
                className="px-8 py-4 text-sm font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {c.role}
              </td>
              <td
                className="px-8 py-4 text-sm font-bold"
                style={{ color: "var(--muted-foreground)" }}
              >
                {c.date}
              </td>
              <td
                className="px-8 py-4 text-sm font-bold"
                style={{ color: "var(--muted-foreground)" }}
              >
                {c.location}
              </td>
              <td className="px-8 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    c.source === "LinkedIn"
                      ? "bg-blue-50 text-blue-600"
                      : c.source === "Indeed"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {c.source}
                </span>
              </td>
              <td className="px-8 py-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      fill={s <= c.rating ? "#F59E0B" : "transparent"}
                      color={s <= c.rating ? "#F59E0B" : "var(--border)"}
                    />
                  ))}
                </div>
              </td>
              <td className="px-8 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMessage(c);
                    }}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSchedule(c);
                    }}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <Calendar size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Interviews View ────────────────────────────────────── */
function InterviewsView({
  interviews,
  onDismiss,
  onJoinCall,
}: {
  interviews: ScheduledInterview[];
  onDismiss: (id: string) => void;
  onJoinCall: (iv: ScheduledInterview) => void;
}) {
  if (interviews.length === 0) {
    return (
      <div
        className="rounded-3xl p-20 flex flex-col items-center justify-center border shadow-sm"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{
            backgroundColor: "var(--secondary)",
            color: "var(--muted-foreground)",
          }}
        >
          <Calendar size={40} />
        </div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          No Scheduled Interviews
        </h3>
        <p
          className="max-w-sm text-center font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          When you schedule interviews with candidates, they will appear here.
        </p>
      </div>
    );
  }

  // Simple logic to find days with interviews (mocking based on current month)
  const today = new Date().getDate();
  const interviewDays = new Set(
    interviews
      .map((iv) => {
        // Basic parser for "May 12, 2024" or similar
        const match = iv.date.match(/\d+/);
        return match ? parseInt(match[0]) : null;
      })
      .filter((d) => d !== null),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3
            className="text-sm font-black uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Upcoming Interviews ({interviews.length})
          </h3>
          <button className="text-xs font-black text-emerald-600 hover:underline">
            View History
          </button>
        </div>
        <div className="space-y-4">
          {interviews.map((iv) => (
            <div
              key={iv.id}
              className="p-6 rounded-[24px] shadow-sm border group transition-all hover:border-emerald-500/30"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--primary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {iv.candidateInitials}
                  </div>
                  <div>
                    <h4
                      className="text-base font-black flex items-center gap-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {iv.candidateName}
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-100 text-emerald-600 border border-emerald-200">
                        Confirmed
                      </span>
                    </h4>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {iv.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => onJoinCall(iv)}
                    className="p-2.5 rounded-xl transition-all hover:bg-emerald-50 hover:text-emerald-500"
                    style={{ color: "var(--muted-foreground)" }}
                    title="Join Call"
                  >
                    <Video size={18} />
                  </button>
                  <button
                    onClick={() => onDismiss(iv.id)}
                    className="p-2.5 rounded-xl transition-all hover:bg-red-50 hover:text-red-500"
                    style={{ color: "var(--muted-foreground)" }}
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                  <button
                    className="p-2.5 rounded-xl transition-all hover:bg-slate-100"
                    style={{ color: "var(--muted-foreground)" }}
                    title="Reschedule"
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </div>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Calendar size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Date
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {iv.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Clock size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Time
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {iv.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Video size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Mode
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {iv.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  className="flex-[2] py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-md hover:shadow-lg text-white"
                  style={{
                    backgroundColor: "var(--primary)",
                  }}
                >
                  Join Meeting
                </button>
                <button
                  className="flex-1 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all hover:bg-slate-50"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--foreground)",
                    borderColor: "var(--border)",
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div
          className="rounded-3xl border p-8 shadow-sm"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3
              className="text-sm font-black uppercase tracking-widest"
              style={{ color: "var(--foreground)" }}
            >
              Calendar
            </h3>
            <div className="flex gap-2">
              <button
                className="p-1.5 rounded-lg border hover:bg-slate-50"
                style={{ borderColor: "var(--border)" }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="p-1.5 rounded-lg border hover:bg-slate-50"
                style={{ borderColor: "var(--border)" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div
                key={d}
                className="h-8 flex items-center justify-center text-[10px] font-black text-slate-400"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasInterview = interviewDays.has(day);
              const isToday = day === today;
              return (
                <div
                  key={i}
                  className={`relative h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer group ${
                    isToday
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  style={{
                    color: isToday ? "white" : "var(--foreground)",
                    border:
                      hasInterview && !isToday
                        ? "1px dashed var(--primary)"
                        : "none",
                  }}
                >
                  {day}
                  {hasInterview && !isToday && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Today's Agenda
            </h4>
            {interviews.filter((iv) => {
              const match = iv.date.match(/\d+/);
              return match && parseInt(match[0]) === today;
            }).length > 0 ? (
              interviews
                .filter((iv) => {
                  const match = iv.date.match(/\d+/);
                  return match && parseInt(match[0]) === today;
                })
                .map((iv) => (
                  <div
                    key={iv.id}
                    className="p-4 rounded-2xl border flex gap-4 items-start"
                    style={{
                      backgroundColor: "var(--secondary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="w-1 h-10 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-emerald-600 mb-0.5">
                        {iv.time}
                      </p>
                      <p
                        className="text-sm font-black"
                        style={{ color: "var(--foreground)" }}
                      >
                        {iv.candidateName}
                      </p>
                      <p className="text-[11px] font-bold text-slate-500">
                        {iv.type}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div
                className="py-6 text-center border-2 border-dashed rounded-2xl"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-xs font-bold text-slate-400">
                  No interviews for today
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl border bg-slate-900 text-white shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-sm font-black mb-1">Interview Pro-Tips</h4>
            <p className="text-xs font-bold text-slate-400 mb-4">
              Master your hiring process
            </p>
            <ul className="space-y-3">
              {[
                "Check connection 5m before",
                "Review candidate portfolio",
                "Prepare structured questions",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[11px] font-bold"
                >
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Video size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView({ pipeline }: { pipeline: Record<Stage, Candidate[]> }) {
  const allCandidates = Object.values(pipeline).flat();
  const totalCandidates = allCandidates.length;

  const appliedCount = pipeline.Applied.length;
  const screeningCount = pipeline.Screening.length;
  const interviewCount = pipeline["Round 1"].length + pipeline["Round 2"].length;
  const offerCount = pipeline.Offer.length;
  const hiredCount = pipeline.Hired.length;

  const totalApplied = appliedCount || 1;

  const funnel = [
    { stage: "Applied", count: appliedCount, rate: 100 },
    { stage: "Screening", count: screeningCount, rate: Math.round((screeningCount / totalApplied) * 100) },
    { stage: "Interview", count: interviewCount, rate: Math.round((interviewCount / totalApplied) * 100) },
    { stage: "Offer", count: offerCount, rate: Math.round((offerCount / totalApplied) * 100) },
    { stage: "Hired", count: hiredCount, rate: Math.round((hiredCount / totalApplied) * 100) },
  ];

  const linkedinCount = allCandidates.filter((c) => c.source === "LinkedIn").length;
  const indeedCount = allCandidates.filter((c) => c.source === "Indeed").length;
  const referralCount = allCandidates.filter((c) => c.source === "Referral").length;

  const totalSources = linkedinCount + indeedCount + referralCount || 1;
  const linkedinPct = Math.round((linkedinCount / totalSources) * 100);
  const indeedPct = Math.round((indeedCount / totalSources) * 100);
  const referralPct = Math.round((referralCount / totalSources) * 100);

  // Build dynamic activities list
  const activities = [
    ...pipeline.Hired.slice(-2).map((c) => ({ type: "Hired" as const, name: c.name, role: c.role, time: "Just now" })),
    ...pipeline.Offer.slice(-1).map((c) => ({ type: "Offer" as const, name: c.name, role: c.role, time: "4h ago" })),
    ...pipeline["Round 2"].slice(-1).map((c) => ({ type: "Interview" as const, name: c.name, role: c.role, time: "1d ago" })),
    ...pipeline.Applied.slice(-1).map((c) => ({ type: "Application" as const, name: c.name, role: c.role, time: "1d ago" })),
  ].slice(0, 4);

  if (activities.length === 0) {
    activities.push(
      { type: "Application", name: "Elena Rodriguez", role: "QA Lead", time: "1d ago" },
      { type: "Interview", name: "Michael Chen", role: "DevOps Engineer", time: "2d ago" }
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div
          className="p-8 rounded-[32px] border shadow-sm xl:col-span-2"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3
                className="text-lg font-black"
                style={{ color: "var(--foreground)" }}
              >
                Recruitment Funnel
              </h3>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--muted-foreground)" }}
              >
                End-to-end conversion analysis
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                Download PDF
              </button>
              <select
                className="px-4 py-2 rounded-xl border-none text-xs font-black outline-none"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--foreground)",
                }}
              >
                <option>Quarterly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
          <div className="space-y-8">
            {funnel.map((f, i, arr) => (
              <div key={f.stage} className="relative group">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span
                    className="text-xs font-black uppercase tracking-tighter"
                    style={{ color: "var(--foreground)" }}
                  >
                    {f.stage}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-black"
                      style={{ color: "var(--foreground)" }}
                    >
                      {f.count}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      candidates
                    </span>
                  </div>
                </div>
                <div
                  className="h-5 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden relative border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                    style={{
                      width: `${(f.count / (arr[0].count || 1)) * 100}%`,
                      backgroundColor: "var(--primary)",
                      boxShadow: "0 0 20px var(--primary)33",
                    }}
                  >
                    <span className="text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {f.rate}%
                    </span>
                  </div>
                </div>
                {i > 0 && (
                  <div className="absolute -top-6 right-0 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {arr[i - 1].count > 0 ? Math.round((f.count / arr[i - 1].count) * 100) : 0}% Pass Rate
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-8 rounded-[32px] border shadow-sm flex flex-col"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3
            className="text-lg font-black mb-10"
            style={{ color: "var(--foreground)" }}
          >
            Source Distribution
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-56 h-56 mb-10">
              <svg
                viewBox="0 0 36 36"
                className="w-full h-full transform -rotate-90 filter drop-shadow-lg"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="transparent"
                  stroke="var(--secondary)"
                  strokeWidth="4.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="4.5"
                  strokeDasharray={`${linkedinPct} 100`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="transparent"
                  stroke="#0EA5E9"
                  strokeWidth="4.5"
                  strokeDasharray={`${indeedPct} 100`}
                  strokeDashoffset={`-${linkedinPct}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="4.5"
                  strokeDasharray={`${referralPct} 100`}
                  strokeDashoffset={`-${linkedinPct + indeedPct}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-black"
                  style={{ color: "var(--foreground)" }}
                >
                  {totalCandidates}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Total Applicants
                </span>
              </div>
            </div>
            <div className="w-full space-y-4 px-2">
              {[
                {
                  label: "LinkedIn",
                  val: `${linkedinPct}%`,
                  color: "#10B981",
                  trend: "+12%",
                },
                { label: "Indeed", val: `${indeedPct}%`, color: "#0EA5E9", trend: "+5%" },
                {
                  label: "Referral",
                  val: `${referralPct}%`,
                  color: "#8B5CF6",
                  trend: "-2%",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between p-3 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/30"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span
                      className="text-xs font-black"
                      style={{ color: "var(--foreground)" }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-black"
                      style={{ color: "var(--foreground)" }}
                    >
                      {s.val}
                    </span>
                    <span
                      className={`text-[9px] font-black ${s.trend.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {s.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div
          className="p-8 rounded-[32px] border shadow-sm col-span-1 lg:col-span-1"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-sm font-black mb-8 uppercase tracking-widest text-slate-400">
            Time to Hire (Avg)
          </h3>
          <div className="flex items-end gap-3 h-40">
            {[18, 24, 21, 19, 15, 22, 18].map((v, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap">
                  {v} days
                </div>
                <div
                  className="w-full rounded-t-xl transition-all duration-500 group-hover:bg-emerald-500"
                  style={{
                    height: `${(v / 24) * 100}%`,
                    backgroundColor: "var(--secondary)",
                  }}
                />
                <div className="text-[10px] font-black text-center mt-3 text-slate-400">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-8 rounded-[32px] border shadow-sm xl:col-span-2"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Recent Hiring Activity
            </h3>
            <button className="text-xs font-black text-emerald-600">
              View Full Log
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border flex items-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${
                    act.type === "Hired"
                      ? "bg-emerald-500"
                      : act.type === "Offer"
                        ? "bg-purple-500"
                        : act.type === "Interview"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                  }`}
                >
                  {act.type === "Hired" ? (
                    <CheckCircle2 size={18} />
                  ) : act.type === "Offer" ? (
                    <Send size={18} />
                  ) : act.type === "Interview" ? (
                    <Calendar size={18} />
                  ) : (
                    <Users size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-black truncate"
                    style={{ color: "var(--foreground)" }}
                  >
                    {act.name}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 truncate">
                    {act.type} · {act.role}
                  </p>
                </div>
                <span className="text-[10px] font-black text-slate-300">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Jobs View ──────────────────────────────────────────── */
function JobsView({
  jobs,
  onPostJob,
  onEditJob,
  onSelectJob,
  onDeleteJob,
}: {
  jobs: JobPosting[];
  onPostJob: () => void;
  onEditJob: (j: JobPosting) => void;
  onSelectJob: (j: JobPosting) => void;
  onDeleteJob: (id: string) => void;
}) {


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Active Listings ({jobs.length})
        </h3>
        <button
          onClick={onPostJob}
          className="text-xs font-black text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all"
        >
          Create New <Plus size={14} />
        </button>
      </div>
      <div
        className="rounded-3xl shadow-sm border overflow-hidden"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <table className="w-full">
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: "var(--secondary)",
                borderColor: "var(--border)",
              }}
            >
              {[
                "Job Title",
                "Department",
                "Location",
                "Posted",
                "Applicants",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {jobs.map((j) => (
              <tr
                key={j.id}
                className="transition-all cursor-pointer group hover:opacity-80"
                style={{ backgroundColor: "var(--card)" }}
                onClick={() => onSelectJob(j)}
              >
                <td className="px-8 py-5">
                  <p
                    className="text-sm font-black"
                    style={{ color: "var(--foreground)" }}
                  >
                    {j.title}
                  </p>
                  <p
                    className="text-xs font-bold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {j.type} • {j.salary}
                  </p>
                </td>
                <td
                  className="px-8 py-5 text-sm font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {j.department}
                </td>
                <td
                  className="px-8 py-5 text-sm font-bold"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {j.location}
                  </div>
                </td>
                <td
                  className="px-8 py-5 text-sm font-bold"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {j.postedAt}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div
                      className="px-2 py-1 rounded-lg text-xs font-black"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      {j.applicants}
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      candidates
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border bg-emerald-100 text-emerald-600 border-emerald-200`}
                  >
                    Open
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditJob(j);
                      }}
                      className="p-2 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteJob(j.id);
                      }}
                      className="p-2 rounded-xl transition-all hover:bg-red-50 hover:text-red-500"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                      <Briefcase size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-400">
                      No active job listings. Create one to start hiring.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Empty Column State ─────────────────────────────────── */
function EmptyColumnState({ stage }: { stage: Stage }) {
  const emojis: Record<Stage, string> = {
    Applied: "📥",
    Screening: "🔍",
    "Round 1": "🎤",
    "Round 2": "💬",
    Offer: "📄",
    Hired: "🎉",
  };
  return (
    <div
      className="rounded-[24px] py-8 px-4 flex flex-col items-center justify-center gap-2 text-center"
      style={{
        border: "1.5px dashed var(--border)",
        backgroundColor: "var(--background)",
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{emojis[stage]}</span>
      <p
        style={{
          color: "var(--muted-foreground)",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        No candidates in {stage}
      </p>
      <p style={{ color: "var(--muted-foreground)", fontSize: 11 }}>
        Add one or drag a card here
      </p>
    </div>
  );
}

/* ─── Drop Zone ──────────────────────────────────────────── */
function DropZone({
  stage,
  onDrop,
  onDragDrop,
}: {
  stage: Stage;
  onDrop: () => void;
  onDragDrop: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const active = isDragOver || isHovered;
  return (
    <div
      onClick={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        onDragDrop();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: 24,
        border: `2px dashed ${active ? "var(--primary)" : "var(--border)"}`,
        backgroundColor: active ? "var(--secondary)" : "var(--card)",
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: "pointer",
        transition: "all .2s ease-out",
        boxShadow: active ? "0 0 0 4px rgba(16,185,129,.12)" : "none",
        transform: active ? "scale(1.01)" : "scale(1)",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          backgroundColor: active ? "var(--primary)" : "var(--secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .2s ease-out",
          boxShadow: active ? "0 4px 12px rgba(16,185,129,.35)" : "none",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? "white" : "var(--primary)"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: active ? "var(--foreground)" : "var(--muted-foreground)",
            fontSize: 12,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {isDragOver ? "Release to drop" : "+ Drop candidate here"}
        </p>
        <p
          style={{
            color: active ? "var(--primary)" : "var(--muted-foreground)",
            fontSize: 11,
            marginTop: 2,
          }}
        >
          {isDragOver ? `Moving to ${stage}` : "or click to add manually"}
        </p>
      </div>
    </div>
  );
}

/* ─── Page Header ────────────────────────────────────────── */
function PageHeader({
  activeJobsCount,
  onPostJob,
  onShowJobs,
}: {
  activeJobsCount: number;
  onPostJob: () => void;
  onShowJobs: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg ">
          <Briefcase size={24} />
        </div>
        <div className="flex items-center gap-3">
          <h1
            className="text-[26px] font-black"
            style={{ color: "var(--foreground)" }}
          >
            Recruitment
          </h1>
          <span
            className="px-3 py-1 rounded-full text-xs font-black"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            {activeJobsCount} Active Job{activeJobsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onShowJobs}
          className="px-6 py-2.5 rounded-full font-bold text-sm border hover:opacity-80 transition-all flex items-center gap-2"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
            borderColor: "var(--border)",
          }}
        >
          <Briefcase size={18} />
          Positions
        </button>
        <button
          onClick={onPostJob}
          className="px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2 text-white"
          style={{
            backgroundColor: "var(--primary)",
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
          }}
        >
          <Plus size={18} />
          Post a Job
        </button>
      </div>
    </div>
  );
}

/* ─── Info Bar ───────────────────────────────────────────── */
function InfoBar({
  newApps,
  interviewsToday,
  offersPending,
}: {
  newApps: number;
  interviewsToday: number;
  offersPending: number;
}) {
  const stats = [
    { label: `${newApps} new applications this week`, color: "#10B981" },
    { label: `${interviewsToday} interviews scheduled today`, color: "#F59E0B" },
    { label: `${offersPending} offers pending response`, color: "#8B5CF6" },
  ];

  return (
    <div className="flex items-center gap-6 mb-8 px-1">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── KPI Cards ──────────────────────────────────────────── */
function KpiCards({
  openPositions,
  applications,
  interviewsToday,
  offersSent,
}: {
  openPositions: number;
  applications: number;
  interviewsToday: number;
  offersSent: number;
}) {
  const cards = [
    {
      label: "Open Positions",
      value: openPositions,
      color: "emerald",
      icon: <Briefcase size={20} />,
    },
    {
      label: "Applications",
      value: applications,
      color: "teal",
      icon: <Users size={20} />,
    },
    {
      label: "Interviews Today",
      value: interviewsToday,
      color: "amber",
      icon: <Calendar size={20} />,
    },
    {
      label: "Offers Sent",
      value: offersSent,
      color: "purple",
      icon: <Send size={20} />,
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: "#10B981",
    teal: "#14B8A6",
    amber: "#F59E0B",
    purple: "#8B5CF6",
  };

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {cards.map((c, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl shadow-sm border flex items-center gap-4 transition-all"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: colorMap[c.color] }}
          >
            {c.icon}
          </div>
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--muted-foreground)" }}
            >
              {c.label}
            </p>
            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-black"
                style={{ color: "var(--foreground)" }}
              >
                {c.value}
              </span>
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-black"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--primary)",
                }}
              >
                +12%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Tabs ───────────────────────────────────────────────── */
type TabId = "Pipeline" | "Jobs" | "Candidates" | "Interviews" | "Analytics";

function RecruitmentTabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  const tabs: TabId[] = [
    "Pipeline",
    "Jobs",
    "Candidates",
    "Interviews",
    "Analytics",
  ];

  return (
    <div
      className="flex items-center gap-8 mb-8 border-b px-1"
      style={{ borderColor: "var(--border)" }}
    >
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`pb-4 text-sm font-bold transition-all relative ${
            active === t ? "text-emerald-600" : ""
          }`}
          style={{
            color: active === t ? "var(--primary)" : "var(--muted-foreground)",
          }}
        >
          {t}
          {active === t && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full shadow-sm shadow-emerald-200" />
          )}
        </button>
      ))}
    </div>
  );
}

const INITIAL_JOBS: JobPosting[] = [
  {
    id: "J001",
    title: "Senior React Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹1,20,000 – ₹1,80,000",
    description: "We are looking for a Senior React Developer to join our frontend team. You will be responsible for building high-quality, reusable components and optimizing application performance.",
    postedAt: "Jun 1, 2026",
    applicants: 3,
  },
  {
    id: "J002",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹90,000 – ₹1,40,000",
    description: "Looking for a backend engineer experienced in Node.js and TypeScript. You will build and scale APIs and work with databases.",
    postedAt: "May 28, 2026",
    applicants: 2,
  },
  {
    id: "J003",
    title: "Product Designer",
    department: "Design",
    location: "Hybrid",
    type: "Full-time",
    experience: "2+ years",
    salary: "₹70,000 – ₹1,00,000",
    description: "Join our design team to create user-centered product designs. Figma proficiency is required.",
    postedAt: "May 25, 2026",
    applicants: 1,
  },
  {
    id: "J004",
    title: "HR Specialist",
    department: "HR",
    location: "On-site",
    type: "Full-time",
    experience: "2+ years",
    salary: "₹50,000 – ₹70,000",
    description: "We are hiring an HR Specialist to help manage employee onboarding, relations, and recruitment coordination.",
    postedAt: "May 20, 2026",
    applicants: 1,
  }
];

const INITIAL_INTERVIEWS: ScheduledInterview[] = [
  {
    id: "IV001",
    candidateId: "C004",
    candidateName: "David Miller",
    candidateInitials: "DM",
    role: "Senior React Developer",
    date: "2026-06-04",
    time: "14:00",
    type: "Technical Test",
    interviewer: "Sarah Jenkins",
  },
  {
    id: "IV002",
    candidateId: "C005",
    candidateName: "Priya Nair",
    candidateInitials: "PN",
    role: "HR Specialist",
    date: "2026-06-05",
    time: "10:30",
    type: "Video Call",
    interviewer: "Mark Davis",
  }
];

function VideoCallSimulator({
  interview,
  onClose,
}: {
  interview: ScheduledInterview;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"connecting" | "connected">("connecting");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatus("connected");
    }, 2000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (status !== "connected") return;
    const interval = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-950 p-4 sm:p-8 select-none"
      style={{ backdropFilter: "blur(16px)" }}
    >
      <div className="w-full max-w-4xl h-[80vh] bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative border border-slate-800">
        {status === "connecting" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 text-3xl font-black animate-pulse">
                {interview.candidateInitials}
              </div>
              <div className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-20" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold tracking-tight mb-2">Connecting with {interview.candidateName}...</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Establishing secure link</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative bg-slate-950">
            {/* Candidate Video Stream (Simulated) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOff ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 text-6xl font-black">
                  {interview.candidateInitials}
                </div>
              ) : (
                <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-6">
                  {/* Waveform visualizer simulation overlay */}
                  <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">{interview.candidateName} ({interview.role})</span>
                  </div>
                  {/* Dynamic audio pulse ring */}
                  <div className="w-32 h-32 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-5xl font-black relative shadow-xl">
                    {interview.candidateInitials}
                    <div className="absolute inset-0 border-2 border-emerald-400 rounded-full animate-ping opacity-30" style={{ animationDuration: "1.5s" }} />
                  </div>
                  <p className="text-sm font-semibold text-slate-400 mt-6 max-w-xs text-center">
                    Candidate is connected. Audio/video stream active.
                  </p>
                </div>
              )}
            </div>

            {/* Recruiter Picture in Picture (PiP) */}
            <div className="absolute top-6 right-6 w-32 h-44 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-xl overflow-hidden z-20 flex flex-col items-center justify-center text-slate-400">
              <Users size={24} className="mb-2 text-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Recruiter</span>
            </div>

            {/* Timer Overlay */}
            <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-white text-xs font-bold font-mono">
              {formatDuration(duration)}
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-slate-900/95 backdrop-blur-md px-6 py-3.5 rounded-[24px] border border-slate-800 shadow-2xl">
              <button
                onClick={() => setIsMuted((m) => !m)}
                className={`p-3 rounded-full border transition-all ${isMuted ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}
              >
                {/* Mute icon */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/></svg>
              </button>
              <button
                onClick={() => setIsVideoOff((v) => !v)}
                className={`p-3 rounded-full border transition-all ${isVideoOff ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}
              >
                <Video size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-3.5 rounded-full bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95"
              >
                {/* Hang up icon */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.68 22.28a6 6 0 0 0 2.64 0l7.46-3.73a2 2 0 0 0 1.11-1.79v-2.58a2 2 0 0 0-1.25-1.86l-4.71-1.71a2 2 0 0 0-2 .41L12.3 12.7a8.62 8.62 0 0 1-3.6-3.6l1.38-1.63a2 2 0 0 0 .41-2L8.78 1.76A2 2 0 0 0 6.92.5H4.34a2 2 0 0 0-1.79 1.11L1.73 9.48a16 16 0 0 0 14.79 14.79l.52-.06Z"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export function Recruitment() {
  const { toasts, toast, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("Pipeline");

  // Local persistent states
  const [pipeline, setPipeline] = useState<Record<Stage, Candidate[]>>(() => {
    const saved = localStorage.getItem("nexus_recruitment_pipeline");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Deep clone the mock data recruitmentPipeline so we don't mutate global mock object
    return JSON.parse(JSON.stringify(recruitmentPipeline)) as Record<Stage, Candidate[]>;
  });

  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem("nexus_recruitment_jobs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_JOBS;
  });

  const [interviews, setInterviews] = useState<ScheduledInterview[]>(() => {
    const saved = localStorage.getItem("nexus_recruitment_interviews");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_INTERVIEWS;
  });

  // State saving helpers
  const updatePipeline = (newPipeline: Record<Stage, Candidate[]>) => {
    setPipeline(newPipeline);
    localStorage.setItem("nexus_recruitment_pipeline", JSON.stringify(newPipeline));
  };

  const updateJobs = (newJobs: JobPosting[]) => {
    setJobs(newJobs);
    localStorage.setItem("nexus_recruitment_jobs", JSON.stringify(newJobs));
  };

  const updateInterviews = (newInterviews: ScheduledInterview[]) => {
    setInterviews(newInterviews);
    localStorage.setItem("nexus_recruitment_interviews", JSON.stringify(newInterviews));
  };

  // Search & filter
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredPipeline = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = (pipeline[stage] || []).filter((c: Candidate) => {
        const q = query.toLowerCase();
        return (
          (!q ||
            c.name.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q)) &&
          (locationFilter === "All" || c.location === locationFilter) &&
          (typeFilter === "All" || c.type === typeFilter)
        );
      });
      return acc;
    },
    {} as Record<Stage, Candidate[]>,
  );

  const totalFiltered = STAGES.reduce(
    (s, st) => s + (filteredPipeline[st] || []).length,
    0,
  );
  const isFiltering =
    !!query || locationFilter !== "All" || typeFilter !== "All";

  // Modal & premium states
  const [showPostJob, setShowPostJob] = useState(false);
  const [editJobTarget, setEditJobTarget] = useState<JobPosting | null>(null);
  const [showJobs, setShowJobs] = useState(false);
  const [addStage, setAddStage] = useState<Stage | null>(null);
  const [detailCandidate, setDetailCandidate] = useState<{
    candidate: Candidate;
    stage: Stage;
  } | null>(null);
  const [messageCandidate, setMessageCandidate] = useState<Candidate | null>(
    null,
  );
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    candidateId: string;
    stage: Stage;
    candidate: Candidate;
  } | null>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<ScheduledInterview | null>(null);

  const dragRef = useRef<{ candidateId: string; fromStage: Stage } | null>(
    null,
  );

  // CRUD - Candidate
  const handleAddCandidate = (stage: Stage, candidate: Candidate) => {
    const newPipeline = {
      ...pipeline,
      [stage]: [...(pipeline[stage] || []), candidate],
    };
    updatePipeline(newPipeline);
    toast(`${candidate.name} added to ${stage}`, "success");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { candidateId, stage, candidate } = deleteTarget;
    const newPipeline = {
      ...pipeline,
      [stage]: (pipeline[stage] || []).filter((c) => c.id !== candidateId),
    };
    updatePipeline(newPipeline);
    
    // Cleanup interviews
    const newInterviews = interviews.filter((iv) => iv.candidateId !== candidateId);
    updateInterviews(newInterviews);

    toast(`${candidate.name} removed`, "error");
    setDeleteTarget(null);
  };

  const handleMoveCandidate = (
    candidateId: string,
    fromStage: Stage,
    toStage: Stage,
  ) => {
    const candidate = (pipeline[fromStage] || []).find((c) => c.id === candidateId);
    if (!candidate) return;

    const newPipeline = {
      ...pipeline,
      [fromStage]: (pipeline[fromStage] || []).filter((c) => c.id !== candidateId),
      [toStage]: [...(pipeline[toStage] || []), candidate],
    };
    updatePipeline(newPipeline);
    toast(`${candidate.name} moved to ${toStage}`, "success");
  };

  const handleUpdateRating = (stage: Stage, candidateId: string, rating: number) => {
    const newPipeline = {
      ...pipeline,
      [stage]: (pipeline[stage] || []).map((c) =>
        c.id === candidateId ? { ...c, rating } : c
      ),
    };
    updatePipeline(newPipeline);
  };

  const handleEditCandidate = (stage: Stage, updated: Candidate) => {
    const newPipeline = {
      ...pipeline,
      [stage]: (pipeline[stage] || []).map((c) =>
        c.id === updated.id ? updated : c
      ),
    };
    updatePipeline(newPipeline);
    setDetailCandidate({ candidate: updated, stage });
    toast(`Profile updated for ${updated.name}`, "success");
  };

  // CRUD - Job Posting
  const handlePostJob = (
    jobForm: Omit<JobPosting, "id" | "postedAt" | "applicants"> & { id?: string },
  ) => {
    if (jobForm.id) {
      // Edit
      const updatedJobs = jobs.map((j) =>
        j.id === jobForm.id
          ? {
              ...j,
              title: jobForm.title,
              department: jobForm.department,
              location: jobForm.location,
              type: jobForm.type,
              experience: jobForm.experience,
              salary: jobForm.salary,
              description: jobForm.description,
            }
          : j
      );
      updateJobs(updatedJobs);
      toast(`"${jobForm.title}" updated successfully`, "success");
    } else {
      // Create
      const newJob: JobPosting = {
        id: `J${Date.now()}`,
        title: jobForm.title,
        department: jobForm.department,
        location: jobForm.location,
        type: jobForm.type,
        experience: jobForm.experience || "Any",
        salary: jobForm.salary || "Not Specified",
        description: jobForm.description,
        postedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        applicants: 0,
      };
      updateJobs([...jobs, newJob]);
      toast(`"${jobForm.title}" posted successfully`, "success");
    }
    setEditJobTarget(null);
  };

  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((j) => j.id !== jobId);
    updateJobs(updatedJobs);
    toast("Job listing deleted", "error");
  };

  // CRUD - Interview Scheduling
  const handleSchedule = (iv: Omit<ScheduledInterview, "id">) => {
    const newInterview: ScheduledInterview = {
      ...iv,
      id: `IV${Date.now()}`,
      candidateInitials: iv.candidateInitials || iv.candidateName.slice(0, 2).toUpperCase(),
    };
    updateInterviews([...interviews, newInterview]);

    // Add interviewDate to candidate
    let foundStage: Stage | null = null;
    for (const st of STAGES) {
      const c = (pipeline[st] || []).find((x) => x.id === iv.candidateId);
      if (c) {
        foundStage = st;
        break;
      }
    }
    if (foundStage) {
      const newPipeline = {
        ...pipeline,
        [foundStage]: (pipeline[foundStage] || []).map((x) =>
          x.id === iv.candidateId ? { ...x, interviewDate: `${iv.date} ${iv.time}` } : x
        ),
      };
      updatePipeline(newPipeline);
    }

    toast(`Interview scheduled with ${iv.candidateName} on ${iv.date}`, "info");
  };

  const handleCancelInterview = (id: string) => {
    const iv = interviews.find((x) => x.id === id);
    const updatedInterviews = interviews.filter((x) => x.id !== id);
    updateInterviews(updatedInterviews);

    if (iv) {
      let foundStage: Stage | null = null;
      for (const st of STAGES) {
        const c = (pipeline[st] || []).find((x) => x.id === iv.candidateId);
        if (c) {
          foundStage = st;
          break;
        }
      }
      if (foundStage) {
        const newPipeline = {
          ...pipeline,
          [foundStage]: (pipeline[foundStage] || []).map((x) => {
            if (x.id === iv.candidateId) {
              const { interviewDate, ...rest } = x;
              return rest;
            }
            return x;
          }),
        };
        updatePipeline(newPipeline);
      }
    }

    toast("Interview cancelled", "warning");
  };

  // Dynamic Statistics Calculations
  const allCandidates = Object.values(pipeline).flat();
  const openPositions = jobs.length;
  const applications = allCandidates.length;
  const newApps = (pipeline.Applied || []).length;
  const todayStr = new Date().toISOString().split("T")[0];
  const interviewsToday = interviews.filter((iv) => iv.date === todayStr).length;
  const offersPending = (pipeline.Offer || []).length;
  const offersSent = offersPending;

  return (
    <div
      className="w-full px-4 md:px-8 py-6 pb-10 min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Modals & Overlays */}
      {(showPostJob || editJobTarget) && (
        <PostJobModal
          job={editJobTarget || undefined}
          onClose={() => {
            setShowPostJob(false);
            setEditJobTarget(null);
          }}
          onPost={handlePostJob}
        />
      )}
      {showJobs && (
        <OpenPositionsModal jobs={jobs} onClose={() => setShowJobs(false)} />
      )}
      {addStage && (
        <AddCandidateModal
          stage={addStage}
          onClose={() => setAddStage(null)}
          onAdd={handleAddCandidate}
        />
      )}
      {detailCandidate && (
        <CandidateDetailSidePanel
          candidate={detailCandidate.candidate}
          stage={detailCandidate.stage}
          onClose={() => setDetailCandidate(null)}
          onDelete={() => {
            setDeleteTarget({
              candidateId: detailCandidate.candidate.id,
              stage: detailCandidate.stage,
              candidate: detailCandidate.candidate,
            });
            setDetailCandidate(null);
          }}
          onMoveNext={() => {
            const si = STAGES.indexOf(detailCandidate.stage);
            const nextStage = si < STAGES.length - 1 ? STAGES[si + 1] : null;
            if (nextStage) {
              handleMoveCandidate(detailCandidate.candidate.id, detailCandidate.stage, nextStage);
              setDetailCandidate(null);
            }
          }}
          onEdit={(updatedCandidate) => handleEditCandidate(detailCandidate.stage, updatedCandidate)}
          onSchedule={() => setScheduleCandidate(detailCandidate.candidate)}
          scheduledInterviews={interviews.filter(iv => iv.candidateId === detailCandidate.candidate.id)}
        />
      )}
      {messageCandidate && (
        <MessageModal
          candidate={messageCandidate}
          onClose={() => setMessageCandidate(null)}
        />
      )}
      {scheduleCandidate && (
        <ScheduleModal
          candidate={scheduleCandidate}
          onClose={() => setScheduleCandidate(null)}
          onSchedule={handleSchedule}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmDialog
          candidate={deleteTarget.candidate}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {activeVideoCall && (
        <VideoCallSimulator
          interview={activeVideoCall}
          onClose={() => setActiveVideoCall(null)}
        />
      )}

      <PageHeader
        activeJobsCount={openPositions}
        onPostJob={() => setShowPostJob(true)}
        onShowJobs={() => setShowJobs(true)}
      />
      <InfoBar
        newApps={newApps}
        interviewsToday={interviewsToday}
        offersPending={offersPending}
      />
      <KpiCards
        openPositions={openPositions}
        applications={applications}
        interviewsToday={interviewsToday}
        offersSent={offersSent}
      />
      <RecruitmentTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "Pipeline" && (
        <>
          {interviews.length > 0 && (
            <UpcomingInterviewsPanel
              interviews={interviews}
              onDismiss={handleCancelInterview}
              onJoinCall={(iv) => setActiveVideoCall(iv)}
            />
          )}

          <SearchFilterBar
            query={query}
            onQueryChange={setQuery}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            resultCount={totalFiltered}
          />

          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {STAGES.map((stage) => {
              const rawCount = (pipeline[stage] || []).length;
              const candidates = filteredPipeline[stage] || [];

              return (
                <div
                  key={stage}
                  className="flex-shrink-0"
                  style={{ width: "280px" }}
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-[13px] font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {stage}
                      </h3>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[12px] font-bold"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "white",
                        }}
                      >
                        {rawCount}
                      </span>
                    </div>
                  </div>

                  <div
                    className="space-y-4 p-3 rounded-xl min-h-[500px]"
                    style={{
                      backgroundColor: "var(--secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {candidates.length === 0 && !isFiltering && (
                      <EmptyColumnState stage={stage} />
                    )}
                    {candidates.map((candidate) => {
                      const si = STAGES.indexOf(stage);
                      const nextStage =
                        si < STAGES.length - 1 ? STAGES[si + 1] : null;
                      return (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          nextStage={nextStage}
                          onSchedule={() => setScheduleCandidate(candidate)}
                          onDetail={() =>
                            setDetailCandidate({ candidate, stage })
                          }
                          onDelete={() =>
                            setDeleteTarget({
                              candidateId: candidate.id,
                              stage,
                              candidate,
                            })
                          }
                          onMoveNext={() =>
                            nextStage &&
                            handleMoveCandidate(candidate.id, stage, nextStage)
                          }
                          onUpdateRating={(rating) => handleUpdateRating(stage, candidate.id, rating)}
                          onDragStart={(e: React.DragEvent) => {
                            dragRef.current = {
                              candidateId: candidate.id,
                              fromStage: stage,
                            };
                            e.dataTransfer.effectAllowed = "move";
                          }}
                        />
                      );
                    })}
                    <DropZone
                      stage={stage}
                      onDrop={() => setAddStage(stage)}
                      onDragDrop={() => {
                        const drag = dragRef.current;
                        if (!drag || drag.fromStage === stage) return;
                        handleMoveCandidate(
                          drag.candidateId,
                          drag.fromStage,
                          stage,
                        );
                        dragRef.current = null;
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "Jobs" && (
        <JobsView
          jobs={jobs}
          onPostJob={() => setShowPostJob(true)}
          onEditJob={(j) => setEditJobTarget(j)}
          onSelectJob={(j) => {
            setActiveTab("Pipeline");
            toast(`Showing pipeline for ${j.title}`, "info");
          }}
          onDeleteJob={handleDeleteJob}
        />
      )}
      {activeTab === "Candidates" && (
        <CandidatesView
          candidates={Object.values(pipeline).flat()}
          onDetail={(c) => {
            // Find candidate's current stage
            let foundStage: Stage = "Applied";
            for (const st of STAGES) {
              if ((pipeline[st] || []).some(x => x.id === c.id)) {
                foundStage = st;
                break;
              }
            }
            setDetailCandidate({ candidate: c, stage: foundStage });
          }}
          onSchedule={(c) => setScheduleCandidate(c)}
          onMessage={(c) => setMessageCandidate(c)}
        />
      )}
      {activeTab === "Interviews" && (
        <InterviewsView
          interviews={interviews}
          onDismiss={handleCancelInterview}
          onJoinCall={(iv) => setActiveVideoCall(iv)}
        />
      )}
      {activeTab === "Analytics" && <AnalyticsView pipeline={pipeline} />}
    </div>
  );
}
