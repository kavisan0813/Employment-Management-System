import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function ApiSettingsSection() {
  const {
    SectionTitle,
    apiAllowedIp,
    apiConcurrent,
    apiIpWhite,
    apiLog,
    apiRateLimit,
    apiRest,
    apiTokenExp,
    apiVersion,
    apiWebhook,
    setActiveModal,
    setApiAllowedIp,
    setApiConcurrent,
    setApiIpWhite,
    setApiLog,
    setApiRateLimit,
    setApiRest,
    setApiTokenExp,
    setApiVersion,
    setApiWebhook,
    showToast,
  } = useSettingsContext();

  const keys = [
    {
      value: "nxhr_live_••••••••••••••••••••••3f9a",
      type: "Production",
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.1)",
      created: "Jan 1, 2026",
    },
    {
      value: "nxhr_test_••••••••••••••b2c4",
      type: "Sandbox",
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
      created: "Mar 1, 2026",
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>API Settings</span>
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
            API Settings
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Manage API keys and developer access
          </p>
        </div>
        <button
          onClick={() => setActiveModal("generate_key")}
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
          + Generate Key
        </button>
      </div>

      {/* Policy Block 1: ACTIVE API KEYS */}
      <SectionTitle title="Active API Keys" />
      <div className="space-y-3 mb-6">
        {keys.map((k, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4"
            style={{
              backgroundColor: "var(--input-background)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                {k.value}
              </span>
              <span
                style={{
                  backgroundColor: k.bg,
                  color: k.color,
                  padding: "2px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {k.type}
              </span>
              <span
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                Created: {k.created}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => showToast("Token revealed dynamically")}
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                Reveal
              </button>
              <button
                onClick={() =>
                  showToast("API secret hashed to clipboard buffer")
                }
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                Copy
              </button>
              <button
                onClick={() => setActiveModal("revoke_api_key")}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #EF4444",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#EF4444",
                  cursor: "pointer",
                }}
              >
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Block 2: API CONFIGURATION */}
      <SectionTitle title="API Configuration" />
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
            label: "Enable REST API Access",
            state: apiRest,
            setter: setApiRest,
          },
          {
            label: "Require IP Whitelisting for API",
            state: apiIpWhite,
            setter: setApiIpWhite,
          },
          {
            label: "Enable Webhook Delivery",
            state: apiWebhook,
            setter: setApiWebhook,
          },
          { label: "Log All API Requests", state: apiLog, setter: setApiLog },
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
              Rate Limit (requests/min)
            </label>
            <input
              type="text"
              value={apiRateLimit}
              onChange={(e) => setApiRateLimit(e.target.value)}
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
              Token Expiry (hours)
            </label>
            <input
              type="text"
              value={apiTokenExp}
              onChange={(e) => setApiTokenExp(e.target.value)}
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
              Max Concurrent Connections
            </label>
            <input
              type="text"
              value={apiConcurrent}
              onChange={(e) => setApiConcurrent(e.target.value)}
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
              API Version
            </label>
            <select
              value={apiVersion}
              onChange={(e) => setApiVersion(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="v2 (latest)">v2 (latest) ▾</option>
              <option value="v1">v1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policy Block 3: ALLOWED IP RANGES (API) */}
      <SectionTitle title="Allowed IP Ranges (API)" />
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <textarea
          value={apiAllowedIp}
          onChange={(e) => setApiAllowedIp(e.target.value)}
          className="w-full rounded-xl px-3 py-2 text-sm outline-none border font-mono"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            height: "80px",
          }}
          placeholder="Enter IP ranges, one per line..."
        />
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => showToast("API policies enforced")}
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
