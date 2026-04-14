import { useState } from "react";
import { Plus, MessageSquare, Calendar, ChevronRight, Star, X, Briefcase, MapPin, DollarSign, ChevronDown, Users } from "lucide-react";
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

function CandidateCard({ candidate }: { candidate: Candidate }) {
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
          <MessageSquare size={14} style={{ cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#3EA76F"; }} onMouseLeave={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#9BBFB0"; }} />
          <Calendar size={14} style={{ cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#3EA76F"; }} onMouseLeave={(e) => { (e.currentTarget as SVGSVGElement).style.color = "#9BBFB0"; }} />
          <ChevronRight size={16} style={{ color: "#3EA76F" }} />
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
                placeholder="e.g. $80,000 - $120,000"
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

export function Recruitment() {
  const stages: Stage[] = ["Applied", "Screening", "Interview", "Offer Sent", "Hired"];
  const pipeline = recruitmentPipeline as Record<Stage, Candidate[]>;
  const [showPostJob, setShowPostJob] = useState(false);

  const totalCandidates = stages.reduce(
    (sum, stage) => sum + pipeline[stage].length,
    0
  );

  return (
    <div className="pb-10">
      {showPostJob && <PostJobModal onClose={() => setShowPostJob(false)} />}
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                  style={{ color: "#3EA76F", fontSize: "12px", fontWeight: 700, backgroundColor: "#E4F5ED" }}
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
                <div
                  className="rounded-[24px] flex items-center justify-center py-5 transition-colors group"
                  style={{ backgroundColor: "#F8FFFE", border: "1px dashed #C9F0DC" }}
                >
                  <span style={{ color: "#9BBFB0" }} className="text-[13px] font-medium group-hover:text-[#3EA76F] transition-colors">
                    + Drop candidate here
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
