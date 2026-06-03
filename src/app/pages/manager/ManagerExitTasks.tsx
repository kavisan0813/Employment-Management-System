import { useState } from "react";
import {
  LogOut,
  CheckCircle2,
  X,
  FileText,
  Download,
  User,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Types ─── */
type ExitType = "Resignation" | "Termination" | "Retirement";
type TaskStatus = "done" | "pending";

interface ManagerTask {
  id: string;
  label: string;
  assignedTo: string;
  dueDate: string;
  status: TaskStatus;
  actionLabel?: string;
  actionType?: "link" | "btn" | "signoff";
}

interface ExitMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  type: ExitType;
  lwd: string;
  initial: string;
  tasks: ManagerTask[];
}

/* ─── Mock Data ─── */
const EXIT_MEMBERS: ExitMember[] = [
  {
    id: "e1",
    name: "James Carter",
    designation: "Senior Finance Analyst",
    department: "Finance",
    type: "Resignation",
    lwd: "Apr 10, 2026",
    initial: "JC",
    tasks: [
      { id: "t1", label: "Accept resignation letter", assignedTo: "You", dueDate: "Done Apr 2", status: "done" },
      { id: "t2", label: "Confirm last working date", assignedTo: "You", dueDate: "Done Apr 2", status: "done" },
      { id: "t3", label: "Create knowledge transfer plan", assignedTo: "You", dueDate: "Due Apr 7", status: "pending", actionLabel: "Create Plan", actionType: "link" },
      { id: "t4", label: "Complete knowledge transfer", assignedTo: "You", dueDate: "Due Apr 9", status: "pending", actionLabel: "Mark Done", actionType: "btn" },
      { id: "t5", label: "Sign manager clearance", assignedTo: "You", dueDate: "Due Apr 10", status: "pending", actionLabel: "Sign Off", actionType: "signoff" },
      { id: "t6", label: "Write recommendation (optional)", assignedTo: "You", dueDate: "—", status: "pending", actionLabel: "Write", actionType: "link" },
    ],
  },
  {
    id: "e2",
    name: "Ravi Kumar",
    designation: "Marketing Lead",
    department: "Marketing",
    type: "Resignation",
    lwd: "Apr 20, 2026",
    initial: "RK",
    tasks: [
      { id: "t7", label: "Accept resignation letter", assignedTo: "You", dueDate: "Done Mar 26", status: "done" },
      { id: "t8", label: "Confirm last working date", assignedTo: "You", dueDate: "Done Mar 26", status: "done" },
      { id: "t9", label: "Create knowledge transfer plan", assignedTo: "You", dueDate: "Due Apr 5", status: "done", actionLabel: "View Plan", actionType: "link" },
      { id: "t10", label: "Complete knowledge transfer", assignedTo: "You", dueDate: "Due Apr 15", status: "pending", actionLabel: "Mark Done", actionType: "btn" },
      { id: "t11", label: "Sign manager clearance", assignedTo: "You", dueDate: "Due Apr 18", status: "pending", actionLabel: "Sign Off", actionType: "signoff" },
    ],
  },
];

const exitTypeChip = (type: ExitType) => {
  switch (type) {
    case "Resignation":
      return <span className="inline-flex px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C] border border-[#A7F3D0] text-[10px] font-black uppercase tracking-wider">Resignation</span>;
    case "Termination":
      return <span className="inline-flex px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] text-[10px] font-black uppercase tracking-wider">Termination</span>;
    case "Retirement":
      return <span className="inline-flex px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0D9488] border border-[#99F6E4] text-[10px] font-black uppercase tracking-wider">Retirement</span>;
  }
};

/* ─── Main Component ─── */
export function ManagerExitTasks() {
  const [showKTModal, setShowKTModal] = useState<string | null>(null);
  const [showSignOff, setShowSignOff] = useState<string | null>(null);
  const [showWriteModal, setShowWriteModal] = useState<string | null>(null);
  const [members, setMembers] = useState<ExitMember[]>(EXIT_MEMBERS);
  const [ktPlans, setKtPlans] = useState<Record<string, Record<string, string>>>({});

  const totalTasks = members.reduce((s, m) => s + m.tasks.length, 0);
  const doneTasks = members.reduce((s, m) => s + m.tasks.filter(t => t.status === "done").length, 0);

  const handleToggleTask = (memberId: string, taskId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      return {
        ...m,
        tasks: m.tasks.map(t =>
          t.id === taskId
            ? { ...t, status: t.status === "done" ? "pending" : "done" as TaskStatus }
            : t
        ),
      };
    }));
  };

  const handleMarkDone = (memberId: string, taskId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      return {
        ...m,
        tasks: m.tasks.map(t =>
          t.id === taskId ? { ...t, status: "done" as TaskStatus, dueDate: `Done ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}` } : t
        ),
      };
    }));
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] shadow-sm border border-red-100">
            <LogOut size={28} />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">Team Exit Tasks</h1>
            <p className="text-[13px] font-bold text-muted-foreground">Your responsibilities for team member exits</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm w-fit">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[12px] font-black text-amber-500 uppercase tracking-widest">Manager Access</span>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap items-center gap-6 mb-8 px-5 py-3 bg-card border border-[#FDE68A] rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[13px] font-bold text-foreground">James Carter (Finance) is exiting Apr 10 — {members.find(m => m.name === "James Carter")?.tasks.filter(t => t.status === "pending").length} tasks need your action</span>
        </div>
      </div>

      {/* ACTIVE EXIT TASKS */}
      <div className="bg-card border border-border rounded-[24px] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/10 flex items-center justify-between">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            MY EXIT RESPONSIBILITIES
          </h3>
          <span className="text-[11px] font-black text-[#00B87C]">{doneTasks}/{totalTasks} tasks completed</span>
        </div>

        <div className="divide-y divide-border">
          {members.map((member) => {
            const progress = Math.round((member.tasks.filter(t => t.status === "done").length / member.tasks.length) * 100);
            return (
              <div key={member.id} className="p-6">
                <div
                  className="rounded-2xl border border-border overflow-hidden"
                  style={{ borderLeft: `3px solid ${member.tasks.filter(t => t.status === "pending").length >= 3 ? "#EF4444" : "#F59E0B"}` }}
                >
                  {/* Employee Header */}
                  <div className="flex items-center gap-4 p-5 pb-3 bg-[#FFFDF5] border-b border-border">
                    <div className="w-9 h-9 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] font-black text-sm shrink-0">
                      {member.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-foreground">{member.name}</h4>
                      <p className="text-[12px] font-medium text-muted-foreground">{member.designation}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#8B5CF6] text-[10px] font-black uppercase tracking-wider">LWD: {member.lwd}</span>
                      {exitTypeChip(member.type)}
                    </div>
                  </div>

                  {/* Task Checklist */}
                  <div className="divide-y divide-border">
                    {member.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-[#F0FDF4]/40 transition-colors cursor-pointer group"
                        style={{ minHeight: "44px" }}
                      >
                        <button
                          onClick={() => handleToggleTask(member.id, task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            task.status === "done"
                              ? "bg-[#00B87C] border-[#00B87C]"
                              : "border-muted-foreground/40 hover:border-[#00B87C]"
                          }`}
                        >
                          {task.status === "done" && <Check size={12} className="text-white" strokeWidth={3} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-bold ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {task.label}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground">{task.assignedTo}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                            task.status === "done"
                              ? "text-[#00B87C] bg-[#DCFCE7]"
                              : task.dueDate.startsWith("Due")
                              ? "text-amber-500 bg-[#FEF3C7]"
                              : "text-muted-foreground bg-muted"
                          }`}>
                            {task.dueDate}
                          </span>

                          {task.status !== "done" && task.actionType === "link" && (
                            <button
                              onClick={() => {
                                if (task.id === "t3") setShowKTModal(member.id);
                                else if (task.id === "t6") setShowWriteModal(member.id);
                                else handleMarkDone(member.id, task.id);
                              }}
                              className="text-[11px] font-black text-[#00B87C] hover:underline whitespace-nowrap"
                            >
                              {task.actionLabel} →
                            </button>
                          )}

                          {task.status !== "done" && task.actionType === "btn" && (
                            <button
                              onClick={() => handleMarkDone(member.id, task.id)}
                              className="px-3 py-1.5 rounded-lg border border-[#00B87C]/30 text-[#00B87C] text-[10px] font-black uppercase tracking-wider hover:bg-[#00B87C]/5 transition-all whitespace-nowrap"
                            >
                              {task.actionLabel}
                            </button>
                          )}

                          {task.status !== "done" && task.actionType === "signoff" && (
                            <button
                              onClick={() => setShowSignOff(member.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#00B87C] text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-all whitespace-nowrap shadow-sm"
                            >
                              {task.actionLabel}
                            </button>
                          )}

                          {task.status === "done" && (
                            <div className="flex items-center gap-2">
                              {(task.id === "t3" || task.id === "t9") && (
                                <button
                                  onClick={() => setShowKTModal(member.id)}
                                  className="text-[11px] font-black text-[#00B87C] hover:underline whitespace-nowrap"
                                >
                                  View Plan →
                                </button>
                              )}
                              <CheckCircle2 size={16} className="text-[#00B87C]" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="px-5 py-3 bg-[#F0FDF4]/30 border-t border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Overall Manager Progress</span>
                      <span className="text-[10px] font-black text-[#00B87C]">{member.tasks.filter(t => t.status === "done").length}/{member.tasks.length} tasks</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00B87C] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── KNOWLEDGE TRANSFER MODAL ─── */}
      <AnimatePresence>
        {showKTModal && (
          <KTModal
            memberName={members.find(m => m.id === showKTModal)?.name || ""}
            onClose={() => setShowKTModal(null)}
            onSave={(formData) => {
              const mid = showKTModal;
              const tid = members.find(m => m.id === mid)?.tasks.find(t => t.actionType === "link" && t.label.startsWith("Create"))?.id;
              if (tid) {
                setKtPlans(prev => ({ ...prev, [mid]: formData }));
                handleMarkDone(mid, tid);
              }
              setShowKTModal(null);
            }}
            initialData={ktPlans[showKTModal] || undefined}
          />
        )}
      </AnimatePresence>

      {/* ─── SIGN OFF MODAL ─── */}
      <AnimatePresence>
        {showSignOff && (
          <SignOffModal
            memberName={members.find(m => m.id === showSignOff)?.name || ""}
            onClose={() => setShowSignOff(null)}
            onConfirm={() => {
              const mid = showSignOff;
              const tid = members.find(m => m.id === mid)?.tasks.find(t => t.actionType === "signoff")?.id;
              if (tid) handleMarkDone(mid, tid);
              setShowSignOff(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── WRITE RECOMMENDATION MODAL ─── */}
      <AnimatePresence>
        {showWriteModal && (
          <WriteRecommendationModal
            memberName={members.find(m => m.id === showWriteModal)?.name || ""}
            onClose={() => setShowWriteModal(null)}
            onSave={() => {
              const mid = showWriteModal;
              const tid = members.find(m => m.id === mid)?.tasks.find(t => t.actionType === "link" && t.label.startsWith("Write"))?.id;
              if (tid) handleMarkDone(mid, tid);
              setShowWriteModal(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── KNOWLEDGE TRANSFER MODAL ─── */
function KTModal({ memberName, onClose, onSave, initialData }: { memberName: string; onClose: () => void; onSave?: (data: Record<string, string>) => void; initialData?: Record<string, string> }) {
  const isViewOnly = !!initialData;
  const [ktForm, setKtForm] = useState<Record<string, string>>(() => ({
    ongoingProjects: initialData?.ongoingProjects || "",
    keyContacts: initialData?.keyContacts || "",
    systemCredentials: initialData?.systemCredentials || "",
    pendingTasks: initialData?.pendingTasks || "",
    handoverPerson: initialData?.handoverPerson || "",
  }));

  const handleDownload = () => {
    const content = [
      `Knowledge Transfer Plan — ${memberName}`,
      "",
      "━━━ Ongoing Projects ━━━",
      ktForm.ongoingProjects || "N/A",
      "",
      "━━━ Key Contacts ━━━",
      ktForm.keyContacts || "N/A",
      "",
      "━━━ System Credentials ━━━",
      ktForm.systemCredentials || "N/A",
      "",
      "━━━ Pending Tasks ━━━",
      ktForm.pendingTasks || "N/A",
      "",
      "━━━ Handover Person ━━━",
      ktForm.handoverPerson || "N/A",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KT-Plan-${memberName.replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sections = [
    { key: "ongoingProjects", label: "Ongoing Projects", placeholder: "List current projects, their status, and next steps..." },
    { key: "keyContacts", label: "Key Contacts", placeholder: "Client names, stakeholder contacts, vendor info..." },
    { key: "systemCredentials", label: "System Credentials", placeholder: "URLs, login info, access permissions (encrypted)..." },
    { key: "pendingTasks", label: "Pending Tasks", placeholder: "Open tickets, pending deliverables, upcoming deadlines..." },
    { key: "handoverPerson", label: "Handover Person", placeholder: "Who will take over responsibilities after exit..." },
  ];

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-[500px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
              <FileText size={18} className="text-[#00B87C]" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground tracking-tight">Knowledge Transfer Plan — {memberName}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
          {sections.map((section, i) => (
            <div key={i}>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">{section.label}</label>
              <textarea
                rows={3}
                value={ktForm[section.key]}
                onChange={(e) => setKtForm(prev => ({ ...prev, [section.key]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
                placeholder={section.placeholder}
                readOnly={isViewOnly}
              />
            </div>
          ))}
        </div>
        <div className="px-6 py-5 border-t border-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
          >
            {isViewOnly ? "Close" : "Cancel"}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl border border-border text-[11px] font-black text-foreground uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-1.5"
            >
              <Download size={14} /> {isViewOnly ? "Download" : "Download PDF"}
            </button>
            {!isViewOnly && (
              <button
                onClick={() => {
                  if (onSave) onSave(ktForm);
                  else onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
              >
                Save Plan
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── SIGN OFF CONFIRMATION MODAL ─── */
function SignOffModal({ memberName, onClose, onConfirm }: { memberName: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-card rounded-[32px] p-8 text-center shadow-2xl border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
          <LogOut size={24} className="text-[#00B87C]" />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Sign Manager Clearance</h3>
        <p className="text-[13px] font-medium text-muted-foreground mb-1">
          Are you sure you want to sign off clearance for <strong className="text-foreground">{memberName}</strong>?
        </p>
        <p className="text-[11px] font-bold text-amber-500 mb-6">This confirms all manager-level tasks are complete.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} /> Sign Off
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── WRITE RECOMMENDATION MODAL ─── */
function WriteRecommendationModal({ memberName, onClose, onSave }: { memberName: string; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-[500px] bg-card rounded-[32px] shadow-2xl border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
              <User size={18} className="text-[#8B5CF6]" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground tracking-tight">Recommendation — {memberName}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-all">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-[11px] font-medium text-muted-foreground">Write a brief recommendation for this employee's future roles.</p>
          <textarea
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
            placeholder="Describe strengths, contributions, and overall recommendation..."
          />
        </div>
        <div className="px-6 py-5 border-t border-border flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">Cancel</button>
          <button onClick={onSave} className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5">
            <Check size={14} /> Save Recommendation
          </button>
        </div>
      </motion.div>
    </div>
  );
}
