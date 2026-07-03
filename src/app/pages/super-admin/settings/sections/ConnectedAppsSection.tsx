import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function ConnectedAppsSection() {
  const { setActiveModal, showToast } = useSettingsContext();

  const connected = [
    {
      name: "Google Workspace",
      desc: "Calendar, Drive and SSO sync",
      initials: "G",
      color: "#4285F4",
      sync: "Last sync: 2 mins ago",
    },
    {
      name: "Slack",
      desc: "Team notifications and alerts",
      initials: "S",
      color: "#611F69",
      sync: "Last sync: 1 hour ago",
    },
    {
      name: "Zoom",
      desc: "Meeting and interview scheduler",
      initials: "Z",
      color: "#00B9FF",
      sync: "Last sync: 5 hours ago",
    },
  ];

  const available = [
    {
      name: "Microsoft 365",
      desc: "Teams, Outlook and Azure AD",
      initials: "M",
      color: "#0078D4",
    },
    {
      name: "Jira",
      desc: "Project and task tracking sync",
      initials: "J",
      color: "#0052CC",
    },
    {
      name: "QuickBooks",
      desc: "Payroll and finance sync",
      initials: "Q",
      color: "#2CA01C",
    },
    {
      name: "DocuSign",
      desc: "E-signature for HR documents",
      initials: "D",
      color: "#FF6B00",
    },
    {
      name: "LinkedIn Talent",
      desc: "Recruitment and job posting",
      initials: "in",
      color: "#0A66C2",
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Connected Apps</span>
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
            Connected Apps
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Manage third-party integrations and OAuth connections
          </p>
        </div>
      </div>

      {/* Section: CONNECTED */}
      <div className="flex items-center gap-2 mt-6 mb-4">
        <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--muted-foreground)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Connected
        </span>
        <span
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#10B981",
            padding: "2px 8px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          3 Active
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {connected.map((app, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl flex flex-col justify-between transition-all hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                  style={{ backgroundColor: app.color }}
                >
                  {app.initials}
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {app.name}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {app.desc}
                  </span>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "#10B981",
                  padding: "2px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Connected
              </span>
            </div>
            <div
              className="flex justify-between items-center mt-4 pt-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                {app.sync}
              </span>
              <button
                onClick={() => setActiveModal("manage_connected_app")}
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
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section: AVAILABLE INTEGRATIONS */}
      <div className="flex items-center gap-2 mt-6 mb-4">
        <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--muted-foreground)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Available Integrations
        </span>
        <span
          style={{
            backgroundColor: "var(--muted)",
            color: "var(--muted-foreground)",
            padding: "2px 8px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          Not Connected
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {available.map((app, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl flex flex-col justify-between transition-all hover:shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                  style={{ backgroundColor: app.color }}
                >
                  {app.initials}
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {app.name}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {app.desc}
                  </span>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: "var(--muted)",
                  color: "var(--muted-foreground)",
                  padding: "2px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Not Connected
              </span>
            </div>
            <div
              className="flex justify-end items-center mt-4 pt-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <button
                onClick={() => showToast("Connection established securely")}
                style={{
                  backgroundColor: "#00B87C",
                  border: "none",
                  borderRadius: "8px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
