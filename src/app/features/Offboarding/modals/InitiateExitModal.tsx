import React, { useState } from "react";
import { motion } from "motion/react";
import { LogOut, X, Search, Calendar, CheckCircle2 } from "lucide-react";
import { ExitType } from "../types/offboarding.types";
import { showToast } from "../../../components/workflow/ToastNotification";

// Local Active Employees mockup for the modal list
const ACTIVE_EMPLOYEES = [
  {
    id: "ae1",
    name: "Vikram Malhotra",
    role: "Product Manager",
    dept: "Product",
  },
  { id: "ae2", name: "Neha Sen", role: "Senior HR Specialist", dept: "HR" },
  { id: "ae3", name: "Kunal Kapoor", role: "Data Engineer", dept: "Analytics" },
  { id: "ae4", name: "Ananya Roy", role: "Content Writer", dept: "Marketing" },
  {
    id: "ae5",
    name: "Amit Goel",
    role: "Infrastructure Architect",
    dept: "IT",
  },
];

interface InitiateExitModalProps {
  onClose: () => void;
  onInitiate: (
    name: string,
    type: ExitType,
    lwd: string,
    noticeDays: number,
  ) => void;
}

export const InitiateExitModal: React.FC<InitiateExitModalProps> = ({
  onClose,
  onInitiate,
}) => {
  const [exitType, setExitType] = useState<ExitType>("Resignation");
  const [step, setStep] = useState<"form" | "preview" | "success">("form");

  const [empName, setEmpName] = useState("");
  const [lwdDate, setLwdDate] = useState("");
  const [resDate, setResDate] = useState("2026-04-06");
  const [noticeDays, setNoticeDays] = useState(30);
  const [hrOwner, setHrOwner] = useState("");

  const exitTypes: ExitType[] = [
    "Resignation",
    "Retirement",
    "Termination",
    "Contract End",
    "Other",
  ];
  const reasonCategories = [
    "Personal",
    "Career Growth",
    "Relocation",
    "Work Culture",
    "Compensation",
    "Health",
    "Education",
    "Other",
  ];

  if (step === "success") {
    return (
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-card rounded-[32px] p-10 text-center shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-[#00B87C]" />
          </div>
          <h3 className="text-lg font-black text-foreground tracking-tight mb-2">
            Exit Initiated Successfully
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mb-6">
            Checklist tasks have been auto-assigned and notifications sent.
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-[#00B87C] text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[520px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
              <LogOut size={20} className="text-[#EF4444]" />
            </div>
            <h3 className="text-[18px] font-bold text-foreground tracking-tight">
              Initiate Employee Exit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Employee Search */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              SELECT EMPLOYEE
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search employee name..."
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
              />
            </div>
            {empName && (
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto bg-muted/20 rounded-xl p-1">
                {ACTIVE_EMPLOYEES.filter((emp) =>
                  emp.name.toLowerCase().includes(empName.toLowerCase()),
                ).map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setEmpName(emp.name);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] text-[9px] font-black">
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">
                        {emp.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {emp.role} · {emp.dept}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Exit Type */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              EXIT TYPE
            </label>
            <div className="flex flex-wrap gap-2">
              {exitTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setExitType(t)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                    exitType === t
                      ? "bg-[#00B87C] text-white border-[#00B87C]"
                      : "bg-card text-muted-foreground border-border hover:border-[#00B87C]/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
                LAST WORKING DATE
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="date"
                  value={lwdDate}
                  onChange={(e) => setLwdDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
                RESIGNATION DATE
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="date"
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Notice Period */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              NOTICE PERIOD (DAYS)
            </label>
            <input
              type="number"
              value={noticeDays}
              onChange={(e) => setNoticeDays(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
            />
          </div>

          {/* Reason Category */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              REASON CATEGORY
            </label>
            <div className="flex flex-wrap gap-2">
              {reasonCategories.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold text-muted-foreground hover:border-[#00B87C]/30 hover:text-foreground transition-all"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Details */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              REASON DETAILS (OPTIONAL)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
              placeholder="Add details..."
            />
          </div>

          {/* Assigned HR Owner */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              ASSIGNED HR OWNER
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search HR employee..."
                value={hrOwner}
                onChange={(e) => setHrOwner(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all"
              />
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 block">
              SEND NOTIFICATIONS TO
            </label>
            <div className="space-y-2.5">
              {[
                {
                  label: "Employee (confirmation email)",
                  defaultChecked: true,
                },
                { label: "Direct Manager", defaultChecked: true },
                {
                  label: "IT Team (access deactivation reminder)",
                  defaultChecked: true,
                },
                {
                  label: "Finance (F&F settlement kickoff)",
                  defaultChecked: true,
                },
                { label: "All Department Heads", defaultChecked: false },
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="w-4 h-4 rounded border-border text-[#00B87C] focus:ring-[#00B87C]"
                  />
                  <span className="text-[12px] font-bold text-foreground">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("preview")}
              className="px-5 py-2.5 rounded-xl border border-border text-[12px] font-black text-foreground uppercase tracking-widest hover:bg-muted transition-all"
            >
              Preview Checklist
            </button>
            <button
              onClick={() => {
                if (!empName.trim()) {
                  showToast(
                    "Validation Error",
                    "error",
                    "Please select or enter an employee name.",
                  );
                  return;
                }
                onInitiate(empName, exitType, lwdDate, noticeDays);
                setStep("success");
              }}
              className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[12px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20"
            >
              Initiate Exit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
