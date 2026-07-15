import { useState } from "react";
import { Sprout, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { Progress } from "./Progress";
import { PersonalInformation } from "./PersonalInformation";
import { Documents } from "./Documents";
import { Forms } from "./Forms";

type TabKey = "personal" | "documents" | "forms" | "status";

export function EmployeePortal() {
  const { user } = useAuth();
  const userName = user?.name || "Priya Sharma";
  const userRole = user?.role === "Employee" ? "Frontend Developer" : (user?.role || "Frontend Developer");
  
  // Track tasks completed state locally to compute combined progress
  const [taskState, setTaskState] = useState<Record<string, boolean>>({
    // Personal Info
    addr: true,
    emg: true,
    bank: false,
    nominee: false,
    // Docs
    aadhaar: true,
    degree: true,
    pan: true,
    photo: false,
    // Forms
    nda: true,
    policy: true,
    decl: true,
    sig: false,
  });

  const [activeSubTab, setActiveSubTab] = useState<TabKey>("personal");

  const totalTasks = Object.keys(taskState).length;
  const completedTasks = Object.values(taskState).filter(Boolean).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const handleToggleTask = (id: string, completed: boolean) => {
    setTaskState((prev) => ({
      ...prev,
      [id]: completed,
    }));
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center border border-[#00B87C]/20">
            <Sprout size={24} className="text-[#00B87C]" />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-foreground tracking-tight">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-[13px] font-bold text-muted-foreground">
              {userRole} — Engineering Department
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border text-[12px] font-bold text-muted-foreground">
          <Calendar size={14} className="text-[#00B87C]" />
          Joining Date: <span className="text-foreground">12 Apr 2026</span>
        </div>
      </div>

      {/* PROGRESS TRACKER */}
      <Progress
        completedCount={completedTasks}
        totalCount={totalTasks}
        progressPercent={progressPercent}
      />

      {/* PORTAL NAVIGATION TABS */}
      <div className="flex border-b border-border bg-muted/10 px-4 rounded-xl overflow-x-auto scrollbar-hide shrink-0 gap-2">
        {([
          { key: "personal", label: "Personal Information" },
          { key: "documents", label: "Documents Upload" },
          { key: "forms", label: "Forms & Agreements" },
          { key: "status", label: "Onboarding Status" }
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`px-4 py-3.5 text-[12px] font-black uppercase tracking-wider border-b-2 transition-all relative whitespace-nowrap ${
              activeSubTab === tab.key
                ? "border-[#00B87C] text-[#00B87C]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTAINER */}
      <div className="mt-4">
        {activeSubTab === "personal" && (
          <PersonalInformation onToggle={handleToggleTask} />
        )}
        {activeSubTab === "documents" && (
          <Documents onToggle={handleToggleTask} />
        )}
        {activeSubTab === "forms" && (
          <Forms onToggle={handleToggleTask} />
        )}
        {activeSubTab === "status" && (
          <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-6">
            <div className="pb-2 border-b border-border">
              <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Verification Status</h4>
            </div>
            
            <div className="flex items-start gap-4 p-5 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl">
              <Clock size={20} className="text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[14px] font-black text-foreground">Waiting for HR Verification</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Your uploaded documents and signed forms are in queue. HR will review them and update your onboarding status shortly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-[#00B87C]/10 border border-[#00B87C]/20 rounded-2xl">
              <CheckCircle2 size={20} className="text-[#00B87C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[14px] font-black text-foreground">Account Status: Active</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Your employee portal and credentials have been successfully provisioned.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
