import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
} from "lucide-react";

export function NotificationRulesSection() {
  const {
    SectionTitle,
    notifyAttEmail,
    notifyAttPush,
    notifyAttSms,
    notifyDigestFreq,
    notifyDocEmail,
    notifyDocPush,
    notifyDocSms,
    notifyEmpEmail,
    notifyEmpPush,
    notifyEmpSms,
    notifyLeaveDays,
    notifyLeaveEmail,
    notifyLeavePush,
    notifyLeaveSms,
    notifyPayEmail,
    notifyPayPush,
    notifyPaySms,
    notifyPayTime,
    notifyPerfDays,
    notifyPerfEmail,
    notifyPerfPush,
    notifyPerfSms,
    notifyQuiet,
    notifyShiftEmail,
    notifyShiftPush,
    notifyShiftSms,
    notifySysEmail,
    notifySysPush,
    notifySysSms,
    notifyWeekend,
    setNotifyAttEmail,
    setNotifyAttPush,
    setNotifyAttSms,
    setNotifyDigestFreq,
    setNotifyDocEmail,
    setNotifyDocPush,
    setNotifyDocSms,
    setNotifyEmpEmail,
    setNotifyEmpPush,
    setNotifyEmpSms,
    setNotifyLeaveDays,
    setNotifyLeaveEmail,
    setNotifyLeavePush,
    setNotifyLeaveSms,
    setNotifyPayEmail,
    setNotifyPayPush,
    setNotifyPaySms,
    setNotifyPayTime,
    setNotifyPerfDays,
    setNotifyPerfEmail,
    setNotifyPerfPush,
    setNotifyPerfSms,
    setNotifyQuiet,
    setNotifyShiftEmail,
    setNotifyShiftPush,
    setNotifyShiftSms,
    setNotifySysEmail,
    setNotifySysPush,
    setNotifySysSms,
    setNotifyWeekend,
  } = useSettingsContext();

  const cards = [
    {
      title: "🌴 Leave Requests",
      email: notifyLeaveEmail,
      setEmail: setNotifyLeaveEmail,
      push: notifyLeavePush,
      setPush: setNotifyLeavePush,
      sms: notifyLeaveSms,
      setSms: setNotifyLeaveSms,
    },
    {
      title: "₹ Payroll Processed",
      email: notifyPayEmail,
      setEmail: setNotifyPayEmail,
      push: notifyPayPush,
      setPush: setNotifyPayPush,
      sms: notifyPaySms,
      setSms: setNotifyPaySms,
    },
    {
      title: "⏰ Attendance Alerts",
      email: notifyAttEmail,
      setEmail: setNotifyAttEmail,
      push: notifyAttPush,
      setPush: setNotifyAttPush,
      sms: notifyAttSms,
      setSms: setNotifyAttSms,
    },
    {
      title: "⭐ Performance Reviews",
      email: notifyPerfEmail,
      setEmail: setNotifyPerfEmail,
      push: notifyPerfPush,
      setPush: setNotifyPerfPush,
      sms: notifyPerfSms,
      setSms: setNotifyPerfSms,
    },
    {
      title: "👤 New Employee Joining",
      email: notifyEmpEmail,
      setEmail: setNotifyEmpEmail,
      push: notifyEmpPush,
      setPush: setNotifyEmpPush,
      sms: notifyEmpSms,
      setSms: setNotifyEmpSms,
    },
    {
      title: "📅 Shift Changes",
      email: notifyShiftEmail,
      setEmail: setNotifyShiftEmail,
      push: notifyShiftPush,
      setPush: setNotifyShiftPush,
      sms: notifyShiftSms,
      setSms: setNotifyShiftSms,
    },
    {
      title: "📄 Document Uploads",
      email: notifyDocEmail,
      setEmail: setNotifyDocEmail,
      push: notifyDocPush,
      setPush: setNotifyDocPush,
      sms: notifyDocSms,
      setSms: setNotifyDocSms,
    },
    {
      title: "🛡 System Alerts (Security)",
      email: notifySysEmail,
      setEmail: setNotifySysEmail,
      push: notifySysPush,
      setPush: setNotifySysPush,
      sms: notifySysSms,
      setSms: setNotifySysSms,
    },
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
        <span style={{ color: "#00B87C" }}>Notification Rules</span>
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
            Notification Rules
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Configure when and how notifications are sent
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
          Save Rules
        </button>
      </div>

      {/* Section: NOTIFICATION PREFERENCES */}
      <SectionTitle title="Notification Preferences" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl flex flex-col justify-between"
            style={{
              backgroundColor: "var(--input-background)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--foreground)",
                display: "block",
                marginBottom: "12px",
              }}
            >
              {c.title}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Email", state: c.email, setter: c.setEmail },
                { label: "Push", state: c.push, setter: c.setPush },
                { label: "SMS", state: c.sms, setter: c.setSms },
              ].map((ch, cIdx) => (
                <div
                  key={cIdx}
                  className="flex flex-col items-center bg-[var(--card)] p-2 rounded-lg border border-[var(--border)]"
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      marginBottom: "6px",
                    }}
                  >
                    {ch.label}
                  </span>
                  <button
                    onClick={() => ch.setter(!ch.state)}
                    style={{
                      width: "32px",
                      height: "18px",
                      borderRadius: "18px",
                      backgroundColor: ch.state
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
                        left: ch.state ? "16px" : "2px",
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
        ))}
      </div>

      {/* Section: NOTIFICATION TIMING */}
      <SectionTitle title="Notification Timing" />
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
              Digest Email Frequency
            </label>
            <select
              value={notifyDigestFreq}
              onChange={(e) => setNotifyDigestFreq(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="Daily at 9 AM">Daily at 9 AM ▾</option>
              <option value="Weekly">Weekly</option>
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
              Reminder Before Leave (days)
            </label>
            <input
              type="text"
              value={notifyLeaveDays}
              onChange={(e) => setNotifyLeaveDays(e.target.value)}
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
              Review Due Reminder (days before)
            </label>
            <input
              type="text"
              value={notifyPerfDays}
              onChange={(e) => setNotifyPerfDays(e.target.value)}
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
              Payroll Alert Time
            </label>
            <input
              type="text"
              value={notifyPayTime}
              onChange={(e) => setNotifyPayTime(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {[
            {
              label: "Send Weekend Notifications",
              state: notifyWeekend,
              setter: setNotifyWeekend,
            },
            {
              label: "Quiet Hours (11 PM – 7 AM)",
              state: notifyQuiet,
              setter: setNotifyQuiet,
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
          Save Rules
        </button>
      </div>
    </div>
  );
}
