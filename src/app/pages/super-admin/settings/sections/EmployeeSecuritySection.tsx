import { useState } from "react";
import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { showToast } from "../../../../components/workflow/ToastNotification";
import { ToggleRow } from "../components/ToggleRow";
import {
  ShieldCheck,
  Laptop,
  Smartphone,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all pr-12"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export function EmployeeSecuritySection() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFA, setTwoFA] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);

  const sessions = [
    {
      id: 1,
      device: "MacBook Pro · Chrome",
      location: "Chennai, India",
      time: "Today 9:02 AM",
      icon: Laptop,
      color: "var(--primary)",
      bg: "var(--secondary)",
      current: true,
    },
    {
      id: 2,
      device: "iPhone 14 Pro · NexusHR App",
      location: "Chennai, India",
      time: "Apr 5, 2026",
      icon: Smartphone,
      color: "#0EA5E9",
      bg: "#E0F2FE",
      current: false,
    },
    {
      id: 3,
      device: "Windows PC · Chrome",
      location: "Mumbai, India",
      time: "Mar 28, 2026",
      icon: Laptop,
      color: "#8B5CF6",
      bg: "#EDE9FE",
      current: false,
    },
  ];

  const pwStrength = (pw: string) => {
    if (!pw)
      return {
        level: 0,
        label: "Enter a password",
        color: "var(--muted-foreground)",
      };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[!@#$%^&*]/.test(pw)) s++;
    const getLabel = (v: number): string => {
      switch (v) {
        case 1:
          return "Weak";
        case 2:
          return "Fair";
        case 3:
          return "Good";
        case 4:
          return "Strong";
        default:
          return "";
      }
    };
    const getColor = (v: number): string => {
      switch (v) {
        case 1:
          return "#EF4444";
        case 2:
          return "#F59E0B";
        case 3:
          return "#3B82F6";
        case 4:
          return "var(--primary)";
        default:
          return "var(--muted-foreground)";
      }
    };
    return { level: s, label: getLabel(s), color: getColor(s) };
  };

  const strength = pwStrength(newPw);
  const pwMatch = confirmPw ? newPw === confirmPw : null;

  return (
    <div>
      <Breadcrumb active="Account & Security" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Account & Security
      </h2>

      {/* Change Password */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-8">
        <Label>UPDATE YOUR PASSWORD</Label>
        <div className="space-y-5 max-w-lg">
          <PasswordField
            label="Current Password"
            value={currentPw}
            onChange={setCurrentPw}
            show={showPw.current}
            onToggle={() => setShowPw({ ...showPw, current: !showPw.current })}
          />
          <div>
            <PasswordField
              label="New Password"
              value={newPw}
              onChange={setNewPw}
              show={showPw.new}
              onToggle={() => setShowPw({ ...showPw, new: !showPw.new })}
            />
            <div className="flex items-center gap-2 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      i <= strength.level ? strength.color : "var(--border)",
                  }}
                />
              ))}
              <span
                className="text-[11px] font-bold ml-1"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          </div>
          <div>
            <PasswordField
              label="Confirm New Password"
              value={confirmPw}
              onChange={setConfirmPw}
              show={showPw.confirm}
              onToggle={() =>
                setShowPw({ ...showPw, confirm: !showPw.confirm })
              }
            />
            {pwMatch !== null && (
              <p
                className={`text-[12px] font-bold mt-1.5 ${pwMatch ? "text-primary" : "text-rose-500"}`}
              >
                {pwMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
          </div>
        </div>
        <ul className="mt-4 space-y-1 text-[12px] font-bold text-muted-foreground">
          <li>• Minimum 8 characters</li>
          <li>• At least 1 uppercase letter</li>
          <li>• At least 1 number</li>
          <li>• At least 1 special character (!@#$)</li>
        </ul>
        <button
          onClick={() =>
            showToast(
              "Password Updated",
              "success",
              "Password updated successfully!",
            )
          }
          className="mt-6 w-full max-w-lg py-3.5 rounded-xl bg-primary text-white font-black text-[14px] shadow-lg shadow-[#00B87C]/20 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-8">
        <div className="flex items-center justify-between mb-5">
          <Label>TWO-FACTOR AUTHENTICATION (2FA)</Label>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider border border-primary/20">
            {twoFA ? "ENABLED" : "DISABLED"}
          </span>
        </div>
        {twoFA && (
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 mb-6">
            <div className="flex items-center gap-2 text-[13px] font-black text-primary mb-1">
              <ShieldCheck size={16} /> 2FA is active — your account is
              protected
            </div>
            <p className="text-[13px] font-bold text-muted-foreground">
              ● Authenticator App (Google Authenticator)
            </p>
            <p className="text-[12px] font-bold text-muted-foreground/60">
              Last used: Apr 5, 2026 at 9:15 AM
            </p>
          </div>
        )}
        <div className="space-y-5 max-w-lg">
          <ToggleRow
            label="Enable Two-Factor Authentication"
            desc="Requires a second verification step on login"
            on={twoFA}
            onChange={setTwoFA}
          />
          <div className="flex items-center justify-between py-2 px-4 rounded-2xl bg-background border border-border">
            <div>
              <p className="text-[14px] font-bold text-foreground">
                Backup Codes
              </p>
              <p className="text-[12px] font-bold text-muted-foreground">
                8 backup codes available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl border border-primary text-primary text-[11px] font-black hover:bg-primary/10 transition-all">
                View Codes
              </button>
              <button className="text-[12px] font-bold text-muted-foreground hover:text-foreground transition-all">
                Regenerate
              </button>
            </div>
          </div>
          <ToggleRow
            label="Remember this device for 30 days"
            desc="Skip 2FA on trusted devices"
            on={rememberDevice}
            onChange={setRememberDevice}
          />
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <Label>YOUR ACTIVE LOGIN SESSIONS</Label>
        <div className="space-y-1">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 py-3.5 px-3 rounded-2xl hover:bg-secondary transition-colors border-b border-border/50 last:border-b-0"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: s.bg }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-foreground truncate">
                    {s.device}
                  </p>
                  <p className="text-[12px] font-bold text-muted-foreground truncate">
                    {s.location} · {s.time}
                  </p>
                </div>
                {s.current ? (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider border border-primary/20 shrink-0">
                    This device
                  </span>
                ) : (
                  <button className="text-[12px] font-black text-rose-500 hover:underline shrink-0">
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button className="mt-4 text-[12px] font-black text-rose-500 hover:underline flex items-center gap-2">
          <LogOut size={14} /> Sign Out of All Other Devices
        </button>
      </div>
    </div>
  );
}
