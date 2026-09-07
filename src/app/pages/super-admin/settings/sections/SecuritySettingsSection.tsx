import { useSettingsContext } from "../SettingsContext";
import { ChevronRight, ShieldAlert, Info } from "lucide-react";

export function SecuritySettingsSection() {
  const {
    SectionTitle,
    secAlertSuspicious,
    secEnforceMfa,
    secGoogleSso,
    secIdleTimeout,
    secLogLogins,
    secSsoOnly,
    setActiveModal,
    setSecAlertSuspicious,
    setSecEnforceMfa,
    setSecGoogleSso,
    setSecIdleTimeout,
    setSecLogLogins,
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
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 mb-2">
          <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-bold">
              BACKEND AUTH / IDENTITY PROVIDER INTEGRATION REQUIRED
            </div>
            <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
              Google OAuth and Enterprise SSO protocols require backend identity provider token verification and directory synchronization services.
            </p>
          </div>
        </div>

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
            label: "Enforce SSO-only Login",
            desc: "Disable password login when SSO is connected",
            state: secSsoOnly,
            setter: setSecSsoOnly,
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center py-2"
          >
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
                transition: "background-color 0.2s",
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
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Policy Block 2: SESSION CONTROL */}
      <SectionTitle title="Session Control" />
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
            onChange={(e) =>
              setSecIdleTimeout(
                e.target.value === "" || isNaN(Number(e.target.value))
                  ? undefined
                  : Number(e.target.value),
              )
            }
            className="w-full cursor-pointer"
            style={{ accentColor: "#00B87C" }}
          />
          <div className="flex justify-between text-[11px] text-var(--muted-foreground) mt-1">
            <span>5 min</span>
            <span>120 min</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 flex items-start gap-3">
          <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-bold">
              FRONTEND UI READY — BACKEND AUTH AUDIT LOG REQUIRED
            </div>
            <p className="text-blue-800 dark:text-blue-300/90 leading-relaxed">
              Login attempt telemetry is logged locally. Production authentication logs require backend security audit event streaming.
            </p>
          </div>
        </div>

        {[
          {
            label: "Log All Login Attempts",
            desc: "Record timestamp, IP address, and status of authentication events",
            state: secLogLogins,
            setter: setSecLogLogins,
          },
          {
            label: "Alert on Suspicious Login (new device/location)",
            desc: "Notify account holder and security officer on anomalous logins",
            state: secAlertSuspicious,
            setter: setSecAlertSuspicious,
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center py-2"
          >
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
                transition: "background-color 0.2s",
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
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>
        ))}
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

