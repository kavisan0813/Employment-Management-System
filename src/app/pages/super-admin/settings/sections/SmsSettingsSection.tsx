import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function SmsSettingsSection() {
  const {
    SectionTitle,
    setSmsApiKey,
    setSmsAuthToken,
    setSmsCountryCode,
    setSmsDltId,
    setSmsProvider,
    setSmsSenderId,
    setSmsTriggerAtt,
    setSmsTriggerLeave,
    setSmsTriggerOnboard,
    setSmsTriggerOtp,
    setSmsTriggerPay,
    setSmsTriggerPerf,
    setSmsTriggerShift,
    smsApiKey,
    smsAuthToken,
    smsCountryCode,
    smsDltId,
    smsProvider,
    smsSenderId,
    smsTriggerAtt,
    smsTriggerLeave,
    smsTriggerOnboard,
    smsTriggerOtp,
    smsTriggerPay,
    smsTriggerPerf,
    smsTriggerShift,
  } = useSettingsContext();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>SMS Settings</span>
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
            SMS Settings
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Configure SMS gateway and notification messages
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

      {/* POLICY BLOCK 1: SMS GATEWAY */}
      <SectionTitle title="SMS Gateway" />
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
              Provider
            </label>
            <select
              value={smsProvider}
              onChange={(e) => setSmsProvider(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="Twilio">Twilio ▾</option>
              <option value="AWS SNS">AWS SNS</option>
              <option value="MSG91">MSG91</option>
              <option value="Exotel">Exotel</option>
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
              Sender ID
            </label>
            <input
              type="text"
              value={smsSenderId}
              onChange={(e) => setSmsSenderId(e.target.value)}
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
              API Key
            </label>
            <input
              type="password"
              value={smsApiKey}
              onChange={(e) => setSmsApiKey(e.target.value)}
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
              Auth Token
            </label>
            <input
              type="password"
              value={smsAuthToken}
              onChange={(e) => setSmsAuthToken(e.target.value)}
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
              Country Code Default
            </label>
            <select
              value={smsCountryCode}
              onChange={(e) => setSmsCountryCode(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="+91 (India)">+91 (India) ▾</option>
              <option value="+1 (US)">+1 (US)</option>
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
              DLT Principal Entity ID
            </label>
            <input
              type="text"
              value={smsDltId}
              onChange={(e) => setSmsDltId(e.target.value)}
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

      {/* POLICY BLOCK 2: SMS TRIGGERS */}
      <SectionTitle title="SMS Triggers" />
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
            label: "Salary Credited Alert",
            desc: "Sent after payroll disbursement",
            state: smsTriggerPay,
            setter: setSmsTriggerPay,
          },
          {
            label: "Leave Approval / Rejection",
            desc: "Employee notified on status change",
            state: smsTriggerLeave,
            setter: setSmsTriggerLeave,
          },
          {
            label: "OTP for MFA Login",
            desc: "One-time password for two-factor login",
            state: smsTriggerOtp,
            setter: setSmsTriggerOtp,
          },
          {
            label: "Shift Change Notification",
            desc: "Alert when employee schedule is modified",
            state: smsTriggerShift,
            setter: setSmsTriggerShift,
          },
          {
            label: "Attendance Irregularity Alert",
            desc: "Notify manager of 3+ consecutive absences",
            state: smsTriggerAtt,
            setter: setSmsTriggerAtt,
          },
          {
            label: "Onboarding Welcome SMS",
            desc: "Sent to new employee on joining day",
            state: smsTriggerOnboard,
            setter: setSmsTriggerOnboard,
          },
          {
            label: "Performance Review Reminder",
            desc: "Alert for review tasks",
            state: smsTriggerPerf,
            setter: setSmsTriggerPerf,
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
      </div>

      {/* POLICY BLOCK 3: SMS USAGE */}
      <SectionTitle title="SMS Usage" />
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: "rgba(0, 184, 124, 0.05)",
          border: "1px solid rgba(0, 184, 124, 0.2)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#00B87C",
                textTransform: "uppercase",
              }}
            >
              Sent This Month
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: 800, color: "#00B87C" }}
            >
              1,248
            </span>
          </div>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
              }}
            >
              Remaining Credits
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--foreground)",
              }}
            >
              8,752
            </span>
          </div>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#00B87C",
                textTransform: "uppercase",
              }}
            >
              Delivery Rate
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: 800, color: "#00B87C" }}
            >
              98.2%
            </span>
          </div>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span
              style={{ fontSize: "11px", fontWeight: 600, color: "#00B87C" }}
            >
              1,248 / 10,000 monthly plan
            </span>
            <a
              href="#"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#00B87C",
                textDecoration: "none",
              }}
            >
              Upgrade Plan
            </a>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-[#DCFCE7]">
            <div
              style={{ width: "12.48%", backgroundColor: "#00B87C" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
            ></div>
          </div>
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center gap-4 pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          style={{
            backgroundColor: "transparent",
            color: "#9CA3AF",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
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
