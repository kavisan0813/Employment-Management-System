import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function PerformanceSettingsSection() {
  const {
    SectionTitle,
    perfAnonPeerFeedback,
    perfCalibrationDeadline,
    perfClientFeedback,
    perfGoalDeadline,
    perfGoalSetting,
    perfHrFinalizationDeadline,
    perfLinkGoals,
    perfMaxGoals,
    perfMgrReviewWin,
    perfMinPeers,
    perfOkrSupport,
    perfPeerFeedback,
    perfQuarterlyCheckin,
    perfRatingScale,
    perfRequireGoalApp,
    perfReviewFreq,
    perfReviewMonth,
    perfSelfReviewWin,
    perfSubFeedback,
    setPerfAnonPeerFeedback,
    setPerfCalibrationDeadline,
    setPerfClientFeedback,
    setPerfGoalDeadline,
    setPerfGoalSetting,
    setPerfHrFinalizationDeadline,
    setPerfLinkGoals,
    setPerfMaxGoals,
    setPerfMgrReviewWin,
    setPerfMinPeers,
    setPerfOkrSupport,
    setPerfPeerFeedback,
    setPerfQuarterlyCheckin,
    setPerfRatingScale,
    setPerfRequireGoalApp,
    setPerfReviewFreq,
    setPerfReviewMonth,
    setPerfSelfReviewWin,
    setPerfSubFeedback,
    showToast,
  } = useSettingsContext();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Performance Settings</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Performance Settings
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Configure review cycles, rating scales and KPI frameworks
          </p>
        </div>
        <button
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Settings
        </button>
      </div>

      {/* Policy Block 1: REVIEW CYCLE */}
      <SectionTitle title="Review Cycle" />
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Review Frequency
            </label>
            <select
              value={perfReviewFreq}
              onChange={(e) => setPerfReviewFreq(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="Annual">Annual ▾</option>
              <option value="Semi-Annual">Semi-Annual</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              FY Review Month
            </label>
            <select
              value={perfReviewMonth}
              onChange={(e) => setPerfReviewMonth(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="April">April ▾</option>
              <option value="December">December</option>
              <option value="March">March</option>
            </select>
          </div>
          {[
            {
              label: "Self-Review Window (days)",
              state: perfSelfReviewWin,
              setter: setPerfSelfReviewWin,
            },
            {
              label: "Manager Review Window (days)",
              state: perfMgrReviewWin,
              setter: setPerfMgrReviewWin,
            },
            {
              label: "Calibration Meeting Deadline",
              state: perfCalibrationDeadline,
              setter: setPerfCalibrationDeadline,
            },
            {
              label: "HR Finalization Deadline",
              state: perfHrFinalizationDeadline,
              setter: setPerfHrFinalizationDeadline,
            },
          ].map((f, idx) => (
            <div key={idx}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                {f.label}
              </label>
              <input
                type="text"
                value={f.state}
                onChange={(e) => f.setter(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Policy Block 2: RATING SCALE */}
      <SectionTitle title="Rating Scale" />
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--muted-foreground)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Current Rating Scale
        </label>
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            {
              label: "5 – Exceptional",
              color: "#10B981",
              bg: "rgba(16, 185, 129, 0.1)",
            },
            {
              label: "4 – Exceeds Expectations",
              color: "#0EA5E9",
              bg: "rgba(14, 165, 233, 0.1)",
            },
            {
              label: "3 – Meets Expectations",
              color: "#F59E0B",
              bg: "rgba(245, 158, 11, 0.1)",
            },
            {
              label: "2 – Below Expectations",
              color: "#EF4444",
              bg: "rgba(239, 68, 68, 0.1)",
            },
            {
              label: "1 – Unsatisfactory",
              color: "#6B7280",
              bg: "rgba(107, 114, 128, 0.1)",
            },
          ].map((chip, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: chip.bg,
                color: chip.color,
                padding: "6px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {chip.label}
            </span>
          ))}
        </div>
        <div className="w-full md:w-1/2">
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Change Rating Scale
          </label>
          <select
            value={perfRatingScale}
            onChange={(e) => setPerfRatingScale(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="5-Point Scale">5-Point Scale ▾</option>
            <option value="3-Point Scale">3-Point Scale</option>
            <option value="10-Point Scale">10-Point Scale</option>
          </select>
        </div>
      </div>

      {/* Policy Block 3: 360° FEEDBACK */}
      <SectionTitle title="360° Feedback" />
      <div
        className="p-6 rounded-xl mb-6 space-y-4"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        {[
          {
            label: "Enable Peer Feedback",
            state: perfPeerFeedback,
            setter: setPerfPeerFeedback,
          },
          {
            label: "Anonymous Peer Feedback",
            desc: "Peer names are hidden from reviewee",
            state: perfAnonPeerFeedback,
            setter: setPerfAnonPeerFeedback,
          },
          {
            label: "Enable Subordinate Feedback",
            state: perfSubFeedback,
            setter: setPerfSubFeedback,
          },
          {
            label: "Enable Client Feedback",
            state: perfClientFeedback,
            setter: setPerfClientFeedback,
          },
        ].map((row, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {row.label}
              </p>
              {"desc" in row && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    marginTop: "2px",
                    margin: 0,
                  }}
                >
                  {row.desc}
                </p>
              )}
            </div>
            <button
              onClick={() => row.setter(!row.state)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: row.state
                  ? "#00B87C"
                  : "var(--switch-background)",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  left: row.state ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                }}
              />
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center py-2">
          <div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--foreground)",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Minimum Peers Required for Review
            </p>
          </div>
          <input
            type="text"
            value={perfMinPeers}
            onChange={(e) => setPerfMinPeers(e.target.value)}
            className="w-20 rounded-xl px-3 py-1.5 text-sm outline-none border text-center"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      {/* Policy Block 4: GOALS & KPIs */}
      <SectionTitle title="Goals & KPIs" />
      <div
        className="p-6 rounded-xl mb-6 space-y-4"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        {[
          {
            label: "Enable Goal Setting Module",
            state: perfGoalSetting,
            setter: setPerfGoalSetting,
          },
          {
            label: "Link Goals to Performance Rating",
            state: perfLinkGoals,
            setter: setPerfLinkGoals,
          },
          {
            label: "Require Manager Goal Approval",
            state: perfRequireGoalApp,
            setter: setPerfRequireGoalApp,
          },
          {
            label: "Quarterly Goal Check-ins",
            state: perfQuarterlyCheckin,
            setter: setPerfQuarterlyCheckin,
          },
          {
            label: "OKR Framework Support",
            state: perfOkrSupport,
            setter: setPerfOkrSupport,
          },
        ].map((row, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {row.label}
              </p>
            </div>
            <button
              onClick={() => row.setter(!row.state)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: row.state
                  ? "#00B87C"
                  : "var(--switch-background)",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  left: row.state ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                }}
              />
            </button>
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Max Goals per Employee
            </label>
            <input
              type="text"
              value={perfMaxGoals}
              onChange={(e) => setPerfMaxGoals(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Goal Deadline (days before review)
            </label>
            <input
              type="text"
              value={perfGoalDeadline}
              onChange={(e) => setPerfGoalDeadline(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => showToast("Performance rubrics published")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
