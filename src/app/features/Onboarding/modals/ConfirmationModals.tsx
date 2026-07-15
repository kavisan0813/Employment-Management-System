import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Send, Clock, X, Plus } from "lucide-react";
import type { NewHire, OnboardingPhase } from "../types/onboarding.types";
import { showToast } from "../../../components/workflow/ToastNotification";

/* ─── Escalation Modal ─── */
interface EscalationModalProps {
  show: boolean;
  onClose: () => void;
  confirmEscalate: () => void;
}

export function EscalationModal({ show, onClose, confirmEscalate }: EscalationModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] flex items-center justify-center">
                <AlertTriangle size={24} className="text-[#EF4444]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground">Escalate Issue</h2>
                <p className="text-[12px] text-muted-foreground">This will notify the admin about the overdue task.</p>
              </div>
            </div>
            <textarea className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#EF4444]/20 transition-all resize-none" rows={3} placeholder="Reason for escalation..." />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button onClick={confirmEscalate} className="px-5 py-2.5 rounded-xl bg-[#EF4444] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Confirm Escalation</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Phase Complete Confirmation ─── */
interface PhaseConfirmModalProps {
  show: boolean;
  onClose: () => void;
  confirmPhaseComplete: () => void;
}

export function PhaseConfirmModal({ show, onClose, confirmPhaseComplete }: PhaseConfirmModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00B87C]/10 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-[#00B87C]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground">Mark Phase Complete</h2>
                <p className="text-[12px] text-muted-foreground">Are you sure this phase is fully complete?</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button onClick={confirmPhaseComplete} className="px-5 py-2.5 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Confirm</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Send Reminder Modal ─── */
interface ReminderModalProps {
  show: boolean;
  onClose: () => void;
  selected: NewHire;
  phases: OnboardingPhase[];
}

export function ReminderModal({ show, onClose, selected, phases }: ReminderModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-[32px] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center">
                <Send size={20} className="text-[#0EA5E9]" />
              </div>
              <h2 className="text-lg font-black text-foreground">Send Reminder</h2>
            </div>
            <div className="space-y-3 mb-5">
              <p className="text-[12px] font-bold text-muted-foreground">
                Pending tasks for <span className="text-foreground">{selected.name}</span>:
              </p>
              {phases.flatMap((p) => p.tasks).filter((t) => t.status !== "done").slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30">
                  <Clock size={12} className="text-[#F59E0B]" />
                  <span className="text-[12px] font-bold text-foreground">{task.task}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">({task.assignee})</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button
                onClick={() => {
                  showToast("Reminder Sent", "success", `Reminder sent to ${selected.name}'s pending task owners.`);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
              >
                Send Reminder
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Inline Task Form ─── */
interface InlineTaskFormProps {
  show: boolean;
  onClose: () => void;
  inlineTaskText: string;
  setInlineTaskText: (v: string) => void;
  inlineTaskOwner: string;
  setInlineTaskOwner: (v: string) => void;
  inlineTaskDueDate: string;
  setInlineTaskDueDate: (v: string) => void;
  handleAddInlineTask: () => void;
}

export function InlineTaskForm({
  show, onClose,
  inlineTaskText, setInlineTaskText,
  inlineTaskOwner, setInlineTaskOwner,
  inlineTaskDueDate, setInlineTaskDueDate,
  handleAddInlineTask,
}: InlineTaskFormProps) {
  if (!show) return null;
  return (
    <div className="fixed bottom-24 right-8 w-80 bg-card border border-border rounded-2xl shadow-2xl p-4 z-40">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[12px] font-black text-foreground uppercase tracking-wider">Add Task</h4>
        <button onClick={onClose}><X size={16} className="text-muted-foreground" /></button>
      </div>
      <input type="text" placeholder="Task description..." className="w-full px-3 py-2 rounded-xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all mb-2" value={inlineTaskText} onChange={(e) => setInlineTaskText(e.target.value)} />
      <div className="flex items-center gap-2 mb-3">
        <select className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-[11px] font-bold outline-none" value={inlineTaskOwner} onChange={(e) => setInlineTaskOwner(e.target.value)}>
          <option>HR</option><option>IT</option><option>Manager</option><option>Finance</option><option>Employee</option>
        </select>
        <input type="date" className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-[11px] font-bold outline-none" value={inlineTaskDueDate} onChange={(e) => setInlineTaskDueDate(e.target.value)} />
      </div>
      <button onClick={handleAddInlineTask} className="w-full py-2 rounded-xl bg-[#00B87C] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all">Add Task</button>
    </div>
  );
}
