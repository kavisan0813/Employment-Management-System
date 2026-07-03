import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function SecuritySettingsSection() {
  const {
    SectionTitle,
    secAlertSuspicious,
    secAllowedIpRanges,
    secEnforceMfa,
    secGoogleSso,
    secIdleTimeout,
    secIpWhitelisting,
    secLockoutDuration,
    secLockoutResetMethod,
    secLogLogins,
    secMaxFailedAttempts,
    secMicrosoftSso,
    secPwExpiry,
    secPwForceChange,
    secPwMinLen,
    secPwNumbers,
    secPwPreventReuse,
    secPwUpper,
    secSsoOnly,
    setActiveModal,
    setSecAlertSuspicious,
    setSecAllowedIpRanges,
    setSecEnforceMfa,
    setSecGoogleSso,
    setSecIdleTimeout,
    setSecIpWhitelisting,
    setSecLockoutDuration,
    setSecLockoutResetMethod,
    setSecLogLogins,
    setSecMaxFailedAttempts,
    setSecMicrosoftSso,
    setSecPwExpiry,
    setSecPwForceChange,
    setSecPwMinLen,
    setSecPwNumbers,
    setSecPwPreventReuse,
    setSecPwUpper,
    setSecSsoOnly,
    showToast,
  } = useSettingsContext();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Security</span>
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
            Security Settings
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Authentication, session and access control
          </p>
        </div>
        <button
          onClick={() => showToast("Authentication schemas hardened securely")}
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
          Save Changes
        </button>
      </div>

      {/* Policy Block 1: AUTHENTICATION */}
      <SectionTitle title="Authentication" />
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
            label: "Enforce Multi-Factor Authentication (MFA)",
            desc: "All users must set up TOTP or SMS OTP on next login",
            state: secEnforceMfa,
            setter: setSecEnforceMfa,
          },
          {
            label: "Allow Google SSO",
            desc: "Users can sign in with Google Workspace accounts",
            state: secGoogleSso,
            setter: setSecGoogleSso,
          },
          {
            label: "Allow Microsoft / Azure AD SSO",
            desc: "Enterprise SSO via Microsoft identity platform",
            state: secMicrosoftSso,
            setter: setSecMicrosoftSso,
          },
          {
            label: "Enforce SSO-only Login",
            desc: "Disable password login when SSO is connected",
            state: secSsoOnly,
            setter: setSecSsoOnly,
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
      </div>

      {/* Policy Block 2: PASSWORD POLICY */}
      <SectionTitle title="Password Policy" />
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              label: "Minimum 8 characters",
              state: secPwMinLen,
              setter: setSecPwMinLen,
            },
            {
              label: "Require uppercase letters (A–Z)",
              state: secPwUpper,
              setter: setSecPwUpper,
            },
            {
              label: "Require numbers and special characters (!@#$)",
              state: secPwNumbers,
              setter: setSecPwNumbers,
            },
            {
              label: "Prevent reuse of last 5 passwords",
              state: secPwPreventReuse,
              setter: setSecPwPreventReuse,
            },
            {
              label: "Force password change on first login",
              state: secPwForceChange,
              setter: setSecPwForceChange,
            },
          ].map((f, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div
                onClick={() => f.setter(!f.state)}
                className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                style={{
                  backgroundColor: f.state ? "#00B87C" : "transparent",
                  borderColor: f.state ? "#00B87C" : "var(--border)",
                }}
              >
                {f.state && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 5"
                    />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontWeight: 500,
                }}
              >
                {f.label}
              </span>
            </label>
          ))}
        </div>

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
              Password Expiry (days)
            </label>
            <input
              type="text"
              value={secPwExpiry}
              onChange={(e) => setSecPwExpiry(e.target.value)}
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
              Max Failed Login Attempts
            </label>
            <input
              type="text"
              value={secMaxFailedAttempts}
              onChange={(e) => setSecMaxFailedAttempts(e.target.value)}
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
              Account Lockout Duration (mins)
            </label>
            <input
              type="text"
              value={secLockoutDuration}
              onChange={(e) => setSecLockoutDuration(e.target.value)}
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
              Lockout Reset Method
            </label>
            <select
              value={secLockoutResetMethod}
              onChange={(e) => setSecLockoutResetMethod(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="Manual by Admin">Manual by Admin ▾</option>
              <option value="Self-service via Email">
                Self-service via Email
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Policy Block 3: SESSION & IP CONTROL */}
      <SectionTitle title="Session & IP Control" />
      <div
        className="p-6 rounded-xl mb-6 space-y-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <div>
          <div className="flex justify-between mb-2">
            <label
              style={{
                color: "var(--foreground)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Idle Timeout
            </label>
            <span style={{ color: "#00B87C", fontWeight: 700 }}>
              {secIdleTimeout} min
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={secIdleTimeout}
            onChange={(e) => setSecIdleTimeout(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: "#00B87C" }}
          />
          <div className="flex justify-between text-[11px] text-var(--muted-foreground) mt-1">
            <span>5 min</span>
            <span>120 min</span>
          </div>
        </div>

        {[
          {
            label: "Enable IP Whitelisting",
            desc: "Restrict login to specific IP address ranges",
            state: secIpWhitelisting,
            setter: setSecIpWhitelisting,
          },
          {
            label: "Log All Login Attempts",
            state: secLogLogins,
            setter: setSecLogLogins,
          },
          {
            label: "Alert on Suspicious Login (new device/location)",
            state: secAlertSuspicious,
            setter: setSecAlertSuspicious,
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

        {secIpWhitelisting && (
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
              Allowed IP Ranges
            </label>
            <textarea
              value={secAllowedIpRanges}
              onChange={(e) => setSecAllowedIpRanges(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none border font-mono"
              style={{
                backgroundColor: "#F9FAFB",
                borderColor: "#E5E7EB",
                color: "#374151",
                height: "80px",
              }}
              placeholder={"192.168.1.0/24\n10.0.0.0/8"}
            />
          </div>
        )}
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center gap-4 pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setActiveModal("reset_defaults")}
          style={{
            backgroundColor: "transparent",
            color: "#9CA3AF",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => showToast("Authentication schemas hardened securely")}
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
          Save Changes
        </button>
      </div>
    </div>
  );
}
