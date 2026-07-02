import React, { useState } from "react";
import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../context/AuthContext";
import { showToast } from "../../../../components/workflow/ToastNotification";
import { ToggleRow } from "../components/ToggleRow";

export function EmployeeNotificationsSection({
  onModal,
}: {
  onModal: (m: string | null) => void;
}) {
  const [channels, setChannels] = useState({
    leave: { email: true, push: true, sms: false },
    payroll: { email: true, push: true, sms: true },
    attendance: { email: false, push: true, sms: false },
    performance: { email: true, push: true, sms: false },
    expenses: { email: true, push: true, sms: false },
    schedule: { email: false, push: true, sms: true },
    announcements: { email: true, push: true, sms: false },
    training: { email: true, push: false, sms: false },
  });
  const [digest, setDigest] = useState(true);
  const [digestTime, setDigestTime] = useState("9:00 AM");
  const [quietHours, setQuietHours] = useState(true);
  const [quietFrom, setQuietFrom] = useState("10:00 PM");
  const [quietTo, setQuietTo] = useState("7:00 AM");
  const [weekendNotifs, setWeekendNotifs] = useState(false);

  const toggleChannel = (
    cat: keyof typeof channels,
    ch: "email" | "push" | "sms",
  ) => {
    setChannels({
      ...channels,
      [cat]: { ...channels[cat], [ch]: !channels[cat][ch] },
    });
  };

  const channelRows = [
    {
      key: "leave" as const,
      label: "Leave Requests & Approvals",
      desc: "When your leave is approved or rejected",
    },
    {
      key: "payroll" as const,
      label: "Salary & Payslips",
      desc: "When salary is credited or payslip is ready",
    },
    {
      key: "attendance" as const,
      label: "Attendance Alerts",
      desc: "Late marks, regularization approvals",
    },
    {
      key: "performance" as const,
      label: "Performance Reviews",
      desc: "Review deadlines, feedback received",
    },
    {
      key: "expenses" as const,
      label: "Expense Claims",
      desc: "When expense is approved, rejected",
    },
    {
      key: "schedule" as const,
      label: "Shift & Schedule",
      desc: "Shift changes, swap approvals",
    },
    {
      key: "announcements" as const,
      label: "Company Announcements",
      desc: "Urgent company-wide updates",
    },
    {
      key: "training" as const,
      label: "Goals & Learning",
      desc: "Goal deadlines, training due dates",
    },
  ];

  return (
    <div>
      <Breadcrumb active="Notifications" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Notification Preferences
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>NOTIFICATION CHANNELS</Label>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_52px_52px_52px] gap-2 px-5 py-3 border-b border-border bg-secondary/50 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            <span>Category</span>
            <span className="text-center">Email</span>
            <span className="text-center">Push</span>
            <span className="text-center">SMS</span>
          </div>
          {channelRows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_52px_52px_52px] gap-2 px-5 py-4 border-b last:border-b-0 border-border/50 hover:bg-[#00B87C]/[0.08] transition-colors items-center"
            >
              <div>
                <p className="text-[14px] font-black text-foreground">
                  {row.label}
                </p>
                <p className="text-[12px] font-bold text-muted-foreground">
                  {row.desc}
                </p>
              </div>
              {(["email", "push", "sms"] as const).map((ch) => (
                <div key={ch} className="flex justify-center">
                  <Toggle
                    on={channels[row.key][ch]}
                    onChange={() => toggleChannel(row.key, ch)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>NOTIFICATION TIMING</Label>
        <div className="space-y-5 max-w-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-[14px] font-black text-foreground">
                Daily Digest Email
              </p>
              <p className="text-[12px] font-bold text-muted-foreground">
                Receive a summary email at 9 AM instead of individual emails
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <Toggle on={digest} onChange={setDigest} />
              {digest && (
                <select
                  value={digestTime}
                  onChange={(e) => setDigestTime(e.target.value)}
                  className="h-10 bg-background border border-border rounded-xl px-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
                >
                  {[
                    "9:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "12:00 PM",
                    "1:00 PM",
                    "2:00 PM",
                    "3:00 PM",
                    "4:00 PM",
                    "5:00 PM",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <ToggleRow
            label="Quiet Hours"
            desc="No push notifications during off-hours"
            on={quietHours}
            onChange={setQuietHours}
          />
          {quietHours && (
            <div className="flex items-center gap-3 pl-1">
              <span className="text-[12px] font-bold text-muted-foreground">
                From
              </span>
              <select
                value={quietFrom}
                onChange={(e) => setQuietFrom(e.target.value)}
                className="h-10 bg-background border border-border rounded-xl px-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                {["8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ),
                )}
              </select>
              <span className="text-[12px] font-bold text-muted-foreground">
                To
              </span>
              <select
                value={quietTo}
                onChange={(e) => setQuietTo(e.target.value)}
                className="h-10 bg-background border border-border rounded-xl px-3 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                {["5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
          <ToggleRow
            label="Weekend Notifications"
            desc="Only receive critical alerts on weekends"
            on={weekendNotifs}
            onChange={setWeekendNotifs}
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <Label>EMAIL PREFERENCES</Label>
        <button
          className="px-5 py-2.5 rounded-xl border border-rose-500 text-rose-500 text-[12px] font-black hover:bg-rose-500/10 transition-all active:scale-95"
          onClick={() => onModal("unsubscribe")}
        >
          Unsubscribe from all non-critical emails
        </button>
        <p className="text-[12px] font-bold text-muted-foreground italic mt-3">
          Critical notifications (salary, security) cannot be unsubscribed
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: APPEARANCE
   ═══════════════════════════════════════════ */
