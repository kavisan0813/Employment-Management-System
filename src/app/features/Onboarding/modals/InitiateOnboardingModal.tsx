import { AnimatePresence, motion } from "motion/react";
import {
  UserPlus, Search, X, CheckCircle2, Clock,
  ChevronLeft, ChevronRight, UserCheck, Star, Laptop, Briefcase,
} from "lucide-react";
import type { EmployeeOption } from "../types/onboarding.types";
import { initials } from "../utils/helpers";
import type { Template } from "../types/onboarding.types";
import { EMPLOYEE_OPTIONS } from "../constants/employees";
import { DepartmentBadge } from "../components/shared/DepartmentBadge";

interface InitiateOnboardingModalProps {
  show: boolean;
  onClose: () => void;
  initiateStep: number;
  setInitiateStep: (step: number | ((s: number) => number)) => void;
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string | null) => void;
  formEmployee: string;
  setFormEmployee: (v: string) => void;
  formJoinDate: string;
  setFormJoinDate: (v: string) => void;
  formDept: string;
  setFormDept: (v: string) => void;
  formDesig: string;
  setFormDesig: (v: string) => void;
  formManager: string;
  setFormManager: (v: string) => void;
  formEmpType: string;
  setFormEmpType: (v: string) => void;
  handleLaunchOnboarding: () => void;
  templates: Template[];
  departments: string[];
}

export function InitiateOnboardingModal({
  show, onClose,
  initiateStep, setInitiateStep,
  selectedTemplate, setSelectedTemplate,
  formEmployee, setFormEmployee,
  formJoinDate, setFormJoinDate,
  formDept, setFormDept,
  formDesig, setFormDesig,
  formManager, setFormManager,
  formEmpType, setFormEmpType,
  handleLaunchOnboarding, templates, departments,
}: InitiateOnboardingModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-[32px] w-full max-w-[520px] max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#00B87C]/10 flex items-center justify-center">
                  <UserPlus size={20} className="text-[#00B87C]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground tracking-tight">Initiate New Onboarding</h2>
                  <p className="text-[12px] font-semibold text-muted-foreground">Start the onboarding journey for a new hire</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Step dots */}
            <div className="px-8 py-3 border-b border-border flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all ${initiateStep >= s ? "bg-[#00B87C]" : "bg-border"}`} />
              ))}
              <span className="ml-auto text-[11px] font-bold text-muted-foreground">Step {initiateStep} of 3</span>
            </div>

            {/* Step 1 — Employee Details */}
            {initiateStep === 1 && (
              <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[50vh]">
                <h3 className="text-[13px] font-black text-foreground uppercase tracking-wider">Employee Details</h3>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Select Employee</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search from active employees or new hire records..." value={formEmployee} onChange={(e) => setFormEmployee(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                  </div>
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto bg-muted/20 rounded-xl p-1">
                    {EMPLOYEE_OPTIONS.filter((emp: EmployeeOption) => emp.name.toLowerCase().includes(formEmployee.toLowerCase())).slice(0, 5).map((emp: EmployeeOption) => (
                      <button key={emp.id} onClick={() => { setFormEmployee(emp.name); setFormDesig(emp.role); setFormDept(emp.dept); setFormManager("Suresh Iyer"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-all text-left">
                        <div className="w-7 h-7 rounded-full bg-[#00B87C]/10 flex items-center justify-center text-[#00B87C] text-[9px] font-black">{initials(emp.name)}</div>
                        <div>
                          <p className="text-[12px] font-bold text-foreground">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.role} · {emp.dept}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Joining Date</label>
                    <input type="date" value={formJoinDate} onChange={(e) => setFormJoinDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Department</label>
                    <select value={formDept} onChange={(e) => setFormDept(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all">
                      <option value="">Select department</option>{departments.map((department) => <option key={department} value={department}>{department}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Designation</label>
                  <input type="text" placeholder="e.g. Senior Frontend Developer" value={formDesig} onChange={(e) => setFormDesig(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Reporting Manager</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search employee..." value={formManager} onChange={(e) => setFormManager(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Employment Type</label>
                  <div className="flex gap-2">
                    {["Full-time", "Part-time", "Contract", "Intern"].map((t) => (
                      <button key={t} onClick={() => setFormEmpType(t)} className={`px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${formEmpType === t ? "bg-[#00B87C] text-white border-[#00B87C]" : "border-border hover:bg-muted text-muted-foreground"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Template Selection */}
            {initiateStep === 2 && (
              <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[50vh]">
                <h3 className="text-[13px] font-black text-foreground uppercase tracking-wider">Select Onboarding Template</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {templates.filter((tpl) => tpl.status === "active" && tpl.dept === formDept).map((tpl) => (
                    <div key={tpl.id} onClick={() => setSelectedTemplate(tpl.id)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTemplate === tpl.id ? "border-[#00B87C]" : "border-border hover:border-[#00B87C]/40"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-[13px] font-bold text-foreground">{tpl.name}</h4>
                          <p className="text-[11px] text-muted-foreground">{tpl.phases} phases, {tpl.tasks} tasks</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <DepartmentBadge dept={tpl.dept} color={tpl.deptColor} />
                          {selectedTemplate === tpl.id && <CheckCircle2 size={16} className="text-[#00B87C]" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-muted-foreground">
                        <Clock size={12} /> Avg {tpl.avgDays}
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        Used {tpl.usageCount} times
                      </div>
                    </div>
                  ))}
                  {templates.filter((tpl) => tpl.status === "active" && tpl.dept === formDept).length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No active template matches this department.</p>}
                </div>
              </div>
            )}

            {/* Step 3 — Team Assignments */}
            {initiateStep === 3 && (
              <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[50vh]">
                <h3 className="text-[13px] font-black text-foreground uppercase tracking-wider">Team Assignments</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Assigned HR Owner", icon: UserCheck },
                    { label: "Buddy / Mentor", icon: Star },
                    { label: "IT Contact", icon: Laptop },
                    { label: "Finance Contact", icon: Briefcase },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{field.label}</label>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Notifications</label>
                  <div className="space-y-2">
                    {["Send welcome email to employee", "Notify reporting manager", "Notify IT team for equipment", "Notify Finance for enrollment"].map((n) => (
                      <label key={n} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border accent-[#00B87C]" />
                        <span className="text-[12px] font-bold text-foreground">{n}</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border accent-[#00B87C]" />
                      <span className="text-[12px] font-bold text-foreground">Notify all department heads</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-4 border-t border-border flex items-center justify-between">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted transition-all">Cancel</button>
              <div className="flex items-center gap-3">
                {initiateStep > 1 && (
                  <button onClick={() => setInitiateStep((s: number) => s - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted transition-all">
                    <ChevronLeft size={14} /> Back
                  </button>
                )}
                {initiateStep < 3 ? (
                  <button onClick={() => setInitiateStep((s: number) => s + 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">
                    Next <ChevronRight size={14} />
                  </button>
                ) : (
                  <button onClick={handleLaunchOnboarding} className="px-6 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00B87C]/20">
                    Launch Onboarding
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
