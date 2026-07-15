import React from "react";
import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function EmailTemplatesSection() {
  const {
    SectionTitle,
    emailAddLogo,
    emailAddUnsub,
    emailBccHr,
    emailFromAddress,
    emailFromName,
    emailProvider,
    emailReplyTo,
    setEmailAddLogo,
    setEmailAddUnsub,
    setEmailBccHr,
    setEmailFromAddress,
    setEmailFromName,
    setEmailProvider,
    setEmailReplyTo,
  } = useSettingsContext();

  const templates = [
    {
      name: "Welcome Email",
      event: "employee.joined",
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.1)",
      subject: "Welcome to viyanHR, {{name}}!",
      edited: "Apr 1, 2026",
      status: "Active",
      statusColor: "#10B981",
      statusBg: "rgba(16, 185, 129, 0.1)",
    },
    {
      name: "Leave Approved",
      event: "leave.approved",
      color: "#0EA5E9",
      bg: "rgba(14, 165, 233, 0.1)",
      subject: "Your leave from {{from}} to {{to}} is confirmed",
      edited: "Mar 15, 2026",
      status: "Active",
      statusColor: "#10B981",
      statusBg: "rgba(16, 185, 129, 0.1)",
    },
    {
      name: "Leave Rejected",
      event: "leave.rejected",
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
      subject: "Your leave request was not approved",
      edited: "Mar 15, 2026",
      status: "Active",
      statusColor: "#10B981",
      statusBg: "rgba(16, 185, 129, 0.1)",
    },
    {
      name: "Salary Slip Ready",
      event: "payroll.run",
      color: "#8B5CF6",
      bg: "rgba(139, 92, 246, 0.1)",
      subject: "Your salary slip for {{month}} is now available",
      edited: "Feb 28, 2026",
      status: "Active",
      statusColor: "#10B981",
      statusBg: "rgba(16, 185, 129, 0.1)",
    },
    {
      name: "Password Reset",
      event: "auth.reset",
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
      subject: "Reset your viyanHR password",
      edited: "Jan 10, 2026",
      status: "Active",
      statusColor: "#10B981",
      statusBg: "rgba(16, 185, 129, 0.1)",
    },
    {
      name: "Performance Review Due",
      event: "review.due",
      color: "#6B7280",
      bg: "rgba(107, 114, 128, 0.1)",
      subject: "Your performance review is due in {{days}} days",
      edited: "Dec 1, 2025",
      status: "Draft",
      statusColor: "#F59E0B",
      statusBg: "rgba(245, 158, 11, 0.1)",
    },
    {
      name: "Onboarding Welcome",
      event: "onboarding.start",
      color: "#0EA5E9",
      bg: "rgba(14, 165, 233, 0.1)",
      subject: "Your first day at viyanHR is on {{date}}",
      edited: "Nov 20, 2025",
      status: "Active",
      statusColor: "#10B981",
      statusBg: "rgba(16, 185, 129, 0.1)",
    },
    {
      name: "Shift Change Alert",
      event: "shift.changed",
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
      subject: "Your shift on {{date}} has been updated",
      edited: "Oct 5, 2025",
      status: "Inactive",
      statusColor: "#6B7280",
      statusBg: "rgba(107, 114, 128, 0.1)",
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Email Templates</span>
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
            Email Templates
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Customize transactional and HR email content
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
          + New Template
        </button>
      </div>

      {/* Table */}
      <SectionTitle title="All Templates" />
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                textAlign: "left",
              }}
            >
              {[
                "TEMPLATE",
                "TRIGGER EVENT",
                "SUBJECT PREVIEW",
                "LAST EDITED",
                "STATUS",
                "ACTION",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {templates.map((t, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid var(--border)",
                  height: "56px",
                }}
                className="hover:bg-[var(--muted)] transition-all"
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  {t.name}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor: t.bg,
                      color: t.color,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {t.event}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {t.subject}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {t.edited}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor: t.statusBg,
                      color: t.statusColor,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section: EMAIL SETTINGS */}
      <SectionTitle title="Email Settings" />
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              From Name
            </label>
            <input
              type="text"
              value={emailFromName}
              onChange={(e) => setEmailFromName(e.target.value)}
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
              From Email
            </label>
            <input
              type="text"
              value={emailFromAddress}
              onChange={(e) => setEmailFromAddress(e.target.value)}
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
              Reply-To Email
            </label>
            <input
              type="text"
              value={emailReplyTo}
              onChange={(e) => setEmailReplyTo(e.target.value)}
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
              Email Provider
            </label>
            <select
              value={emailProvider}
              onChange={(e) => setEmailProvider(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="SendGrid">SendGrid ▾</option>
              <option value="Mailchimp">Mailchimp</option>
              <option value="Postmark">Postmark</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {[
            {
              label: "Add Company Logo to All Emails",
              state: emailAddLogo,
              setter: setEmailAddLogo,
            },
            {
              label: "Add Footer Unsubscribe Link",
              state: emailAddUnsub,
              setter: setEmailAddUnsub,
            },
            {
              label: "BCC HR on All Employee Emails",
              state: emailBccHr,
              setter: setEmailBccHr,
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
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
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
