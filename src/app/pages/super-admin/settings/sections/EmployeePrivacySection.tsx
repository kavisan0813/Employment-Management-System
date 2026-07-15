import { useState } from "react";
import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { showToast } from "../../../../components/workflow/ToastNotification";
import { ToggleRow } from "../components/ToggleRow";
import { AlertTriangle } from "lucide-react";

export function EmployeePrivacySection({
  onModal,
}: {
  onModal: (m: string | null) => void;
}) {
  const [toggles, setToggles] = useState({
    showPhone: false,
    showEmail: true,
    showDob: false,
    showLinkedin: true,
    showBlood: false,
    showSchedule: true,
    showOnline: true,
    allowPerformanceData: true,
    receiveBirthdayWishes: true,
    salaryManager: true,
    salaryFinance: true,
    loginActivity: true,
  });
  const toggle = (key: keyof typeof toggles) => {
    if (["salaryManager", "salaryFinance", "loginActivity"].includes(key))
      return;
    setToggles({ ...toggles, [key]: !toggles[key] });
    showToast("Privacy Updated", "success", "Privacy setting updated.");
  };

  return (
    <div>
      <Breadcrumb active="Privacy" />
      <h2 className="text-[22px] font-black text-foreground mb-6">
        Privacy Settings
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>PROFILE VISIBILITY</Label>
        <p className="text-[13px] font-bold text-muted-foreground mb-5">
          Control what information colleagues can see in the Team Directory
        </p>
        <div className="space-y-1 max-w-lg">
          <ToggleRow
            label="Show my phone number to colleagues"
            desc="Team Directory will hide your mobile number"
            on={toggles.showPhone}
            onChange={() => toggle("showPhone")}
          />
          <ToggleRow
            label="Show my email to colleagues"
            desc="Work email always visible. Personal email follows this setting"
            on={toggles.showEmail}
            onChange={() => toggle("showEmail")}
          />
          <ToggleRow
            label="Show my date of birth"
            desc="Birthday reminders depend on this setting"
            on={toggles.showDob}
            onChange={() => toggle("showDob")}
          />
          <ToggleRow
            label="Show my LinkedIn profile"
            on={toggles.showLinkedin}
            onChange={() => toggle("showLinkedin")}
          />
          <ToggleRow
            label="Show my blood group"
            desc="Only HR and emergency contacts can see this"
            on={toggles.showBlood}
            onChange={() => toggle("showBlood")}
          />
          <ToggleRow
            label="Allow colleagues to see my work schedule"
            desc="Team members can see your shift timings"
            on={toggles.showSchedule}
            onChange={() => toggle("showSchedule")}
          />
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 mb-6">
        <Label>
          <span className="text-amber-500">SALARY PRIVACY</span>
        </Label>
        <div className="space-y-3 max-w-lg">
          <ToggleRow
            label="Show my salary to my manager"
            desc="Managers can always see their team's salary (company policy)"
            on={toggles.salaryManager}
            onChange={() => {}}
            disabled
          />
          <p className="text-[12px] font-bold text-amber-500 flex items-center gap-1">
            <AlertTriangle size={12} /> This setting is controlled by HR policy
          </p>
          <ToggleRow
            label="Show my salary details to Finance team"
            desc="Finance requires this for payroll processing"
            on={toggles.salaryFinance}
            onChange={() => {}}
            disabled
          />
          <p className="text-[12px] font-bold text-amber-500 flex items-center gap-1">
            <AlertTriangle size={12} /> Required for payroll — cannot be
            disabled
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
        <Label>ACTIVITY & DATA VISIBILITY</Label>
        <div className="space-y-1 max-w-lg">
          <ToggleRow
            label="Show my online status (green dot)"
            desc="Colleagues see when you're active in the system"
            on={toggles.showOnline}
            onChange={() => toggle("showOnline")}
          />
          <ToggleRow
            label="Allow HR to see my login activity"
            desc="HR can view login times for attendance purposes"
            on={toggles.loginActivity}
            onChange={() => {}}
            disabled
          />
          <p className="text-[12px] font-bold text-amber-500 flex items-center gap-1">
            <AlertTriangle size={12} /> Required by company policy
          </p>
          <ToggleRow
            label="Allow performance data to be used in team reports"
            desc="Your anonymized performance contributes to team analytics"
            on={toggles.allowPerformanceData}
            onChange={() => toggle("allowPerformanceData")}
          />
          <ToggleRow
            label="Receive birthday wishes from colleagues"
            desc="Colleagues are notified on your birthday"
            on={toggles.receiveBirthdayWishes}
            onChange={() => toggle("receiveBirthdayWishes")}
          />
        </div>
      </div>

      <Label>DATA REQUESTS</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
          <p className="text-[15px] font-black text-foreground mb-1">
            Request a copy of my data
          </p>
          <p className="text-[12px] font-bold text-muted-foreground mb-5">
            Download all your personal data stored in viyanHR
          </p>
          <button
            className="px-5 py-2.5 rounded-xl border border-primary text-primary text-[12px] font-black hover:bg-primary/10 transition-all active:scale-95"
            onClick={() =>
              showToast(
                "Export Requested",
                "success",
                "Your data export request has been submitted. You'll receive an email within 48 hours.",
              )
            }
          >
            Request Download
          </button>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl shadow-sm p-8">
          <p className="text-[15px] font-black text-rose-500 mb-1">
            Request data deletion
          </p>
          <p className="text-[12px] font-bold text-muted-foreground mb-5">
            Request removal of personal data (subject to HR policy)
          </p>
          <button
            className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-[12px] font-black hover:bg-rose-600 transition-all active:scale-95"
            onClick={() => onModal("deletion")}
          >
            Request Deletion
          </button>
        </div>
      </div>
    </div>
  );
}
