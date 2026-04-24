import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, MessageSquare, Calendar, ChevronRight, Star, X, Briefcase,
  MapPin, IndianRupee, ChevronDown, Users, Send, Clock, CheckCircle,
  Trash2, AlertTriangle, Search, Filter,
  Bell, CheckCircle2, AlertCircle, Info, XCircle,
} from "lucide-react";
import { recruitmentPipeline } from "../data/mockData";
import { useRecruitment } from "../context/AppContext";
import type { Candidate as ContextCandidate } from "../context/AppContext";

/* ─── Types ──────────────────────────────────────────────── */
type Stage = "Applied" | "Screening" | "Round 1" | "Round 2" | "Offer" | "Hired";
type Source = "LinkedIn" | "Indeed" | "Referral";
type ToastKind = "success" | "error" | "info" | "warning";

const STAGES: Stage[] = ["Applied", "Screening", "Round 1", "Round 2", "Offer", "Hired"];

interface Candidate {
  id: string; name: string; role: string; date: string;
  avatar: string | null; initials: string; type: string;
  location: string; rating: number; source: Source;
  interviewerAvatars: string[]; interviewDate?: string;
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
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
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
  resultCount 
}: SearchFilterBarProps) {
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
          style={{ 
            backgroundColor: open || hasFilter ? "var(--primary)" : "var(--card)", 
            color: open || hasFilter ? "white" : "var(--foreground)", 
            border: "1.5px solid var(--border)" 
          }}
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
        <div className="overflow-y-auto p-12 space-y-3" style={{ maxHeight: "calc(80vh - 80px)" }}>
          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                <Briefcase size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No open positions yet.</h3>
              <p className="text-slate-500 font-medium">Click "Post a Job" to create your first listing.</p>
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
    onAdd(stage, { 
      id: `C${Date.now()}`, 
      name: form.name.trim(), 
      role: form.role.trim(), 
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), 
      avatar: null, 
      initials, 
      type: form.type, 
      location: form.location, 
      rating: 3,
      source: "LinkedIn",
      interviewerAvatars: []
    });
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
          {field("Salary Range", "salary", "e.g. ₹80,000 – ₹1,20,000", <IndianRupee size={13} />)}
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
function CandidateCard({ candidate, onSchedule, onDetail, onDelete, onMoveNext, nextStage, onDragStart }: {
  candidate: Candidate; nextStage: Stage | null;
  onSchedule: () => void; onDetail: () => void;
  onDelete: () => void; onMoveNext: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const sourceStyles: Record<Source, { bg: string; text: string }> = {
    LinkedIn: { bg: "#DCFCE7", text: "#00B87C" },
    Indeed: { bg: "#E0F2FE", text: "#0EA5E9" },
    Referral: { bg: "#EDE9FE", text: "#8B5CF6" },
  };

  const currentSource = sourceStyles[candidate.source || "LinkedIn"];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl shadow-sm p-4 cursor-grab active:cursor-grabbing transition-all border"
      style={{ 
        backgroundColor: "var(--card)",
        boxShadow: hovered ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        borderColor: hovered ? "var(--primary)" : "var(--border)"
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="truncate text-[14px] font-bold" style={{ color: "var(--foreground)" }}>{candidate.name}</h4>
        <span 
          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: currentSource.bg, color: currentSource.text }}
        >
          {candidate.source || "LinkedIn"}
        </span>
      </div>
      
      <p className="mb-3 truncate text-[13px]" style={{ color: "var(--muted-foreground)" }}>{candidate.role}</p>

      <div className="flex items-center gap-1.5 mb-3">
        <Calendar size={12} style={{ color: "var(--muted-foreground)" }} />
        <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>Applied 2 days ago</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <StarRating value={candidate.rating} size={12} />
          <span className="text-[12px] font-bold text-amber-500 ml-1">{candidate.rating.toFixed(1)}</span>
        </div>
        
        <div className="flex -space-x-2">
          {(candidate.interviewerAvatars || []).slice(0, 3).map((av, i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 bg-slate-100 overflow-hidden" style={{ borderColor: "var(--card)" }}>
              <img src={av} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {(candidate.interviewerAvatars || []).length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{ borderColor: "var(--card)", backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
              +{(candidate.interviewerAvatars || []).length - 3}
            </div>
          )}
        </div>
      </div>

      {candidate.interviewDate && (
        <div className="mb-4">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 w-fit" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
            <Clock size={12} />
            {candidate.interviewDate}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex gap-3">
          <button onClick={onDetail} className="text-[13px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--muted-foreground)" }}>View</button>
          <button onClick={onSchedule} className="text-[13px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--primary)" }}>Schedule</button>
        </div>
        <div className="flex items-center gap-2">
          {nextStage && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMoveNext(); }} 
              className="text-[13px] font-bold flex items-center gap-1 transition-all hover:opacity-80" 
              style={{ color: "#00B87C" }}
            >
              Move →
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
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
function CandidateDetailSidePanel({ candidate, stage, onClose }: { candidate: Candidate; stage: Stage; onClose: () => void }) {
  const steps: Stage[] = ["Applied", "Screening", "Round 1", "Round 2", "Offer", "Hired"];
  const currentIdx = steps.indexOf(stage);

  return (
    <>
      <div className="fixed inset-0 z-[100]" style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[400px] z-[101] shadow-2xl flex flex-col transform transition-transform duration-300" style={{ backgroundColor: "var(--card)", borderLeft: "1px solid var(--border)" }}>
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Candidate Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border-4" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--secondary)" }}>
              {candidate.avatar ? (
                <img src={candidate.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black" style={{ color: "var(--primary)" }}>
                  {candidate.initials}
                </div>
              )}
            </div>
            <h3 className="text-xl font-black mb-1" style={{ color: "var(--foreground)" }}>{candidate.name}</h3>
            <p className="text-sm font-bold mb-3" style={{ color: "var(--muted-foreground)" }}>{candidate.role}</p>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
              {candidate.source || "LinkedIn"}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
                    <Send size={14} />
                  </div>
                  {candidate.name.toLowerCase().replace(" ", ".")}@example.com
                </div>
                <div className="flex items-center gap-3 text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
                    <MessageSquare size={14} />
                  </div>
                  +1 (555) 000-0000
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Hiring Progress</h4>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5" style={{ backgroundColor: "var(--border)" }} />
                {steps.map((step, i) => (
                  <div key={step} className="relative flex items-center gap-4">
                    <div className={`absolute -left-[23px] w-4 h-4 rounded-full border-2 shadow-sm z-10 ${
                      i <= currentIdx ? "bg-emerald-500" : ""
                    }`} style={{ borderColor: "var(--card)", backgroundColor: i <= currentIdx ? "var(--primary)" : "var(--border)" }} />
                    <span className="text-sm font-bold" style={{ color: i <= currentIdx ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Interview Feedback</h4>
              <div className="rounded-2xl p-4" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Overall Rating</span>
                  <StarRating value={candidate.rating} size={16} />
                </div>
                <p className="text-xs font-medium italic" style={{ color: "var(--muted-foreground)" }}>"Strong technical skills, excellent communication, and clear cultural fit."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t space-y-3" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Current Stage</span>
            <button className="text-sm font-black flex items-center gap-1" style={{ color: "var(--primary)" }}>
              Move to Stage <ChevronDown size={14} />
            </button>
          </div>
          <button className="w-full py-4 rounded-2xl text-white font-black shadow-xl hover:opacity-90 transition-all uppercase tracking-wider text-xs" style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>
            Send Offer
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Candidates View ────────────────────────────────────── */
function CandidatesView({ candidates, onDetail, onSchedule, onMessage }: { 
  candidates: Candidate[]; 
  onDetail: (c: Candidate) => void;
  onSchedule: (c: Candidate) => void;
  onMessage: (c: Candidate) => void;
}) {
  return (
    <div className="rounded-3xl shadow-sm border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--border)" }}>
            {["Candidate", "Role", "Applied Date", "Location", "Source", "Rating", ""].map((h) => (
              <th key={h} className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
          {candidates.map((c) => (
            <tr key={c.id} className="transition-all cursor-pointer group hover:opacity-80" style={{ backgroundColor: "var(--card)" }} onClick={() => onDetail(c)}>
              <td className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", borderColor: "var(--border)" }}>
                    {c.avatar ? <img src={c.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : c.initials}
                  </div>
                  <div>
                    <p className="text-sm font-black" style={{ color: "var(--foreground)" }}>{c.name}</p>
                    <p className="text-[11px] font-bold uppercase tracking-tight" style={{ color: "var(--muted-foreground)" }}>{c.type}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-4 text-sm font-bold" style={{ color: "var(--foreground)" }}>{c.role}</td>
              <td className="px-8 py-4 text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>{c.date}</td>
              <td className="px-8 py-4 text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>{c.location}</td>
              <td className="px-8 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  c.source === "LinkedIn" ? "bg-blue-50 text-blue-600" : 
                  c.source === "Indeed" ? "bg-indigo-50 text-indigo-600" : "bg-purple-50 text-purple-600"
                }`}>
                  {c.source}
                </span>
              </td>
              <td className="px-8 py-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} fill={s <= c.rating ? "#F59E0B" : "transparent"} color={s <= c.rating ? "#F59E0B" : "var(--border)"} />)}
                </div>
              </td>
              <td className="px-8 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onMessage(c); }} className="p-2 rounded-lg transition-all" style={{ color: "var(--muted-foreground)" }}><MessageSquare size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onSchedule(c); }} className="p-2 rounded-lg transition-all" style={{ color: "var(--muted-foreground)" }}><Calendar size={16} /></button>
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
function InterviewsView({ interviews, onDismiss }: { interviews: ScheduledInterview[]; onDismiss: (id: string) => void }) {
  if (interviews.length === 0) {
    return (
      <div className="rounded-3xl p-20 flex flex-col items-center justify-center border shadow-sm" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
          <Calendar size={40} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>No Scheduled Interviews</h3>
        <p className="max-w-sm text-center font-medium" style={{ color: "var(--muted-foreground)" }}>When you schedule interviews with candidates, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest px-1" style={{ color: "var(--muted-foreground)" }}>Upcoming Interviews</h3>
        {interviews.map((iv) => (
          <div key={iv.id} className="p-6 rounded-[24px] shadow-sm border group transition-all" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
                  {iv.candidateInitials}
                </div>
                <div>
                  <h4 className="text-sm font-black" style={{ color: "var(--foreground)" }}>{iv.candidateName}</h4>
                  <p className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>{iv.role}</p>
                </div>
              </div>
              <button onClick={() => onDismiss(iv.id)} className="p-2 rounded-xl transition-all" style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-4 items-center pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                <Calendar size={14} className="text-emerald-500" />
                {iv.date}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                <Clock size={14} className="text-emerald-500" />
                {iv.time}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                <MapPin size={14} className="text-emerald-500" />
                {iv.type}
              </div>
            </div>
            <button className="w-full mt-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all" style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}>
              Join Interview Call
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border p-8" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="text-sm font-black mb-6" style={{ color: "var(--foreground)" }}>Calendar Preview</h3>
        <div className="grid grid-cols-7 gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => <div key={d} className="h-8 flex items-center justify-center text-[10px] font-black text-slate-400">{d}</div>)}
          {Array.from({ length: 31 }).map((_, i) => (
            <div key={i} className={`h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
              i + 1 === 24 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : ""
            }`} style={{ color: i + 1 === 24 ? "white" : "var(--foreground)" }}>
              {i + 1}
              {i + 1 === 24 && <div className="absolute w-1 h-1 bg-white rounded-full mt-5" />}
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Today's Schedule</h4>
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--border)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "var(--primary)" }}>10:30 AM - 11:30 AM</p>
            <p className="text-sm font-black" style={{ color: "var(--foreground)" }}>Technical Interview: Sarah Wilson</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics View ─────────────────────────────────────── */
function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl border shadow-sm col-span-2" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black" style={{ color: "var(--foreground)" }}>Hiring Funnel</h3>
              <p className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>Candidate conversion rates per stage</p>
            </div>
            <select className="px-4 py-2 rounded-xl border-none text-xs font-black outline-none" style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}>
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="space-y-6">
            {[
              { stage: "Applied", count: 284, color: "#10B981" },
              { stage: "Screening", count: 142, color: "#14B8A6" },
              { stage: "Interview", count: 68, color: "#0EA5E9" },
              { stage: "Offer", count: 12, color: "#8B5CF6" },
              { stage: "Hired", count: 8, color: "#D946EF" },
            ].map((f, i, arr) => (
              <div key={f.stage} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black" style={{ color: "var(--foreground)" }}>{f.stage}</span>
                  <span className="text-xs font-black" style={{ color: "var(--foreground)" }}>{f.count} candidates</span>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden relative">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ 
                    width: `${(f.count / arr[0].count) * 100}%`,
                    backgroundColor: f.color,
                    boxShadow: `0 4px 12px ${f.color}33`
                  }} />
                  {i > 0 && (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3 text-[10px] font-black text-slate-400">
                      {Math.round((f.count / arr[i-1].count) * 100)}% conversion
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl border shadow-sm" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <h3 className="text-lg font-black mb-8" style={{ color: "var(--foreground)" }}>Source Distribution</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 mb-8">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#F1F5F9" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#10B981" strokeWidth="3.5" strokeDasharray="60 100" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#0EA5E9" strokeWidth="3.5" strokeDasharray="25 100" strokeDashoffset="-60" strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#8B5CF6" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-85" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black" style={{ color: "var(--foreground)" }}>284</span>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Total</span>
              </div>
            </div>
            <div className="w-full space-y-4">
              {[
                { label: "LinkedIn", val: "60%", color: "#10B981" },
                { label: "Indeed", val: "25%", color: "#0EA5E9" },
                { label: "Referral", val: "15%", color: "#8B5CF6" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: "var(--foreground)" }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl border shadow-sm" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <h3 className="text-sm font-black mb-6 uppercase tracking-widest" style={{ color: "var(--foreground)" }}>Time to Hire (Avg)</h3>
          <div className="flex items-end gap-3 h-32">
            {[18, 24, 21, 19, 15, 22, 18].map((v, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{v} days</div>
                <div className="w-full rounded-t-lg transition-all" style={{ height: `${(v / 24) * 100}%`, backgroundColor: "var(--secondary)" }} />
                <div className="text-[10px] font-black text-center mt-2" style={{ color: "var(--muted-foreground)" }}>{["M", "T", "W", "T", "F", "S", "S"][i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 rounded-3xl border shadow-sm flex items-center justify-between" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div>
            <h3 className="text-sm font-black mb-2 uppercase tracking-widest" style={{ color: "var(--foreground)" }}>Offer Acceptance</h3>
            <p className="text-3xl font-black text-emerald-600">86.4%</p>
            <p className="text-xs font-bold mt-2" style={{ color: "var(--muted-foreground)" }}>↑ 4.2% from last month</p>
          </div>
          <div className="w-24 h-24 text-emerald-100">
            <CheckCircle2 size={96} strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Jobs View ──────────────────────────────────────────── */
function JobsView({ onPostJob, onSelectJob }: { onPostJob: () => void, onSelectJob: (j: JobPosting) => void }) {
  const sampleJobs: JobPosting[] = [
    { id: "J1", title: "Senior React Developer", department: "Engineering", location: "Remote", postedAt: "2 days ago", applicants: 24, type: "Full-time", experience: "3-5 years", salary: "₹120k - ₹160k", description: "Senior Role" },
    { id: "J2", title: "Product Designer", department: "Design", location: "San Francisco", postedAt: "1 week ago", applicants: 42, type: "Full-time", experience: "2-4 years", salary: "₹120k - ₹160k", description: "Design Role" },
    { id: "J3", title: "Marketing Manager", department: "Marketing", location: "New York", postedAt: "3 days ago", applicants: 15, type: "Full-time", experience: "5+ years", salary: "₹120k - ₹160k", description: "Marketing Role" },
    { id: "J4", title: "Sales Executive", department: "Sales", location: "Chicago", postedAt: "5 days ago", applicants: 8, type: "Full-time", experience: "1-3 years", salary: "₹120k - ₹160k", description: "Sales Role" },
    { id: "J5", title: "HR Generalist", department: "HR", location: "Remote", postedAt: "2 weeks ago", applicants: 56, type: "Full-time", experience: "2-3 years", salary: "₹120k - ₹160k", description: "HR Role" },
  ];

  const statusStyles: Record<string, string> = {
    Open: "bg-emerald-100 text-emerald-600 border-emerald-200",
    Paused: "bg-amber-100 text-amber-600 border-amber-200",
    Closed: "bg-slate-100 text-slate-600 border-slate-200",
    Draft: "bg-white text-slate-400 border-slate-200 border-dashed border-2",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Listings ({sampleJobs.length})</h3>
        <button onClick={onPostJob} className="text-xs font-black text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">Create New <Plus size={14} /></button>
      </div>
    <div className="rounded-3xl shadow-sm border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ backgroundColor: "var(--secondary)", borderColor: "var(--border)" }}>
              {["Job Title", "Department", "Location", "Posted", "Applicants", "Status", ""].map((h) => (
                <th key={h} className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {sampleJobs.map((j) => (
              <tr key={j.id} className="transition-all cursor-pointer group hover:opacity-80" style={{ backgroundColor: "var(--card)" }} onClick={() => onSelectJob(j)}>
                <td className="px-8 py-5">
                  <p className="text-sm font-black" style={{ color: "var(--foreground)" }}>{j.title}</p>
                  <p className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>Full-time • ₹120k - ₹160k</p>
                </td>
                <td className="px-8 py-5 text-sm font-bold" style={{ color: "var(--foreground)" }}>{j.department}</td>
                <td className="px-8 py-5 text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} style={{ color: "var(--muted-foreground)" }} />
                    {j.location}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>{j.postedAt}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black" style={{ color: "var(--foreground)" }}>{j.applicants}</span>
                    <div className="flex-1 w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--secondary)" }}>
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (j.applicants / 50) * 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${j.applicants > 40 ? statusStyles.Closed : statusStyles.Open}`}>
                    {j.applicants > 40 ? "Closed" : "Open"}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <ChevronRight size={18} className="transition-all group-hover:translate-x-1" style={{ color: "var(--muted-foreground)" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Empty Column State ─────────────────────────────────── */
function EmptyColumnState({ stage }: { stage: Stage }) {
  const emojis: Record<Stage, string> = { Applied: "📥", Screening: "🔍", "Round 1": "🎤", "Round 2": "💬", Offer: "📄", Hired: "🎉" };
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

/* ─── Page Header ────────────────────────────────────────── */
function PageHeader({ onPostJob, onShowJobs }: { onPostJob: () => void; onShowJobs: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <Briefcase size={24} />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-black" style={{ color: "var(--foreground)" }}>Recruitment</h1>
          <span className="px-3 py-1 rounded-full text-xs font-black" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>
            12 Active Jobs
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onShowJobs}
          className="px-6 py-2.5 rounded-full font-bold text-sm border hover:opacity-80 transition-all flex items-center gap-2"
          style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }}
        >
          <Briefcase size={18} />
          Positions
        </button>
        <button 
          onClick={onPostJob}
          className="px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2 text-white"
          style={{ backgroundColor: "var(--primary)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
        >
          <Plus size={18} />
          Post a Job
        </button>
      </div>
    </div>
  );
}

/* ─── Info Bar ───────────────────────────────────────────── */
function InfoBar() {
  const stats = [
    { label: "84 new applications this week", color: "#10B981" },
    { label: "6 interviews scheduled today", color: "#F59E0B" },
    { label: "3 offers pending response", color: "#8B5CF6" },
  ];

  return (
    <div className="flex items-center gap-6 mb-8 px-1">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
          <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── KPI Cards ──────────────────────────────────────────── */
function KpiCards() {
  const cards = [
    { label: "Open Positions", value: 12, color: "emerald", icon: <Briefcase size={20} /> },
    { label: "Applications", value: 84, color: "teal", icon: <Users size={20} /> },
    { label: "Interviews Today", value: 6, color: "amber", icon: <Calendar size={20} /> },
    { label: "Offers Sent", value: 8, color: "purple", icon: <Send size={20} /> },
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
        <div key={i} className="p-6 rounded-2xl shadow-sm border flex items-center gap-4 transition-all" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: colorMap[c.color] }}>
            {c.icon}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>{c.label}</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black" style={{ color: "var(--foreground)" }}>{c.value}</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black" style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}>+12%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Tabs ───────────────────────────────────────────────── */
type TabId = "Pipeline" | "Jobs" | "Candidates" | "Interviews" | "Analytics";

function RecruitmentTabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  const tabs: TabId[] = ["Pipeline", "Jobs", "Candidates", "Interviews", "Analytics"];

  return (
    <div className="flex items-center gap-8 mb-8 border-b px-1" style={{ borderColor: "var(--border)" }}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`pb-4 text-sm font-bold transition-all relative ${
            active === t ? "text-emerald-600" : ""
          }`}
          style={{ color: active === t ? "var(--primary)" : "var(--muted-foreground)" }}
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

/* ─── Main Page ──────────────────────────────────────────── */
export function Recruitment() {
  const { recruitmentPipeline: contextPipeline, addCandidate, deleteCandidate, moveCandidate } = useRecruitment();
  const { toasts, toast, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("Pipeline");

  const pipeline = STAGES.reduce((acc, stage) => {
    const ctx = contextPipeline[stage] || [];
    const mock = (recruitmentPipeline as Record<Stage, Candidate[]>)[stage] || [];
    acc[stage] = ctx.length > 0 ? (ctx as unknown as Candidate[]) : mock;
    return acc;
  }, {} as Record<Stage, Candidate[]>);

  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  const displayPipeline = STAGES.reduce((acc, stage) => {
    acc[stage] = pipeline[stage].filter((c: Candidate) => !deletedIds.has(c.id));
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

  return (
    <div className="min-h-screen -m-6 p-6 transition-colors duration-300" style={{ backgroundColor: "var(--background)" }}>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Modals */}
      {showPostJob && <PostJobModal onClose={() => setShowPostJob(false)} onPost={handlePostJob} />}
      {showJobs && <OpenPositionsModal jobs={jobs} onClose={() => setShowJobs(false)} />}
      {addStage && <AddCandidateModal stage={addStage} onClose={() => setAddStage(null)} onAdd={handleAddCandidate} />}
      {detailCandidate && (
        <CandidateDetailSidePanel 
          candidate={detailCandidate.candidate} 
          stage={detailCandidate.stage} 
          onClose={() => setDetailCandidate(null)} 
        />
      )}
      {messageCandidate && <MessageModal candidate={messageCandidate} onClose={() => setMessageCandidate(null)} />}
      {scheduleCandidate && <ScheduleModal candidate={scheduleCandidate} onClose={() => setScheduleCandidate(null)} onSchedule={handleSchedule} />}
      {deleteTarget && <DeleteConfirmDialog candidate={deleteTarget.candidate} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}

      <PageHeader onPostJob={() => setShowPostJob(true)} onShowJobs={() => setShowJobs(true)} />
      <InfoBar />
      <KpiCards />
      <RecruitmentTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "Pipeline" && (
        <>
          {interviews.length > 0 && (
            <UpcomingInterviewsPanel 
              interviews={interviews} 
              onDismiss={(id) => setInterviews(prev => prev.filter(iv => iv.id !== id))} 
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
              const rawCount = displayPipeline[stage].length;
              const candidates = filteredPipeline[stage];

              return (
                <div key={stage} className="flex-shrink-0" style={{ width: "280px" }}>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>{stage}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold"
                        style={{ backgroundColor: "var(--primary)", color: "white" }}>
                        {rawCount}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-3 rounded-xl min-h-[500px]" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
                    {candidates.length === 0 && !isFiltering && <EmptyColumnState stage={stage} />}
                    {candidates.map((candidate) => {
                      const si = STAGES.indexOf(stage);
                      const nextStage = si < STAGES.length - 1 ? STAGES[si + 1] : null;
                      return (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate} nextStage={nextStage}
                          onSchedule={() => setScheduleCandidate(candidate)}
                          onDetail={() => setDetailCandidate({ candidate, stage })}
                          onDelete={() => setDeleteTarget({ candidateId: candidate.id, stage, candidate })}
                          onMoveNext={() => nextStage && handleMoveCandidate(candidate.id, stage, nextStage)}
                          onDragStart={(e: React.DragEvent) => { dragRef.current = { candidateId: candidate.id, fromStage: stage }; e.dataTransfer.effectAllowed = "move"; }}
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
        </>
      )}

      {activeTab === "Jobs" && <JobsView onPostJob={() => setShowPostJob(true)} onSelectJob={(j) => { setActiveTab("Pipeline"); toast(`Showing pipeline for ${j.title}`, "info"); }} />}
      {activeTab === "Candidates" && (
        <CandidatesView 
          candidates={Object.values(displayPipeline).flat()} 
          onDetail={(c) => setDetailCandidate({ candidate: c, stage: "Applied" })} 
          onSchedule={(c) => setScheduleCandidate(c)}
          onMessage={(c) => setMessageCandidate(c)}
        />
      )}
      {activeTab === "Interviews" && <InterviewsView interviews={interviews} onDismiss={(id) => setInterviews(prev => prev.filter(iv => iv.id !== id))} />}
      {activeTab === "Analytics" && <AnalyticsView />}
    </div>
  );
}
