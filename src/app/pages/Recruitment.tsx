import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, MessageSquare, Calendar, ChevronRight, Star, X, Briefcase,
  MapPin, DollarSign, ChevronDown, Users, Send, Clock, CheckCircle,
  Trash2, ArrowRight, AlertTriangle, Search, Filter,
  Bell, CheckCircle2, AlertCircle, Info, XCircle,
} from "lucide-react";
import { recruitmentPipeline } from "../data/mockData";
import { useRecruitment } from "../context/AppContext";
import type { Candidate as ContextCandidate } from "../context/AppContext";

/* ─── Types ──────────────────────────────────────────────── */
type Stage = "Applied" | "Screening" | "Interview" | "Offer Sent" | "Hired";
type ToastKind = "success" | "error" | "info" | "warning";

const STAGES: Stage[] = ["Applied", "Screening", "Interview", "Offer Sent", "Hired"];
const OVERLOAD = 10;

interface Candidate {
  id: string; name: string; role: string; date: string;
  avatar: string | null; initials: string; type: string;
  location: string; rating: number;
}
interface ScheduledInterview {
  id: string; candidateId: string; candidateName: string;
  candidateInitials: string; role: string;
  date: string; time: string; type: string; interviewer: string;
}
interface JobPosting {
  id: string; title: string; department: string; location: string;
  type: string; experience: string; salary: string; description: string;
  postedAt: string; applicants: number;
}
interface Toast { id: string; message: string; kind: ToastKind; }

/* ─── useToast ───────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = `t${Date.now()}${Math.random()}`;
    setToasts((p) => [...p, { id, message, kind }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);
  return { toasts, toast, dismiss };
}

/* ─── useEscapeKey ───────────────────────────────────────── */
function useEscapeKey(fn: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") fn(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [fn, active]);
}

/* ─── Toast UI ───────────────────────────────────────────── */
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const cfg: Record<ToastKind, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
    success: { bg: "rgba(16,185,129,.13)", border: "rgba(16,185,129,.3)", color: "#10B981", icon: <CheckCircle2 size={14} /> },
    error: { bg: "rgba(239,68,68,.13)", border: "rgba(239,68,68,.3)", color: "#EF4444", icon: <XCircle size={14} /> },
    warning: { bg: "rgba(245,158,11,.13)", border: "rgba(245,158,11,.3)", color: "#F59E0B", icon: <AlertCircle size={14} /> },
    info: { bg: "rgba(59,130,246,.13)", border: "rgba(59,130,246,.3)", color: "#3B82F6", icon: <Info size={14} /> },
  };
  return (
    <div className="fixed bottom-4 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <style>{`@keyframes tSlide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}`}</style>
      {toasts.map((t) => {
        const c = cfg[t.kind];
        return (
          <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl pointer-events-auto"
            style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, backdropFilter: "blur(12px)", animation: "tSlide .22s ease-out", minWidth: 240, maxWidth: 340 }}>
            <span style={{ color: c.color, flexShrink: 0 }}>{c.icon}</span>
            <span style={{ color: "var(--foreground)", fontSize: 13, fontWeight: 600, flex: 1 }}>{t.message}</span>
            <button onClick={() => onDismiss(t.id)} className="hover:opacity-60 transition-opacity" style={{ color: "var(--muted-foreground)", flexShrink: 0 }}><X size={12} /></button>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Search & Filter Bar ────────────────────────────────── */
function SearchFilterBar({ query, onQueryChange, locationFilter, onLocationChange, typeFilter, onTypeChange, resultCount }: {
  query: string; onQueryChange: (v: string) => void;
  locationFilter: string; onLocationChange: (v: string) => void;
  typeFilter: string; onTypeChange: (v: string) => void;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);
  const hasFilter = locationFilter !== "All" || typeFilter !== "All";

  return (
    <div className="mb-6">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
          <input
            className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none"
            style={{ border: "1.5px solid var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
            placeholder="Search candidates by name or role…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query && (
            <button onClick={() => onQueryChange("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}><X size={13} /></button>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all"
          style={{ backgroundColor: open || hasFilter ? "var(--primary)" : "var(--card)", color: open || hasFilter ? "white" : "var(--foreground)", border: "1.5px solid var(--border)" }}
        >
          <Filter size={13} />
          Filters
          {hasFilter && <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center" style={{ backgroundColor: "white", color: "var(--primary)" }}>!</span>}
        </button>
      </div>

      {open && (
        <div className="mt-3 p-4 rounded-2xl flex flex-wrap gap-4 items-center" style={{ backgroundColor: "var(--card)", border: "1.5px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <MapPin size={12} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ color: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 }}>Location</span>
            <select className="rounded-xl px-3 py-1.5 text-xs font-semibold outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} value={locationFilter} onChange={(e) => onLocationChange(e.target.value)}>
              {["All", "Remote", "On-site", "Hybrid"].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={12} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ color: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 }}>Job Type</span>
            <select className="rounded-xl px-3 py-1.5 text-xs font-semibold outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} value={typeFilter} onChange={(e) => onTypeChange(e.target.value)}>
              {["All", "Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          {hasFilter && (
            <button onClick={() => { onLocationChange("All"); onTypeChange("All"); }} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,.1)", color: "#EF4444" }}>Clear</button>
          )}
          {(query || hasFilter) && (
            <span style={{ color: "var(--muted-foreground)", fontSize: 12, marginLeft: "auto" }}>{resultCount} result{resultCount !== 1 ? "s" : ""}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Upcoming Interviews Panel ──────────────────────────── */
function UpcomingInterviewsPanel({ interviews, onDismiss }: { interviews: ScheduledInterview[]; onDismiss: (id: string) => void }) {
  if (!interviews.length) return null;
  return (
    <div className="rounded-[24px] p-5 mb-6" style={{ backgroundColor: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Bell size={14} style={{ color: "var(--primary)" }} />
        <h3 style={{ color: "var(--foreground)", fontSize: 14, fontWeight: 800 }}>Upcoming Interviews</h3>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-black" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{interviews.length}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        {interviews.map((iv) => (
          <div key={iv.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full sm:w-auto" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--primary)", fontSize: 10, fontWeight: 700 }}>{iv.candidateInitials}</span>
            </div>
            <div>
              <p style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 700 }}>{iv.candidateName}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: 11 }}>{iv.date} · {iv.time} · {iv.type}</p>
            </div>
            <button onClick={() => onDismiss(iv.id)} className="ml-1 hover:opacity-60 transition-opacity" style={{ color: "var(--muted-foreground)" }}><X size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Open Positions Modal ───────────────────────────────── */
function OpenPositionsModal({ jobs, onClose }: { jobs: JobPosting[]; onClose: () => void }) {
  useEscapeKey(onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.45)" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", maxHeight: "80vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: 16, fontWeight: 700 }}>Open Positions</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: 12, marginTop: 2 }}>{jobs.length} active posting{jobs.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
        </div>
        <div className="overflow-y-auto p-6 space-y-3" style={{ maxHeight: "calc(80vh - 80px)" }}>
          {jobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase size={36} style={{ color: "var(--border)", margin: "0 auto 12px" }} />
              <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>No open positions yet.</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: 12, marginTop: 4 }}>Click "Post a Job" to create your first listing.</p>
            </div>
          )}
          {jobs.map((job) => (
            <div key={job.id} className="p-4 rounded-2xl" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 style={{ color: "var(--foreground)", fontSize: 14, fontWeight: 700 }}>{job.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[job.department, job.location, job.type, job.experience].filter(Boolean).map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)" }}>{tag}</span>
                    ))}
                  </div>
                  {job.salary && <p style={{ color: "var(--muted-foreground)", fontSize: 11, marginTop: 6 }}>{job.salary}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p style={{ color: "var(--primary)", fontSize: 20, fontWeight: 800 }}>{job.applicants}</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: 10 }}>applicants</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: 10, marginTop: 4 }}>{job.postedAt}</p>
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
function DeleteConfirmDialog({ candidate, onConfirm, onCancel }: { candidate: Candidate; onConfirm: () => void; onCancel: () => void }) {
  useEscapeKey(onCancel);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.55)" }} onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)" }}>
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: 16, fontWeight: 700 }}>Remove Candidate?</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: 13, marginTop: 6 }}>
              <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{candidate.name}</span> will be permanently removed.
            </p>
          </div>
        </div>
        <div className="px-6 pb-6 pt-4 flex gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: "#EF4444", boxShadow: "0 4px 12px rgba(239,68,68,.3)" }}>Yes, Remove</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Candidate Detail Modal ─────────────────────────────── */
function CandidateDetailModal({ candidate, stage, nextStage, onClose, onMoveNext, interviews }: {
  candidate: Candidate; stage: Stage; nextStage: Stage | null;
  onClose: () => void; onMoveNext: (() => void) | null; interviews: ScheduledInterview[];
}) {
  useEscapeKey(onClose);
  const ivs = interviews.filter((iv) => iv.candidateId === candidate.id);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="relative px-6 pt-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl transition-colors" style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}><X size={16} /></button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--secondary)", border: "2px solid var(--border)" }}>
              <span style={{ color: "var(--primary)", fontSize: 18, fontWeight: 700 }}>{candidate.initials}</span>
            </div>
            <div>
              <h3 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 800 }}>{candidate.name}</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: 13 }}>{candidate.role}</p>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)" }}>{stage}</span>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          {[["Applied Date", candidate.date], ["Location", candidate.location || "Remote"], ["Employment Type", candidate.type || "Full-time"]].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted-foreground)", fontSize: 13 }}>{label}</span>
              <span style={{ color: "var(--foreground)", fontSize: 13, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--muted-foreground)", fontSize: 13 }}>Rating</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill={s <= candidate.rating ? "var(--primary)" : "transparent"} color={s <= candidate.rating ? "var(--primary)" : "var(--border)"} />)}
            </div>
          </div>
          {ivs.length > 0 && (
            <div className="pt-1">
              <p style={{ color: "var(--muted-foreground)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Scheduled Interviews</p>
              <div className="space-y-2">
                {ivs.map((iv) => (
                  <div key={iv.id} className="flex items-center gap-2 py-2 px-3 rounded-xl" style={{ backgroundColor: "var(--secondary)" }}>
                    <Clock size={11} style={{ color: "var(--primary)" }} />
                    <span style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>{iv.date} · {iv.time}</span>
                    <span style={{ color: "var(--muted-foreground)", fontSize: 11 }}>· {iv.type}{iv.interviewer ? ` · ${iv.interviewer}` : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-6 flex gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>Close</button>
          {onMoveNext
            ? <button onClick={() => { onMoveNext(); onClose(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(5,150,105,.35)" }}><ArrowRight size={14} />Move to {nextStage}</button>
            : <button disabled className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white opacity-40 cursor-not-allowed" style={{ background: "var(--primary)" }}>Already Hired</button>
          }
        </div>
      </div>
    </div>
  );
}

/* ─── Message Modal ──────────────────────────────────────── */
function MessageModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  useEscapeKey(onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--primary)", fontSize: 11, fontWeight: 700 }}>{candidate.initials}</span>
            </div>
            <div>
              <h3 style={{ color: "var(--foreground)", fontSize: 15, fontWeight: 700 }}>Message {candidate.name}</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: 11 }}>{candidate.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
        </div>
        <div className="px-6 py-4" style={{ minHeight: 100, backgroundColor: "var(--background)" }}>
          <p style={{ color: "var(--muted-foreground)", fontSize: 13, textAlign: "center", marginTop: 20 }}>Start the conversation with {candidate.name}</p>
        </div>
        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex gap-3 items-end">
            <textarea rows={2} className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none resize-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} placeholder={`Write a message to ${candidate.name}…`} value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button onClick={onClose} className="p-2.5 rounded-xl text-white hover:opacity-90" style={{ backgroundColor: "#10B981", boxShadow: "0 4px 12px rgba(16,185,129,.3)" }}><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Schedule Modal ─────────────────────────────────────── */
function ScheduleModal({ candidate, onClose, onSchedule }: {
  candidate: Candidate; onClose: () => void;
  onSchedule: (iv: Omit<ScheduledInterview, "id">) => void;
}) {
  const [form, setForm] = useState({ date: "", time: "", type: "Video Call", interviewer: "" });
  useEscapeKey(onClose);
  const handleConfirm = () => {
    if (!form.date || !form.time) return;
    onSchedule({ candidateId: candidate.id, candidateName: candidate.name, candidateInitials: candidate.initials, role: candidate.role, ...form });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: 16, fontWeight: 700 }}>Schedule Interview</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: 12, marginTop: 2 }}>with {candidate.name} — {candidate.role}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Date *</label>
              <input type="date" className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ border: `1px solid ${!form.date ? "#EF4444" : "var(--border)"}`, backgroundColor: "var(--background)", color: "var(--foreground)" }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Time *</label>
              <div className="relative mt-1.5">
                <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <input type="time" className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none" style={{ border: `1px solid ${!form.time ? "#EF4444" : "var(--border)"}`, backgroundColor: "var(--background)", color: "var(--foreground)" }} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Interview Type</label>
            <div className="relative mt-1.5">
              <select className="w-full rounded-xl px-3 pr-8 py-2.5 text-sm outline-none appearance-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {["Video Call", "Phone Screen", "In-Person", "Technical Test"].map((t) => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
            </div>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Interviewer</label>
            <input className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} placeholder="Enter interviewer name" value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>Cancel</button>
          <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(5,150,105,.35)" }}>
            <CheckCircle size={14} />Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Candidate Modal ────────────────────────────────── */
function AddCandidateModal({ stage, onClose, onAdd }: { stage: Stage; onClose: () => void; onAdd: (stage: Stage, c: Candidate) => void }) {
  const [form, setForm] = useState({ name: "", role: "", location: "Remote", type: "Full-time", email: "" });
  const [error, setError] = useState("");
  useEscapeKey(onClose);

  const handleAdd = () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.role.trim()) { setError("Job role is required"); return; }
    const initials = form.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    onAdd(stage, { id: `C${Date.now()}`, name: form.name.trim(), role: form.role.trim(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), avatar: null, initials, type: form.type, location: form.location, rating: 3 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: 16, fontWeight: 700 }}>Add Candidate</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: 12, marginTop: 2 }}>Adding to <span style={{ color: "#10B981", fontWeight: 600 }}>{stage}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {error && <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "rgba(239,68,68,.1)", color: "#EF4444" }}>{error}</div>}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Full Name</label>
            <div className="relative mt-1.5">
              <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} placeholder="e.g. Jordan Blake" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }} />
            </div>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Job Role</label>
            <div className="relative mt-1.5">
              <Briefcase size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} placeholder="e.g. Senior React Developer" value={form.role} onChange={(e) => { setForm({ ...form, role: e.target.value }); setError(""); }} />
            </div>
          </div>
          <div>
            <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Email Address</label>
            <input className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} placeholder="candidate@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Location</label>
              <div className="relative mt-1.5">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <select className="w-full rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                  {["Remote", "On-site", "Hybrid"].map((l) => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
            <div>
              <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Job Type</label>
              <div className="relative mt-1.5">
                <select className="w-full rounded-xl px-3 pr-8 py-2.5 text-sm outline-none appearance-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>Cancel</button>
          <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(5,150,105,.35)" }}>
            <Plus size={14} />Add Candidate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Post Job Modal ─────────────────────────────────────── */
function PostJobModal({ onClose, onPost }: { onClose: () => void; onPost: (j: Omit<JobPosting, "id" | "postedAt" | "applicants">) => void }) {
  const [form, setForm] = useState({ title: "", department: "Engineering", location: "Remote", type: "Full-time", experience: "", salary: "", description: "" });
  useEscapeKey(onClose);
  const handlePost = () => { if (!form.title.trim()) return; onPost(form); onClose(); };

  const field = (label: string, key: keyof typeof form, placeholder: string, icon?: React.ReactNode) => (
    <div>
      <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>{label}</label>
      <div className="relative mt-1.5">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}>{icon}</span>}
        <input className={`w-full rounded-xl ${icon ? "pl-9" : "px-3"} pr-3 py-2.5 text-sm outline-none`} style={{ border: `1px solid ${key === "title" && !form.title ? "#EF4444" : "var(--border)"}`, backgroundColor: "var(--background)", color: "var(--foreground)" }} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: 16, fontWeight: 700 }}>Post a New Job</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: 12, marginTop: 2 }}>Create a new job opening for recruitment</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {field("Job Title *", "title", "e.g. Senior React Developer", <Briefcase size={13} />)}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["department", "location"] as const).map((k) => (
              <div key={k}>
                <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
                <div className="relative mt-1.5">
                  {k === "department" ? <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} /> : <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />}
                  <select className="w-full rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}>
                    {k === "department" ? ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"].map((d) => <option key={d}>{d}</option>) : ["Remote", "On-site", "Hybrid"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Job Type</label>
              <select className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none appearance-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            {field("Experience", "experience", "e.g. 3-5 years")}
          </div>
          {field("Salary Range", "salary", "e.g. ₹80,000 – ₹1,20,000", <DollarSign size={13} />)}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: 12, fontWeight: 600 }}>Job Description</label>
            <textarea rows={3} className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none resize-none" style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} placeholder="Brief description of the role and responsibilities…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>Cancel</button>
          <button onClick={handlePost} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(5,150,105,.35)" }}>Post Job</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Editable Star Rating ───────────────────────────────── */
function StarRating({ value, onChange, size = 12 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size}
          style={{ cursor: onChange ? "pointer" : "default", transition: "transform .1s", transform: hovered === s ? "scale(1.25)" : "scale(1)" }}
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
function CandidateCard({ candidate, onMessage, onSchedule, onDetail, onDelete, onMoveNext, onRatingChange, nextStage, onDragStart, interviewCount }: {
  candidate: Candidate; stage: Stage; nextStage: Stage | null; interviewCount: number;
  onMessage: () => void; onSchedule: () => void; onDetail: () => void;
  onDelete: () => void; onMoveNext: () => void; onRatingChange: (v: number) => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-[24px] p-5 cursor-grab active:cursor-grabbing transition-all"
      style={{ backgroundColor: hovered ? "var(--secondary)" : "var(--card)", border: hovered ? "1.5px solid var(--primary)" : "1.5px solid var(--border)", boxShadow: hovered ? "0 6px 24px rgba(16,185,129,.18)" : "0 1px 4px rgba(0,0,0,.04)", transform: hovered ? "translateY(-2px)" : "translateY(0)" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
          <span style={{ color: "var(--primary)", fontSize: 12, fontWeight: 700 }}>{candidate.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 style={{ color: "var(--foreground)", fontSize: 14, fontWeight: 700 }} className="truncate">{candidate.name}</h4>
          <p style={{ color: "var(--muted-foreground)", fontSize: 12 }} className="truncate">{candidate.role}</p>
        </div>
        {interviewCount > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0" style={{ backgroundColor: "rgba(59,130,246,.12)", color: "#3B82F6", border: "1px solid rgba(59,130,246,.25)" }}>
            <Clock size={9} />{interviewCount}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {[candidate.date.split(",")[0], candidate.location || "Remote", candidate.type || "Full-time"].map((tag, i) => (
          <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: "var(--secondary)", color: i === 0 ? "var(--primary)" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2">
        <StarRating value={candidate.rating} onChange={onRatingChange} size={13} />
        <div className="flex items-center gap-3" style={{ color: "var(--muted-foreground)" }}>
          {[
            { icon: <MessageSquare size={14} />, action: onMessage, hoverColor: "var(--primary)" },
            { icon: <Calendar size={14} />, action: onSchedule, hoverColor: "var(--primary)" },
            { icon: <Trash2 size={14} />, action: onDelete, hoverColor: "#EF4444" },
          ].map(({ icon, action, hoverColor }, i) => (
            <span key={i} style={{ cursor: "pointer", display: "flex" }}
              onClick={(e) => { e.stopPropagation(); action(); }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = hoverColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"; }}
            >{icon}</span>
          ))}
          <ChevronRight size={16} style={{ color: "var(--primary)", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onDetail(); }} />
        </div>
      </div>
      {nextStage && (
        <button onClick={(e) => { e.stopPropagation(); onMoveNext(); }} className="w-full mt-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-80" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)" }}>
          <ArrowRight size={12} />Move to {nextStage}
        </button>
      )}
    </div>
  );
}

/* ─── Empty Column State ─────────────────────────────────── */
function EmptyColumnState({ stage }: { stage: Stage }) {
  const emojis: Record<Stage, string> = { Applied: "📥", Screening: "🔍", Interview: "🎤", "Offer Sent": "📄", Hired: "🎉" };
  return (
    <div className="rounded-[24px] py-8 px-4 flex flex-col items-center justify-center gap-2 text-center" style={{ border: "1.5px dashed var(--border)", backgroundColor: "var(--background)" }}>
      <span style={{ fontSize: 28, lineHeight: 1 }}>{emojis[stage]}</span>
      <p style={{ color: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 }}>No candidates in {stage}</p>
      <p style={{ color: "var(--muted-foreground)", fontSize: 11 }}>Add one or drag a card here</p>
    </div>
  );
}

/* ─── Drop Zone ──────────────────────────────────────────── */
function DropZone({ stage, onDrop, onDragDrop }: { stage: Stage; onDrop: () => void; onDragDrop: () => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const active = isDragOver || isHovered;
  return (
    <div
      onClick={onDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); onDragDrop(); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderRadius: 24, border: `2px dashed ${active ? "var(--primary)" : "var(--border)"}`, backgroundColor: active ? "var(--secondary)" : "var(--card)", padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "all .2s ease-out", boxShadow: active ? "0 0 0 4px rgba(16,185,129,.12)" : "none", transform: active ? "scale(1.01)" : "scale(1)" }}
    >
      <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: active ? "var(--primary)" : "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s ease-out", boxShadow: active ? "0 4px 12px rgba(16,185,129,.35)" : "none" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "var(--primary)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: active ? "var(--foreground)" : "var(--muted-foreground)", fontSize: 12, fontWeight: 700, margin: 0 }}>{isDragOver ? "Release to drop" : "+ Drop candidate here"}</p>
        <p style={{ color: active ? "var(--primary)" : "var(--muted-foreground)", fontSize: 11, marginTop: 2 }}>{isDragOver ? `Moving to ${stage}` : "or click to add manually"}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export function Recruitment() {
  const { recruitmentPipeline: contextPipeline, addCandidate, deleteCandidate, moveCandidate } = useRecruitment();
  const { toasts, toast, dismiss } = useToast();

  const pipeline = STAGES.reduce((acc, stage) => {
    const ctx = contextPipeline[stage] || [];
    const mock = (recruitmentPipeline as Record<Stage, Candidate[]>)[stage] || [];
    acc[stage] = ctx.length > 0 ? (ctx as unknown as Candidate[]) : mock;
    return acc;
  }, {} as Record<Stage, Candidate[]>);

  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  const displayPipeline = STAGES.reduce((acc, stage) => {
    acc[stage] = pipeline[stage].filter((c: Candidate) => !deletedIds.has(c.id)).map((c: Candidate) => ({ ...c, rating: ratings[c.id] ?? c.rating }));
    return acc;
  }, {} as Record<Stage, Candidate[]>);

  // Search & filter
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredPipeline = STAGES.reduce((acc, stage) => {
    acc[stage] = displayPipeline[stage].filter((c: Candidate) => {
      const q = query.toLowerCase();
      return (!q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q))
        && (locationFilter === "All" || c.location === locationFilter)
        && (typeFilter === "All" || c.type === typeFilter);
    });
    return acc;
  }, {} as Record<Stage, Candidate[]>);

  const totalFiltered = STAGES.reduce((s, st) => s + filteredPipeline[st].length, 0);
  const isFiltering = !!query || locationFilter !== "All" || typeFilter !== "All";

  // Modal state
  const [showPostJob, setShowPostJob] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [addStage, setAddStage] = useState<Stage | null>(null);
  const [detailCandidate, setDetailCandidate] = useState<{ candidate: Candidate; stage: Stage } | null>(null);
  const [messageCandidate, setMessageCandidate] = useState<Candidate | null>(null);
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ candidateId: string; stage: Stage; candidate: Candidate } | null>(null);
  const dragRef = useRef<{ candidateId: string; fromStage: Stage } | null>(null);

  const handleAddCandidate = (stage: Stage, candidate: Candidate) => {
    addCandidate(stage, candidate as unknown as ContextCandidate);
    toast(`${candidate.name} added to ${stage}`, "success");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { candidateId, stage, candidate } = deleteTarget;
    const isCtx = (contextPipeline[stage] || []).some((c: Candidate) => c.id === candidateId);
    if (isCtx) deleteCandidate(candidateId, stage);
    else setDeletedIds((prev) => new Set([...prev, candidateId]));
    toast(`${candidate.name} removed`, "error");
    setDeleteTarget(null);
  };

  const handleMoveCandidate = (candidateId: string, fromStage: Stage, toStage: Stage) => {
    const candidate = displayPipeline[fromStage].find((c: Candidate) => c.id === candidateId);
    const isCtx = (contextPipeline[fromStage] || []).some((c: Candidate) => c.id === candidateId);
    if (isCtx) moveCandidate(candidateId, fromStage, toStage);
    else if (candidate) {
      setDeletedIds((prev) => new Set([...prev, candidateId]));
      addCandidate(toStage, candidate as unknown as ContextCandidate);
    }
    if (candidate) toast(`${candidate.name} moved to ${toStage}`, "success");
  };

  const handleSchedule = (iv: Omit<ScheduledInterview, "id">) => {
    setInterviews((prev) => [...prev, { ...iv, id: `IV${Date.now()}` }]);
    toast(`Interview scheduled with ${iv.candidateName} on ${iv.date}`, "info");
  };

  const handlePostJob = (job: Omit<JobPosting, "id" | "postedAt" | "applicants">) => {
    setJobs((prev) => [...prev, { ...job, id: `J${Date.now()}`, postedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), applicants: 0 }]);
    toast(`"${job.title}" posted successfully`, "success");
  };

  const handleRatingChange = (candidateId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [candidateId]: value }));
    toast("Rating updated", "info");
  };

  const totalCandidates = STAGES.reduce((s, st) => s + displayPipeline[st].length, 0);

  return (
    <div className="pb-10">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* All modals */}
      {showPostJob && <PostJobModal onClose={() => setShowPostJob(false)} onPost={handlePostJob} />}
      {showJobs && <OpenPositionsModal jobs={jobs} onClose={() => setShowJobs(false)} />}
      {addStage && <AddCandidateModal stage={addStage} onClose={() => setAddStage(null)} onAdd={handleAddCandidate} />}
      {detailCandidate && (() => {
        const si = STAGES.indexOf(detailCandidate.stage);
        const nextStage = si < STAGES.length - 1 ? STAGES[si + 1] : null;
        return (
          <CandidateDetailModal
            candidate={detailCandidate.candidate} stage={detailCandidate.stage}
            nextStage={nextStage} interviews={interviews}
            onClose={() => setDetailCandidate(null)}
            onMoveNext={nextStage ? () => handleMoveCandidate(detailCandidate.candidate.id, detailCandidate.stage, nextStage) : null}
          />
        );
      })()}
      {messageCandidate && <MessageModal candidate={messageCandidate} onClose={() => setMessageCandidate(null)} />}
      {scheduleCandidate && <ScheduleModal candidate={scheduleCandidate} onClose={() => setScheduleCandidate(null)} onSchedule={handleSchedule} />}
      {deleteTarget && <DeleteConfirmDialog candidate={deleteTarget.candidate} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {STAGES.map((stage) => {
            const count = displayPipeline[stage].length;
            const overloaded = count >= OVERLOAD;
            return (
              <div key={stage} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border" style={{ backgroundColor: "var(--card)", borderColor: overloaded ? "rgba(245,158,11,.4)" : "var(--border)" }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: overloaded ? "#F59E0B" : "var(--primary)" }} />
                <span style={{ color: overloaded ? "#F59E0B" : "var(--foreground)", fontSize: 13, fontWeight: 700 }}>{count}{overloaded ? " ⚠" : ""}</span>
                <span style={{ color: "var(--muted-foreground)", fontSize: 13 }}>{stage}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setShowJobs(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all hover:opacity-80" style={{ backgroundColor: "var(--card)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}>
            <Briefcase size={14} />Positions
            {jobs.length > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>{jobs.length}</span>}
          </button>
          <button onClick={() => setShowPostJob(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold hover:opacity-90 text-sm" style={{ background: "#10B981", boxShadow: "0 8px 20px rgba(16,185,129,.25)" }}>
            <Plus size={15} />Post a Job
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="rounded-[28px] p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center shadow-sm border gap-0" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="pb-5 sm:pb-0 sm:pr-10 mb-5 sm:mb-0 border-b sm:border-b-0 sm:border-r text-center sm:text-left" style={{ borderColor: "var(--border)" }}>
          <p style={{ color: "var(--muted-foreground)" }} className="text-[13px] font-medium mb-1">Total Candidates</p>
          <p style={{ color: "var(--foreground)" }} className="text-3xl font-black">{totalCandidates}</p>
        </div>
        <div className="flex-1 sm:px-10">
          <div className="flex gap-1.5 mb-2.5">
            {STAGES.map((stage) => {
              const w = totalCandidates > 0 ? (displayPipeline[stage].length / totalCandidates) * 100 : 0;
              return <div key={stage} className="h-2 rounded-full transition-all" style={{ width: `${w}%`, backgroundColor: "var(--primary)" }} />;
            })}
          </div>
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            {STAGES.map((stage) => {
              const overloaded = displayPipeline[stage].length >= OVERLOAD;
              return (
                <div key={stage} className="flex items-center gap-1.5">
                  {overloaded ? <AlertCircle size={10} style={{ color: "#F59E0B" }} /> : <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--primary)" }} />}
                  <span style={{ color: overloaded ? "#F59E0B" : "var(--muted-foreground)" }} className="text-[11px] sm:text-[12px]">{stage} ({displayPipeline[stage].length})</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pt-5 sm:pt-0 sm:pl-10 mt-5 sm:mt-0 border-t sm:border-t-0 sm:border-l text-center sm:text-right" style={{ borderColor: "var(--border)" }}>
          <p style={{ color: "var(--muted-foreground)" }} className="text-[13px] font-medium mb-1">Hired This Month</p>
          <p style={{ color: "var(--primary)" }} className="text-3xl font-black">{displayPipeline["Hired"].length}</p>
        </div>
      </div>

      {/* Upcoming interviews */}
      <UpcomingInterviewsPanel interviews={interviews} onDismiss={(id) => setInterviews((prev) => prev.filter((iv) => iv.id !== id))} />

      {/* Search & filter */}
      <SearchFilterBar query={query} onQueryChange={setQuery} locationFilter={locationFilter} onLocationChange={setLocationFilter} typeFilter={typeFilter} onTypeChange={setTypeFilter} resultCount={totalFiltered} />

      {/* Kanban */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 custom-scrollbar">
        {STAGES.map((stage) => {
          const rawCount = displayPipeline[stage].length;
          const overloaded = rawCount >= OVERLOAD;
          const candidates = filteredPipeline[stage];

          return (
            <div key={stage} className="flex-shrink-0" style={{ width: "min(300px, 80vw)" }}>
              {/* Column header */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2">
                  <h3 style={{ color: "var(--foreground)", fontSize: 16, fontWeight: 800 }}>{stage}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold flex items-center gap-1"
                    style={{ backgroundColor: overloaded ? "rgba(245,158,11,.12)" : "var(--secondary)", color: overloaded ? "#F59E0B" : "var(--primary)", border: overloaded ? "1px solid rgba(245,158,11,.3)" : "none" }}>
                    {overloaded && <AlertCircle size={9} />}{rawCount}
                  </span>
                </div>
                <button onClick={() => setAddStage(stage)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:opacity-80" style={{ color: "var(--primary)", fontSize: 12, fontWeight: 700, backgroundColor: "var(--secondary)" }}>
                  <Plus size={13} />Add
                </button>
              </div>

              {/* Overload banner */}
              {overloaded && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3 text-xs font-semibold" style={{ backgroundColor: "rgba(245,158,11,.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,.2)" }}>
                  <AlertCircle size={11} />Stage overloaded ({rawCount} candidates)
                </div>
              )}

              <div className="space-y-4">
                {candidates.length === 0 && !isFiltering && <EmptyColumnState stage={stage} />}
                {candidates.length === 0 && isFiltering && (
                  <div className="rounded-[20px] py-6 px-4 text-center" style={{ border: "1.5px dashed var(--border)" }}>
                    <p style={{ color: "var(--muted-foreground)", fontSize: 12 }}>No matches in {stage}</p>
                  </div>
                )}
                {candidates.map((candidate) => {
                  const si = STAGES.indexOf(stage);
                  const nextStage = si < STAGES.length - 1 ? STAGES[si + 1] : null;
                  const ivCount = interviews.filter((iv) => iv.candidateId === candidate.id).length;
                  return (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate} stage={stage} nextStage={nextStage} interviewCount={ivCount}
                      onMessage={() => setMessageCandidate(candidate)}
                      onSchedule={() => setScheduleCandidate(candidate)}
                      onDetail={() => setDetailCandidate({ candidate, stage })}
                      onDelete={() => setDeleteTarget({ candidateId: candidate.id, stage, candidate })}
                      onMoveNext={() => nextStage && handleMoveCandidate(candidate.id, stage, nextStage)}
                      onRatingChange={(v) => handleRatingChange(candidate.id, v)}
                      onDragStart={(e) => { dragRef.current = { candidateId: candidate.id, fromStage: stage }; e.dataTransfer.effectAllowed = "move"; }}
                    />
                  );
                })}
                <DropZone stage={stage} onDrop={() => setAddStage(stage)}
                  onDragDrop={() => {
                    const drag = dragRef.current;
                    if (!drag || drag.fromStage === stage) return;
                    handleMoveCandidate(drag.candidateId, drag.fromStage, stage);
                    dragRef.current = null;
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}