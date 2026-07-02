import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
} from "lucide-react";

export function WebhooksSection() {
  const {
    SectionTitle,
    setActiveModal,
    setWebhookHmac,
    setWebhookLogs,
    setWebhookRetry,
    showToast,
    webhookHmac,
    webhookLogs,
    webhookRetry,
  } = useSettingsContext();

  const rows = [
    {
      dot: "#10B981",
      url: "https://app.slack.com/webhooks/incoming/T04X...",
      event: "employee.joined",
      eventColor: "#10B981",
      eventBg: "rgba(16, 185, 129, 0.1)",
      status: "Active",
      statusColor: "#10B981",
    },
    {
      dot: "#10B981",
      url: "https://hooks.zapier.com/hooks/catch/123...",
      event: "payroll.processed",
      eventColor: "#F59E0B",
      eventBg: "rgba(245, 158, 11, 0.1)",
      status: "Active",
      statusColor: "#10B981",
    },
    {
      dot: "#EF4444",
      url: "https://api.crm.io/nexushr/events",
      event: "Failed — 502",
      eventColor: "#EF4444",
      eventBg: "rgba(239, 68, 68, 0.1)",
      status: "Failed — 502",
      statusColor: "#EF4444",
      failed: true,
    },
    {
      dot: "#10B981",
      url: "https://api.slack.com/notify/leave...",
      event: "leave.approved",
      eventColor: "#0EA5E9",
      eventBg: "rgba(14, 165, 233, 0.1)",
      status: "Active",
      statusColor: "#10B981",
    },
  ];

  const availableEvents = [
    "employee.joined",
    "employee.left",
    "leave.applied",
    "leave.approved",
    "leave.rejected",
    "payroll.processed",
    "attendance.alert",
    "review.completed",
    "shift.changed",
    "role.updated",
    "document.uploaded",
    "onboarding.started",
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight
          size={12}
          style={{ color: "var(--muted-foreground)" }}
        />
        <span style={{ color: "#00B87C" }}>Webhooks</span>
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
            Webhooks
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Push real-time event notifications to external systems
          </p>
        </div>
        <button
          onClick={() => setActiveModal("add_webhook")}
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
          + Add Webhook
        </button>
      </div>

      {/* Section: ACTIVE WEBHOOKS */}
      <SectionTitle title="Active Webhooks" />
      <div className="space-y-3 mb-8">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4"
            style={{
              backgroundColor: "var(--input-background)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: r.dot,
                }}
              />
              <span className="font-mono text-xs text-[#00B87C] w-64 truncate">
                {r.url}
              </span>
              <span
                style={{
                  backgroundColor: r.eventBg,
                  color: r.eventColor,
                  padding: "2px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {r.event}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: r.statusColor,
                  fontWeight: 600,
                }}
              >
                {r.status}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {r.failed ? (
                <button
                  onClick={() => showToast("Event notification resubmitted")}
                  style={{
                    backgroundColor: "#EF4444",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              ) : (
                <>
                  <button
                    onClick={() =>
                      showToast("Ping delivered with HTTP 200 status code")
                    }
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Test
                  </button>
                  <button
                    onClick={() => setActiveModal("edit_webhook")}
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveModal("delete_webhook")}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #EF4444",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#EF4444",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Section: AVAILABLE EVENTS */}
      <SectionTitle title="Available Events" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {availableEvents.map((ev, idx) => (
          <div
            key={idx}
            className="p-2 rounded-xl border text-center text-[13px] font-medium transition-all cursor-pointer select-none"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#DCFCE7";
              e.currentTarget.style.color = "#00B87C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--card)";
              e.currentTarget.style.color = "var(--foreground)";
            }}
          >
            {ev}
          </div>
        ))}
      </div>

      {/* Section: WEBHOOK SETTINGS */}
      <SectionTitle title="Webhook Settings" />
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
            label: "Retry Failed Webhooks (3 attempts)",
            state: webhookRetry,
            setter: setWebhookRetry,
          },
          {
            label: "Include Payload Signature (HMAC)",
            state: webhookHmac,
            setter: setWebhookHmac,
          },
          {
            label: "Enable Webhook Event Logs",
            state: webhookLogs,
            setter: setWebhookLogs,
          },
        ].map((row, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
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
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() =>
            showToast("Webhook definitions cataloged successfully")
          }
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
