import { useState } from "react";
import { Plus, MoreHorizontal, Eye, MessageSquare, Trash2, Calendar } from "lucide-react";
import { recruitmentPipeline } from "../data/mockData";

type Stage = "Applied" | "Screening" | "Interview" | "Offer Sent" | "Hired";

const STAGE_CONFIG: Record<
  Stage,
  { color: string; bg: string; border: string; badge: string; badgeText: string }
> = {
  Applied: {
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    badge: "#D1FAE5",
    badgeText: "#047857",
  },
  Screening: {
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    badge: "#FEF3C7",
    badgeText: "#B45309",
  },
  Interview: {
    color: "#14B8A6",
    bg: "#F0FDFA",
    border: "#99F6E4",
    badge: "#CCFBF1",
    badgeText: "#0D9488",
  },
  "Offer Sent": {
    color: "#0EA5E9",
    bg: "#F0F9FF",
    border: "#BAE6FD",
    badge: "#E0F2FE",
    badgeText: "#0369A1",
  },
  Hired: {
    color: "#22C55E",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    badge: "#DCFCE7",
    badgeText: "#15803D",
  },
};

const AVATAR_COLORS = [
  "linear-gradient(135deg, #059669, #047857)",
  "linear-gradient(135deg, #14B8A6, #0D9488)",
  "linear-gradient(135deg, #EC4899, #DB2777)",
  "linear-gradient(135deg, #F59E0B, #D97706)",
  "linear-gradient(135deg, #22C55E, #16A34A)",
  "linear-gradient(135deg, #0EA5E9, #0369A1)",
];

interface Candidate {
  id: string;
  name: string;
  role: string;
  date: string;
  avatar: string | null;
  initials: string;
}

function CandidateCard({
  candidate,
  stage,
  index,
}: {
  candidate: Candidate;
  stage: Stage;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const config = STAGE_CONFIG[stage];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-4 transition-all cursor-pointer"
      style={{
        backgroundColor: hovered ? "white" : "white",
        border: hovered ? `1px solid ${config.color}40` : "1px solid #D1FAE5",
        boxShadow: hovered
          ? `0 4px 16px rgba(0,0,0,0.08), 0 0 0 2px ${config.color}20`
          : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {candidate.avatar ? (
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="rounded-full object-cover shrink-0"
              style={{ width: "36px", height: "36px", border: "2px solid #D1FAE5" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: "36px",
                height: "36px",
                background: AVATAR_COLORS[index % AVATAR_COLORS.length],
              }}
            >
              <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>
                {candidate.initials}
              </span>
            </div>
          )}
          <div>
            <p style={{ color: "#022C22", fontSize: "13px", fontWeight: 700 }}>{candidate.name}</p>
            <p style={{ color: "#6B7280", fontSize: "11px" }}>{candidate.role}</p>
          </div>
        </div>
        <button
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "#CBD5E1" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ECFDF5";
            (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#CBD5E1";
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <Calendar size={11} color="#6B7280" />
        <span style={{ color: "#6B7280", fontSize: "11px" }}>Applied {candidate.date}</span>
      </div>

      {/* Action icons */}
      <div
        className="flex items-center gap-2 pt-3"
        style={{ borderTop: "1px solid #D1FAE5" }}
      >
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-1 justify-center transition-colors"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#059669",
            backgroundColor: "#ECFDF5",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#D1FAE5";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ECFDF5";
          }}
        >
          <Eye size={11} />
          View
        </button>
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-1 justify-center transition-colors"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#14B8A6",
            backgroundColor: "#F0FDFA",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#CCFBF1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0FDFA";
          }}
        >
          <MessageSquare size={11} />
          Note
        </button>
        <button
          className="flex items-center justify-center px-2.5 py-1.5 rounded-lg transition-colors"
          style={{
            fontSize: "11px",
            color: "#EF4444",
            backgroundColor: "#FEF2F2",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEE2E2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2";
          }}
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

export function Recruitment() {
  const stages: Stage[] = ["Applied", "Screening", "Interview", "Offer Sent", "Hired"];
  const pipeline = recruitmentPipeline as Record<Stage, Candidate[]>;

  const totalCandidates = stages.reduce(
    (sum, stage) => sum + pipeline[stage].length,
    0
  );

  return (
    <div style={{ maxWidth: "1360px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Pipeline stats */}
        <div className="flex items-center gap-4">
          {stages.map((stage) => {
            const config = STAGE_CONFIG[stage];
            return (
              <div
                key={stage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{
                  backgroundColor: config.badge,
                  border: `1px solid ${config.border}`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span style={{ color: config.badgeText, fontSize: "12px", fontWeight: 700 }}>
                  {pipeline[stage].length}
                </span>
                <span style={{ color: config.color, fontSize: "12px" }}>{stage}</span>
              </div>
            );
          })}
        </div>

        <button
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #059669, #047857)",
            color: "white",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.35)",
          }}
        >
          <Plus size={15} />
          Post a Job
        </button>
      </div>

      {/* Summary Bar */}
      <div
        className="rounded-xl p-4 mb-5 flex items-center gap-6"
        style={{
          backgroundColor: "white",
          border: "1px solid #D1FAE5",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div>
          <p style={{ color: "#6B7280", fontSize: "11px" }}>Total Candidates</p>
          <p style={{ color: "#022C22", fontSize: "18px", fontWeight: 800 }}>{totalCandidates}</p>
        </div>
        <div style={{ height: "36px", width: "1px", backgroundColor: "#D1FAE5" }} />
        {/* Progress bar */}
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1.5">
            {stages.map((stage) => {
              const config = STAGE_CONFIG[stage];
              const width = (pipeline[stage].length / totalCandidates) * 100;
              return (
                <div
                  key={stage}
                  className="rounded-full transition-all"
                  style={{
                    height: "8px",
                    width: `${width}%`,
                    backgroundColor: config.color,
                  }}
                  title={`${stage}: ${pipeline[stage].length}`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            {stages.map((stage) => {
              const config = STAGE_CONFIG[stage];
              return (
                <div key={stage} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                  <span style={{ color: "#6B7280", fontSize: "11px" }}>
                    {stage} ({pipeline[stage].length})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ height: "36px", width: "1px", backgroundColor: "#D1FAE5" }} />
        <div>
          <p style={{ color: "#6B7280", fontSize: "11px" }}>Hired This Month</p>
          <p style={{ color: "#22C55E", fontSize: "18px", fontWeight: 800 }}>
            {pipeline["Hired"].length}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const config = STAGE_CONFIG[stage];
          const candidates = pipeline[stage];

          return (
            <div
              key={stage}
              className="flex-shrink-0 rounded-2xl flex flex-col"
              style={{
                width: "240px",
                backgroundColor: "#F0FDF4",
                border: "1px solid #D1FAE5",
              }}
            >
              {/* Column Header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
                style={{
                  backgroundColor: config.bg,
                  borderBottom: `2px solid ${config.color}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span
                    style={{
                      color: config.color,
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {stage}
                  </span>
                </div>
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: config.badge,
                    color: config.badgeText,
                    fontSize: "11px",
                    fontWeight: 800,
                    border: `1px solid ${config.border}`,
                  }}
                >
                  {candidates.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto" style={{ maxHeight: "520px" }}>
                {candidates.map((candidate, index) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    stage={stage}
                    index={index}
                  />
                ))}

                {/* Add card button */}
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
                  style={{
                    border: `1px dashed ${config.border}`,
                    color: config.color,
                    fontSize: "12px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = config.bg;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  }}
                >
                  <Plus size={13} />
                  Add Candidate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
