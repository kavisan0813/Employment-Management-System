import { useState } from "react";
import { Plus, MessageSquare, Calendar, ChevronRight, Star, X, Briefcase, MapPin, DollarSign, ChevronDown, Users, Send, Clock, CheckCircle } from "lucide-react";
import { recruitmentPipeline } from "../data/mockData";

type Stage = "Applied" | "Screening" | "Interview" | "Offer Sent" | "Hired";

const STAGE_CONFIG: Record<Stage, { color: string; bg: string; dot: string }> = {
  Applied: { color: "#10B981", bg: "#ECFDF5", dot: "#10B981" },
  Screening: { color: "#059669", bg: "#F0FDF4", dot: "#059669" },
  Interview: { color: "#14B8A6", bg: "#F0FDFA", dot: "#14B8A6" },
  "Offer Sent": { color: "#0D9488", bg: "#F0FDFA", dot: "#0D9488" },
  Hired: { color: "#10B981", bg: "#ECFDF5", dot: "#10B981" },
};

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
}

/* ─── Candidate Detail Modal ─────────────────────────────── */
function CandidateDetailModal({ candidate, stage, onClose }: { candidate: Candidate; stage: Stage; onClose: () => void }) {
  const config = STAGE_CONFIG[stage];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="relative px-6 pt-6 pb-4" style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 100%)", borderBottom: "1px solid var(--border)" }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: candidate.avatar ? "transparent" : "#E4F5ED", border: "2px solid #C9F0DC" }}
            >
              {candidate.avatar ? (
                <img src={candidate.avatar} className="w-full h-full rounded-full object-cover" alt="" />
              ) : (
                <span style={{ color: "#406E5F", fontSize: "18px", fontWeight: 700 }}>{candidate.initials}</span>
              )}
            </div>
            <div>
              <h3 style={{ color: "#0F3047", fontSize: "18px", fontWeight: 800 }}>{candidate.name}</h3>
              <p style={{ color: "#6B8C7A", fontSize: "13px" }}>{candidate.role}</p>
              <span
                className="inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold"
                style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.dot}30` }}
              >
                {stage}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-4">
          {[
            { label: "Applied Date", value: candidate.date },
            { label: "Location", value: candidate.location || "Remote" },
            { label: "Employment Type", value: candidate.type || "Full-time" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>{label}</span>
              <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          {/* Rating */}
          <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>Rating</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  fill={s <= (candidate.rating || 4) ? "#36C29F" : "transparent"}
                  color={s <= (candidate.rating || 4) ? "#36C29F" : "#C9F0DC"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(5,150,105,0.35)" }}
          >
            Move to Next Stage
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Message Modal ──────────────────────────────────────── */
function MessageModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const [message, setMessage] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E4F5ED", border: "1px solid #C9F0DC" }}>
              {candidate.avatar ? (
                <img src={candidate.avatar} className="w-full h-full rounded-full object-cover" alt="" />
              ) : (
                <span style={{ color: "#406E5F", fontSize: "11px", fontWeight: 700 }}>{candidate.initials}</span>
              )}
            </div>
            <div>
              <h3 style={{ color: "var(--foreground)", fontSize: "15px", fontWeight: 700 }}>Message {candidate.name}</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "11px" }}>{candidate.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Message thread area */}
        <div className="px-6 py-4" style={{ minHeight: "120px", backgroundColor: "var(--background)" }}>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
            Start the conversation with {candidate.name}
          </p>
        </div>

        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex gap-3 items-end">
            <textarea
              rows={2}
              className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              placeholder={`Write a message to ${candidate.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#10B981", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Schedule Interview Modal ───────────────────────────── */
function ScheduleModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const [form, setForm] = useState({ date: "", time: "", type: "Video Call", interviewer: "" });
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>Schedule Interview</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              with {candidate.name} — {candidate.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Date</label>
              <input
                type="date"
                className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Time</label>
              <div className="relative mt-1.5">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <input
                  type="time"
                  className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Interview Type</label>
            <div className="relative mt-1.5">
              <select
                className="w-full rounded-xl px-3 pr-8 py-2.5 text-sm outline-none appearance-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {["Video Call", "Phone Screen", "In-Person", "Technical Test"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
            </div>
          </div>

          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Interviewer</label>
            <input
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              placeholder="Enter interviewer name"
              value={form.interviewer}
              onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(5,150,105,0.35)" }}
          >
            <CheckCircle size={15} />
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Candidate Modal ────────────────────────────────── */
function AddCandidateModal({ stage, onClose }: { stage: Stage; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    location: "Remote",
    type: "Full-time",
    email: "",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>
              Add Candidate
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              Adding to <span style={{ color: "#10B981", fontWeight: 600 }}>{stage}</span> stage
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Full Name</label>
            <div className="relative mt-1.5">
              <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="e.g. Jordan Blake"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Job Role</label>
            <div className="relative mt-1.5">
              <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="e.g. Senior React Developer"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Email Address</label>
            <input
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              placeholder="candidate@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Location & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Location</label>
              <div className="relative mt-1.5">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <select
                  className="w-full rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                >
                  {["Remote", "On-site", "Hybrid"].map((l) => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Job Type</label>
              <div className="relative mt-1.5">
                <select
                  className="w-full rounded-xl px-3 pr-8 py-2.5 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(5,150,105,0.35)" }}
          >
            <Plus size={15} />
            Add Candidate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Candidate Card ─────────────────────────────────────── */
function CandidateCard({
  candidate,
  stage,
  onMessage,
  onSchedule,
  onDetail,
}: {
  candidate: Candidate;
  stage: Stage;
  onMessage: () => void;
  onSchedule: () => void;
  onDetail: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-[24px] p-5 cursor-pointer"
      style={{
        backgroundColor: hovered ? "#F0FFF8" : "#FFFFFF",
        border: hovered ? "1.5px solid #34D39A" : "1.5px solid #E8FDF0",
        boxShadow: hovered ? "0 6px 24px rgba(52,211,153,0.18)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color 200ms ease-out, background-color 200ms ease-out, box-shadow 200ms ease-out, transform 200ms ease-out",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: candidate.avatar ? "transparent" : "#E4F5ED",
            border: "1px solid #C9F0DC"
          }}
        >
          {candidate.avatar ? (
            <img src={candidate.avatar} className="w-full h-full rounded-full object-cover" alt="" />
          ) : (
            <span style={{ color: "#406E5F", fontSize: "12px", fontWeight: 700 }}>{candidate.initials}</span>
          )}
        </div>
        <div>
          <h4 style={{ color: "#0F3047", fontSize: "14px", fontWeight: 700 }}>{candidate.name}</h4>
          <p style={{ color: "#6B8C7A", fontSize: "12px" }}>{candidate.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: "#E4F5ED", color: "#3EA76F", border: "1px solid #C9F0DC" }}
        >
          Applied: {candidate.date.split(",")[0]}
        </span>
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: "#E4F5ED", color: "#406E5F", border: "1px solid #C9F0DC" }}
        >
          {candidate.location || "Remote"}
        </span>
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: "#E4F5ED", color: "#406E5F", border: "1px solid #C9F0DC" }}
        >
          Full-time
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={12}
              fill={s <= (candidate.rating || 4) ? "#36C29F" : "transparent"}
              color={s <= (candidate.rating || 4) ? "#36C29F" : "#C9F0DC"}
            />
          ))}
        </div>
        <div className="flex items-center gap-3" style={{ color: "#9BBFB0" }}>
          <MessageSquare
            size={14}
            style={{ cursor: "pointer" }}
            onClick={(e) => { e.stopPropagation(); onMessage(); }}
            onMouseEnter={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#3EA76F"; }}
            onMouseLeave={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#9BBFB0"; }}
          />
          <Calendar
            size={14}
            style={{ cursor: "pointer" }}
            onClick={(e) => { e.stopPropagation(); onSchedule(); }}
            onMouseEnter={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#3EA76F"; }}
            onMouseLeave={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#9BBFB0"; }}
          />
          <ChevronRight
            size={16}
            style={{ color: "#3EA76F", cursor: "pointer" }}
            onClick={(e) => { e.stopPropagation(); onDetail(); }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── "Post a Job" Modal ────────────────── */
function PostJobModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "",
    salary: "",
    description: "",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700 }}>
              Post a New Job
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
              Create a new job opening for recruitment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
            }
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Job Title */}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>
              Job Title
            </label>
            <div className="relative mt-1.5">
              <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none transition-all"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="e.g. Senior React Developer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          {/* Department & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Department</label>
              <div className="relative mt-1.5">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <select
                  className="w-full rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Location</label>
              <div className="relative mt-1.5">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <select
                  className="w-full rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                >
                  {["Remote", "On-site", "Hybrid"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
          </div>

          {/* Job Type & Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Job Type</label>
              <select
                className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none appearance-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>Experience</label>
              <input
                className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="e.g. 3-5 years"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
              />
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>
              Salary Range
            </label>
            <div className="relative mt-1.5">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                placeholder="e.g. ₹80,000 - ₹120,000"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 600 }}>
              Job Description
            </label>
            <textarea
              rows={3}
              className="w-full mt-1.5 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              placeholder="Brief description of the role and responsibilities..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 pb-6 flex gap-3"
          style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: "var(--secondary)", color: "var(--primary)" }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 12px rgba(5,150,105,0.35)",
            }}
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Drop Zone ──────────────────────────────────────────── */
function DropZone({ stage, onDrop }: { stage: Stage; onDrop: () => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const active = isDragOver || isHovered;

  return (
    <div
      onClick={onDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); onDrop(); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: "24px",
        border: `2px dashed ${active ? "#10B981" : "#C9F0DC"}`,
        backgroundColor: active ? "#EDFDF5" : "#F8FFFE",
        padding: "28px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "all 200ms ease-out",
        boxShadow: active ? "0 0 0 4px rgba(16,185,129,0.12), 0 4px 16px rgba(16,185,129,0.1)" : "none",
        transform: active ? "scale(1.01)" : "scale(1)",
      }}
    >
      {/* Animated Icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: active ? "#10B981" : "#E4F5ED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 200ms ease-out",
          boxShadow: active ? "0 4px 12px rgba(16,185,129,0.35)" : "none",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? "#ffffff" : "#3EA76F"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "all 200ms ease-out" }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: active ? "#0F3047" : "#6B8C7A",
            fontSize: "13px",
            fontWeight: 700,
            margin: 0,
            transition: "color 200ms ease-out",
          }}
        >
          {isDragOver ? "Release to drop" : "+ Drop candidate here"}
        </p>
        <p
          style={{
            color: active ? "#3EA76F" : "#9BBFB0",
            fontSize: "11px",
            marginTop: "3px",
            transition: "color 200ms ease-out",
          }}
        >
          {isDragOver ? `Adding to ${stage}` : "or click to add manually"}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Recruitment Page ─────────────────────────────── */
export function Recruitment() {
  const stages: Stage[] = ["Applied", "Screening", "Interview", "Offer Sent", "Hired"];
  const pipeline = recruitmentPipeline as Record<Stage, Candidate[]>;
  const [showPostJob, setShowPostJob] = useState(false);

  // Per-stage "Add Candidate" modal
  const [addStage, setAddStage] = useState<Stage | null>(null);

  // Card action modals
  const [detailCandidate, setDetailCandidate] = useState<{ candidate: Candidate; stage: Stage } | null>(null);
  const [messageCandidate, setMessageCandidate] = useState<Candidate | null>(null);
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(null);

  const totalCandidates = stages.reduce(
    (sum, stage) => sum + pipeline[stage].length,
    0
  );

  return (
    <div className="pb-10">
      {/* Modals */}
      {showPostJob && <PostJobModal onClose={() => setShowPostJob(false)} />}
      {addStage && <AddCandidateModal stage={addStage} onClose={() => setAddStage(null)} />}
      {detailCandidate && (
        <CandidateDetailModal
          candidate={detailCandidate.candidate}
          stage={detailCandidate.stage}
          onClose={() => setDetailCandidate(null)}
        />
      )}
      {messageCandidate && <MessageModal candidate={messageCandidate} onClose={() => setMessageCandidate(null)} />}
      {scheduleCandidate && <ScheduleModal candidate={scheduleCandidate} onClose={() => setScheduleCandidate(null)} />}

      {/* Top Badges & Post Job Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {stages.map((stage) => {
            const config = STAGE_CONFIG[stage];
            return (
              <div
                key={stage}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: config.bg }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.dot }} />
                <span style={{ color: "#0F3047", fontSize: "14px", fontWeight: 700 }}>{pipeline[stage].length}</span>
                <span style={{ color: config.color, fontSize: "14px" }}>{stage}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setShowPostJob(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold transition-all hover:opacity-90 shadow-lg"
          style={{ background: "#10B981", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)" }}
        >
          <Plus size={18} />
          Post a Job
        </button>
      </div>

      {/* Summary Stats Card */}
      <div className="bg-white rounded-[28px] p-8 mb-10 flex items-center shadow-sm border border-[#E8FDF0]">
        <div className="pr-10 border-r border-[#E8FDF0]">
          <p className="text-[#6B8C7A] text-[13px] font-medium mb-1">Total Candidates</p>
          <p className="text-[#0F3047] text-3xl font-black">{totalCandidates}</p>
        </div>

        {/* Progress Bar & Labels */}
        <div className="flex-1 px-10">
          <div className="flex gap-1.5 mb-2.5">
            {stages.map((stage) => {
              const config = STAGE_CONFIG[stage];
              const width = (pipeline[stage].length / totalCandidates) * 100;
              return (
                <div
                  key={stage}
                  className="h-2 rounded-full"
                  style={{ width: `${width}%`, backgroundColor: config.color }}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-5">
            {stages.map((stage) => {
              const config = STAGE_CONFIG[stage];
              return (
                <div key={stage} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-[#6B8C7A] text-[12px]">{stage} ({pipeline[stage].length})</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pl-10 border-l border-[#E8FDF0] text-right">
          <p className="text-[#6B8C7A] text-[13px] font-medium mb-1">Hired This Month</p>
          <p className="text-[#3EA76F] text-3xl font-black">{pipeline["Hired"].length}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        {stages.map((stage) => {
          const config = STAGE_CONFIG[stage];
          const candidates = pipeline[stage];

          return (
            <div key={stage} className="flex-shrink-0" style={{ width: "320px" }}>
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-3">
                  <h3 style={{ color: "#0F3047", fontSize: "16px", fontWeight: 800 }}>{stage}</h3>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[12px] font-bold"
                    style={{ backgroundColor: "#A8F1C4", color: "#064E3B" }}
                  >
                    {candidates.length}
                  </span>
                </div>
                <button
                  onClick={() => setAddStage(stage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                  style={{ color: "#3EA76F", fontSize: "12px", fontWeight: 700, backgroundColor: "#E4F5ED" }}
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    stage={stage}
                    onMessage={() => setMessageCandidate(candidate)}
                    onSchedule={() => setScheduleCandidate(candidate)}
                    onDetail={() => setDetailCandidate({ candidate, stage })}
                  />
                ))}
                <DropZone stage={stage} onDrop={() => setAddStage(stage)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
